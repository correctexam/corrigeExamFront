import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable, Subscription } from 'rxjs';

/**
 * Contrat d'alignement serveur (POST /api/scansalign + suivi SSE GET /api/scansalign/{examId}/events).
 * Le nommage des champs suit exactement ScanRequestDto (snake_case via @JsonProperty côté back).
 */
export interface ScanRequestPayload {
  pages_to_manage: string;
  exam_id: number;
  template_id: number;
  scan_id: number;
  /** 0=NoAlign, 1=CircleAlign, 2=Akaze */
  algo: number;
  heightresolution: number;
  corner_square_size: number;
  min_radius: number;
}

/**
 * Statuts émis sur le flux SSE (constantes de ScanStatusDto côté back) :
 * - `connected` : envoyé par le back dès que l'abonnement est actif, le job peut être soumis ;
 * - `running` : une page a été traitée par le worker ;
 * - `finished` : job terminé, le cache `cache/{examId}.sqlite3` est disponible ;
 * - `error` : job en échec, `details` contient la raison.
 */
export const SCAN_STATUS_CONNECTED = 'connected';
export const SCAN_STATUS_RUNNING = 'running';
export const SCAN_STATUS_FINISHED = 'finished';
export const SCAN_STATUS_ERROR = 'error';

/**
 * Statut reçu sur le flux SSE (ScanStatusDto côté back).
 */
export interface ScanStatusDto {
  exam_id: number;
  page: number;
  status: string;
  progress: number;
  details: string;
}

/** Délai maximal d'attente de l'événement `connected` avant de soumettre quand même le job (back plus ancien). */
export const SERVER_ALIGN_CONNECT_TIMEOUT_MS = 5_000;
/** Délai maximal sans aucun statut du worker avant de considérer le job comme perdu. */
export const SERVER_ALIGN_INACTIVITY_TIMEOUT_MS = 5 * 60_000;

export type ScanAlignFailure = 'worker' | 'submit' | 'timeout' | 'connection';

/** Échec d'un job d'alignement serveur. */
export class ScanAlignError extends Error {
  constructor(
    readonly reason: ScanAlignFailure,
    message: string,
  ) {
    super(message);
    this.name = 'ScanAlignError';
  }
}

export interface ScanAlignJobOptions {
  connectTimeoutMs?: number;
  inactivityTimeoutMs?: number;
}

/** Statuts terminaux de succès (les deux derniers pour compatibilité avec d'anciens workers). */
const FINISHED_STATUSES = [SCAN_STATUS_FINISHED, 'DONE', 'SUCCESS'];

/**
 * Paramètres de calibration du worker d'alignement serveur.
 * Aucune valeur n'existait côté front : ce sont des placeholders à ajuster
 * selon le contrat exact du worker externe qui consomme scan_jobs_queue.
 */
export const SERVER_ALIGN_HEIGHTRESOLUTION = 2000;
export const SERVER_ALIGN_CORNER_SQUARE_SIZE = 300;
export const SERVER_ALIGN_MIN_RADIUS = 10;

/**
 * Formate la liste des pages à gérer au format « 1-3; 5 » :
 * plages contiguës séparées par « ; », pages isolées seules.
 */
export function pagesToManage(pages: number[]): string {
  const sorted = [...pages].sort((a, b) => a - b);
  if (sorted.length === 0) {
    return '';
  }
  const parts: string[] = [];
  let runStart = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) {
      prev = cur;
    } else {
      parts.push(runStart === prev ? `${runStart}` : `${runStart}-${prev}`);
      runStart = cur;
      prev = cur;
    }
  }
  parts.push(runStart === prev ? `${runStart}` : `${runStart}-${prev}`);
  return parts.join('; ');
}

export function serverAlgoFromMode(mode: string): number {
  switch (mode) {
    case 'marker':
      return 1;
    case 'nomarker':
      return 2;
    case 'off':
    default:
      return 0;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ScanAlignService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
  ) {}

  /**
   * POST /api/scansalign — envoie le job d'alignement au worker serveur via RabbitMQ.
   */
  launch(payload: ScanRequestPayload): Observable<void> {
    return this.http.post<void>(this.applicationConfigService.getEndpointFor('api/scansalign'), payload);
  }

  /**
   * Ouvre la connexion SSE /api/scansalign/{examId}/events (filtrée par exam_id côté back).
   * Le flux est un hot stream qui ne se termine jamais seul : le client doit le fermer
   * lui-même une fois toutes les pages demandées récupérées.
   */
  streamProgress(examId: number): EventSource {
    return new EventSource(this.applicationConfigService.getEndpointFor('api/scansalign/' + examId + '/events'));
  }

  /**
   * Exécute un job d'alignement serveur de bout en bout et émet les statuts de page.
   *
   * Le flux SSE ne rejoue pas les événements passés : il est donc ouvert AVANT la soumission,
   * et le job n'est soumis qu'à réception de l'événement `connected` (ou après
   * `connectTimeoutMs` si le back ne l'envoie pas).
   *
   * L'observable se termine sur `finished` et échoue avec une {@link ScanAlignError} sur
   * un statut `error`, un échec du POST, une connexion SSE fermée ou une absence de statut
   * pendant `inactivityTimeoutMs`. Se désabonner ferme la connexion SSE.
   */
  runJob(payload: ScanRequestPayload, options: ScanAlignJobOptions = {}): Observable<ScanStatusDto> {
    const connectTimeoutMs = options.connectTimeoutMs ?? SERVER_ALIGN_CONNECT_TIMEOUT_MS;
    const inactivityTimeoutMs = options.inactivityTimeoutMs ?? SERVER_ALIGN_INACTIVITY_TIMEOUT_MS;

    return new Observable<ScanStatusDto>(subscriber => {
      const source = this.streamProgress(payload.exam_id);
      let submitted = false;
      let launchSubscription: Subscription | undefined;
      let inactivityTimer: ReturnType<typeof setTimeout> | undefined;

      const fail = (error: ScanAlignError): void => subscriber.error(error);
      const resetInactivity = (): void => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(
          () => fail(new ScanAlignError('timeout', `No status received from the alignment worker for ${inactivityTimeoutMs} ms`)),
          inactivityTimeoutMs,
        );
      };
      const submit = (): void => {
        if (submitted) {
          return;
        }
        submitted = true;
        clearTimeout(connectTimer);
        resetInactivity();
        launchSubscription = this.launch(payload).subscribe({
          error: (e: unknown) => fail(new ScanAlignError('submit', 'Alignment job submission failed: ' + describe(e))),
        });
      };
      // `submit` lit connectTimer de façon différée (callbacks), après cette initialisation
      const connectTimer = setTimeout(submit, connectTimeoutMs);

      source.onmessage = (ev: MessageEvent) => {
        const dto = parseStatus(ev.data);
        if (dto === undefined) {
          return;
        }
        if (dto.status === SCAN_STATUS_CONNECTED) {
          submit();
          return;
        }
        resetInactivity();
        if (dto.status === SCAN_STATUS_ERROR) {
          fail(new ScanAlignError('worker', dto.details || 'Alignment failed on the server'));
          return;
        }
        subscriber.next(dto);
        // Terminer sur `finished` uniquement : un statut de page à 100 % arrive AVANT
        // l'envoi du cache sur S3, l'importer à ce moment donnerait un cache périmé.
        if (FINISHED_STATUSES.includes(dto.status)) {
          subscriber.complete();
        }
      };
      source.onerror = () => {
        // EventSource se reconnecte seul tant que readyState n'est pas CLOSED
        if (source.readyState === EventSource.CLOSED) {
          fail(new ScanAlignError('connection', 'Connection to the alignment progress stream lost'));
        }
      };

      return () => {
        clearTimeout(connectTimer);
        clearTimeout(inactivityTimer);
        launchSubscription?.unsubscribe();
        source.close();
      };
    });
  }
}

function parseStatus(data: unknown): ScanStatusDto | undefined {
  if (typeof data !== 'string') {
    return undefined;
  }
  try {
    const dto = JSON.parse(data) as ScanStatusDto;
    return typeof dto?.status === 'string' ? dto : undefined;
  } catch {
    return undefined;
  }
}

function describe(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  const status = (e as { status?: number } | null)?.status;
  return status !== undefined ? 'HTTP ' + status : String(e);
}
