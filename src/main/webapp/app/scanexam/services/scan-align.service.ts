import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';

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
 * Statut reçu sur le flux SSE (ScanStatusDto côté back).
 */
export interface ScanStatusDto {
  exam_id: number;
  page: number;
  status: string;
  progress: number;
  details: string;
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
}
