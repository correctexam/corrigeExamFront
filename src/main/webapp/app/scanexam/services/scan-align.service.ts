import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable, Subscription, catchError, map, of } from 'rxjs';

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

/** Job accepté par le back et en file d'attente : le worker n'a encore publié aucun statut. */
export const SCAN_STATUS_SUBMITTED = 'submitted';

/**
 * État connu d'un job d'alignement serveur (ScanAlignJobDto côté back,
 * GET /api/scansalign/{examId}/status).
 */
export interface ScanAlignJobDto {
  exam_id: number;
  /** `submitted`, `running`, `finished` ou `error`. */
  status: string;
  /** Pages demandées (« 1-3; 5 ») ; absent si le job a été soumis avant un redémarrage du back. */
  pages_to_manage?: string | null;
  page: number;
  /** Avancement global du job (0-100). */
  progress: number;
  details?: string | null;
  submitted_at?: string | null;
  updated_at: string;
}

/** Un job `submitted` ou `running` est en cours : il faut le suivre plutôt qu'en lancer un autre. */
export function isActiveJob(job: ScanAlignJobDto | null | undefined): job is ScanAlignJobDto {
  return job?.status === SCAN_STATUS_SUBMITTED || job?.status === SCAN_STATUS_RUNNING;
}

/**
 * Nombre de pages d'une liste au format de {@link pagesToManage} (« 1-3; 5 » → 4).
 * Renvoie 0 si la liste est absente ou illisible (« all », job soumis ailleurs).
 */
export function countPages(pages: string | null | undefined): number {
  if (!pages) {
    return 0;
  }
  let total = 0;
  for (const part of pages.split(';')) {
    const m = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(part);
    if (m === null) {
      return 0;
    }
    const start = +m[1];
    const end = m[2] !== undefined ? +m[2] : start;
    if (end < start) {
      return 0;
    }
    total += end - start + 1;
  }
  return total;
}

/** Délai maximal d'attente de l'événement `connected` avant de soumettre quand même le job (back plus ancien). */
export const SERVER_ALIGN_CONNECT_TIMEOUT_MS = 5_000;
/** Délai maximal sans aucun statut du worker avant de considérer le job comme perdu. */
export const SERVER_ALIGN_INACTIVITY_TIMEOUT_MS = 5 * 60_000;

/**
 * - `worker` : le worker a publié un statut `error` ;
 * - `submit` : le POST a échoué (`conflict` s'il a été refusé car un job est déjà en cours) ;
 * - `timeout` : aucun statut pendant le délai d'inactivité et le back ne connaît plus le job ;
 * - `connection` : flux SSE fermé ;
 * - `lost` : job suivi dont le back n'a plus aucune trace (redémarrage du back).
 */
export type ScanAlignFailure = 'worker' | 'submit' | 'conflict' | 'timeout' | 'connection' | 'lost';

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

/** Statut de fin de job réussie (le cache `cache/{examId}.sqlite3` est prêt). */
export function isFinishedStatus(status: string | undefined): boolean {
  return status !== undefined && FINISHED_STATUSES.includes(status);
}

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
   * GET /api/scansalign/{examId}/status — dernier état connu du job de l'examen,
   * `null` s'il n'y en a pas (204) ou si le back ne propose pas cet endpoint (version antérieure).
   */
  getJob(examId: number): Observable<ScanAlignJobDto | null> {
    return this.http
      .get<ScanAlignJobDto>(this.applicationConfigService.getEndpointFor('api/scansalign/' + examId + '/status'), { observe: 'response' })
      .pipe(
        map((res: HttpResponse<ScanAlignJobDto>) => (res.status === 200 && res.body ? res.body : null)),
        catchError(() => of(null)),
      );
  }

  /** Job en cours (`submitted` ou `running`) pour l'examen, `null` sinon. */
  getActiveJob(examId: number): Observable<ScanAlignJobDto | null> {
    return this.getJob(examId).pipe(map(job => (isActiveJob(job) ? job : null)));
  }

  /**
   * Exécute un job d'alignement serveur de bout en bout et émet les statuts de page.
   *
   * Le flux SSE ne rejoue pas les événements passés : il est donc ouvert AVANT la soumission,
   * et le job n'est soumis qu'à réception de l'événement `connected` (ou après
   * `connectTimeoutMs` si le back ne l'envoie pas).
   *
   * L'observable se termine sur `finished` et échoue avec une {@link ScanAlignError} sur
   * un statut `error`, un échec du POST (`conflict` si un job est déjà en cours pour l'examen),
   * une connexion SSE fermée ou une absence de statut pendant `inactivityTimeoutMs` alors
   * que le back ne voit plus le job actif. Se désabonner ferme la connexion SSE.
   */
  runJob(payload: ScanRequestPayload, options: ScanAlignJobOptions = {}): Observable<ScanStatusDto> {
    const connectTimeoutMs = options.connectTimeoutMs ?? SERVER_ALIGN_CONNECT_TIMEOUT_MS;
    return this.watch(payload.exam_id, options, ctx => {
      let submitted = false;
      let launchSubscription: Subscription | undefined;
      const submit = (): void => {
        if (submitted) {
          return;
        }
        submitted = true;
        clearTimeout(connectTimer);
        ctx.resetInactivity();
        launchSubscription = this.launch(payload).subscribe({
          error: (e: unknown) =>
            (e as { status?: number } | null)?.status === 409
              ? ctx.fail(new ScanAlignError('conflict', 'An alignment job is already running for this exam'))
              : ctx.fail(new ScanAlignError('submit', 'Alignment job submission failed: ' + describe(e))),
        });
      };
      // `submit` lit connectTimer de façon différée (callbacks), après cette initialisation
      const connectTimer = setTimeout(submit, connectTimeoutMs);
      return {
        onConnected: submit,
        teardown() {
          clearTimeout(connectTimer);
          launchSubscription?.unsubscribe();
        },
      };
    });
  }

  /**
   * Se raccroche à un job déjà lancé (par cet onglet avant un rechargement, un autre onglet
   * ou un autre enseignant) et émet ses statuts jusqu'à la fin, comme {@link runJob}.
   *
   * Une fois le flux SSE ouvert (`connected`), l'état du job est relu sur le back : cela
   * donne l'avancement courant sans attendre la page suivante et couvre le cas d'un job
   * terminé entre la détection et l'abonnement.
   */
  followJob(examId: number, options: ScanAlignJobOptions = {}): Observable<ScanStatusDto> {
    return this.watch(examId, options, ctx => {
      let stateSubscription: Subscription | undefined;
      const readState = (): Observable<ScanAlignJobDto | null> => this.getJob(examId);
      return {
        onConnected() {
          stateSubscription?.unsubscribe();
          stateSubscription = readState().subscribe(job => {
            if (job === null) {
              ctx.fail(new ScanAlignError('lost', 'The alignment job is no longer known by the server'));
            } else if (job.status !== SCAN_STATUS_SUBMITTED) {
              ctx.handle(jobToStatus(job));
            }
          });
        },
        teardown() {
          stateSubscription?.unsubscribe();
        },
      };
    });
  }

  /**
   * Socle commun de {@link runJob} et {@link followJob} : flux SSE, délai d'inactivité,
   * statuts terminaux. `start` reçoit les actions sur le job et renvoie ce qu'il faut faire
   * à la réception de `connected` et à la fin.
   */
  private watch(examId: number, options: ScanAlignJobOptions, start: (ctx: WatchContext) => WatchHooks): Observable<ScanStatusDto> {
    const inactivityTimeoutMs = options.inactivityTimeoutMs ?? SERVER_ALIGN_INACTIVITY_TIMEOUT_MS;

    return new Observable<ScanStatusDto>(subscriber => {
      const source = this.streamProgress(examId);
      let inactivityTimer: ReturnType<typeof setTimeout> | undefined;
      let checkSubscription: Subscription | undefined;

      const fail = (error: ScanAlignError): void => subscriber.error(error);
      const handle = (dto: ScanStatusDto): void => {
        if (subscriber.closed) {
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
      // Sans nouvelles du worker, on demande au back avant d'abandonner : un job en file
      // d'attente derrière un gros examen peut rester longtemps sans statut. Le back
      // déclare lui-même le job perdu au-delà de son propre délai.
      const onInactivity = (): void => {
        checkSubscription?.unsubscribe();
        checkSubscription = this.getJob(examId).subscribe(job => {
          if (isActiveJob(job)) {
            resetInactivity();
          } else if (job !== null) {
            // terminé (`finished` / `error`) sans que le statut ne nous parvienne
            handle(jobToStatus(job));
          } else {
            fail(new ScanAlignError('timeout', `No status received from the alignment worker for ${inactivityTimeoutMs} ms`));
          }
        });
      };
      const resetInactivity = (): void => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(onInactivity, inactivityTimeoutMs);
      };

      const hooks = start({ fail, handle, resetInactivity });
      resetInactivity();

      source.onmessage = (ev: MessageEvent) => {
        const dto = parseStatus(ev.data);
        if (dto === undefined) {
          return;
        }
        if (dto.status === SCAN_STATUS_CONNECTED) {
          hooks.onConnected();
          return;
        }
        handle(dto);
      };
      source.onerror = () => {
        // EventSource se reconnecte seul tant que readyState n'est pas CLOSED
        if (source.readyState === EventSource.CLOSED) {
          fail(new ScanAlignError('connection', 'Connection to the alignment progress stream lost'));
        }
      };

      return () => {
        clearTimeout(inactivityTimer);
        checkSubscription?.unsubscribe();
        hooks.teardown();
        source.close();
      };
    });
  }
}

interface WatchContext {
  fail(error: ScanAlignError): void;
  handle(dto: ScanStatusDto): void;
  resetInactivity(): void;
}

interface WatchHooks {
  onConnected(): void;
  teardown(): void;
}

/** Convertit l'état d'un job en statut de flux, pour le traiter comme un message SSE. */
export function jobToStatus(job: ScanAlignJobDto): ScanStatusDto {
  return { exam_id: job.exam_id, page: job.page, status: job.status, progress: job.progress, details: job.details ?? '' };
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
