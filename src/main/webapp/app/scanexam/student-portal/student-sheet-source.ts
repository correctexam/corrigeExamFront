import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ParamMap } from '@angular/router';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IStudentSheetView } from './student-portal.model';
import { StudentSessionService } from './student-session.service';

/**
 * Where a student view reads its sheet (ADR 0003): through the UUID of a /copie link, or through the session of the
 * student portal. Pages are numbered from 1 within the sheet; best answers are read by index, never by sheet.
 */
export interface StudentSheetSource {
  /** Identifier of the sheet for this page (canvas ids). */
  readonly id: string;
  /** Pages may be kept in the IndexedDB of the browser (not in the portal: shared computers). */
  readonly persistentCache: boolean;
  view(): Observable<IStudentSheetView>;
  page(page: number, noalign: boolean): Observable<string>;
  countBestAnswers(numero: number): Observable<number>;
  bestAnswerPage(numero: number, index: number, page: number, noalign: boolean): Observable<string>;
  /** Route of the question at this position (from 1). */
  questionLink(position: number): string;
  /** Route of the index-th starred answer to question numero. */
  bestAnswerLink(numero: number, index: number): string;
}

class HttpSheetSource implements StudentSheetSource {
  constructor(
    readonly id: string,
    readonly persistentCache: boolean,
    private readonly http: HttpClient,
    private readonly base: string,
    private readonly headers: () => HttpHeaders,
    private readonly links: { question: (position: number) => string; best: (numero: number, index: number) => string },
  ) {}

  view(): Observable<IStudentSheetView> {
    return this.http.get<IStudentSheetView>(this.base, { headers: this.headers() });
  }

  page(page: number, noalign: boolean): Observable<string> {
    return this.text(`${this.base}/page/${page}`, noalign);
  }

  countBestAnswers(numero: number): Observable<number> {
    return this.http.get<{ count: number }>(`${this.base}/best/${numero}`, { headers: this.headers() }).pipe(map(r => r.count));
  }

  bestAnswerPage(numero: number, index: number, page: number, noalign: boolean): Observable<string> {
    return this.text(`${this.base}/best/${numero}/${index}/page/${page}`, noalign);
  }

  questionLink(position: number): string {
    return this.links.question(position);
  }

  bestAnswerLink(numero: number, index: number): string {
    return this.links.best(numero, index);
  }

  private text(url: string, noalign: boolean): Observable<string> {
    return this.http.get(url, { headers: this.headers(), params: noalign ? { noalign: 'true' } : {}, responseType: 'text' });
  }
}

/** Link of a starred answer read through the UUID of a sheet: base 64 of `/{uuid}/{numero}/{index}`. */
export function encodePublicBestAnswer(uuid: string, numero: number, index: number): string {
  return btoa(`/${uuid}/${numero}/${index}`);
}

export function decodePublicBestAnswer(encoded: string): { uuid: string; numero: number; index: number } | undefined {
  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return undefined;
  }
  // Links of the former format (/{uuid of the other sheet}/{numero}/) have no index: they are no longer served
  const parts = decoded.split('/');
  if (parts.length !== 4 || parts[1] === '' || !/^\d+$/.test(parts[2]) || !/^\d+$/.test(parts[3])) {
    return undefined;
  }
  return { uuid: parts[1], numero: +parts[2], index: +parts[3] };
}

@Injectable({ providedIn: 'root' })
export class StudentSheetSourceFactory {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApplicationConfigService);
  private readonly session = inject(StudentSessionService);

  /** Sheet of a /copie/{uuid} link: no authentication, the UUID is the capability. */
  byUuid(uuid: string): StudentSheetSource {
    const id = encodeURIComponent(uuid);
    return new HttpSheetSource(`u${uuid}`, true, this.http, this.config.getEndpointFor(`api/public/copie/${id}`), () => new HttpHeaders(), {
      question: position => `/copie/${uuid}/${position}`,
      best: (numero, index) => `/reponse/${encodePublicBestAnswer(uuid, numero, index)}`,
    });
  }

  /** Sheet of the student portal: the session of the student, sent explicitly. */
  bySheetId(sheetId: number): StudentSheetSource {
    return new HttpSheetSource(
      `s${sheetId}`,
      false,
      this.http,
      this.config.getEndpointFor(`api/student/me/sheets/${sheetId}`),
      () => this.session.headers(),
      {
        question: position => `/my/sheets/${sheetId}/${position}`,
        best: (numero, index) => `/my/reponse/${sheetId}/${numero}/${index}`,
      },
    );
  }

  /** Source of a route with a `uuid` or a `sheetId` parameter. */
  fromRoute(params: ParamMap): StudentSheetSource | undefined {
    const uuid = params.get('uuid');
    if (uuid !== null && uuid !== '') {
      return this.byUuid(uuid);
    }
    const sheetId = params.get('sheetId');
    if (sheetId !== null && /^\d+$/.test(sheetId)) {
      return this.bySheetId(+sheetId);
    }
    return undefined;
  }
}
