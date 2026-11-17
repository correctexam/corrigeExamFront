import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DiagramRequest } from './subject-diagrams';

/** Edition lock of a subject, as seen by the current user. */
export interface SubjectLock {
  held: boolean;
  mine: boolean;
  lockedBy?: string | null;
  expiresAt?: string | null;
}

export interface SubjectFileInfo {
  path: string;
  size: number;
  sha256: string;
  contentType: string;
  updatedAt?: string | null;
}

/** Subject stored with an exam (T25c): file list without content, revision and lock. */
export interface ExamSubject {
  examId: number;
  mainFile: string;
  revision: number;
  updatedAt?: string | null;
  updatedBy?: string | null;
  files: SubjectFileInfo[];
  lock: SubjectLock;
}

/** A subject the user may copy into a new exam. */
export interface SubjectSummary {
  examId: number;
  examName: string;
  courseId: number;
  courseName: string;
  updatedAt?: string | null;
}

export type SubjectErrorCode =
  | 'NOT_FOUND'
  | 'BAD_PATH'
  | 'LOCKED'
  | 'REVISION_CONFLICT'
  | 'TOO_LARGE'
  | 'STORAGE_UNAVAILABLE'
  | 'FORBIDDEN'
  | 'DIAGRAM_INVALID'
  | 'DIAGRAM_UNAVAILABLE'
  | 'UNKNOWN';

/** Failure of a subject request, with the reason given by the server. */
export class SubjectApiError extends Error {
  constructor(
    readonly code: SubjectErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'SubjectApiError';
  }
}

const SERVER_CODES: readonly SubjectErrorCode[] = [
  'NOT_FOUND',
  'BAD_PATH',
  'LOCKED',
  'REVISION_CONFLICT',
  'TOO_LARGE',
  'STORAGE_UNAVAILABLE',
];

/** Converts an HTTP failure into a `SubjectApiError` (body `{error, message}` from `ExamSubjectResource`). */
export function toSubjectApiError(e: unknown): SubjectApiError {
  if (e instanceof SubjectApiError) {
    return e;
  }
  if (!(e instanceof HttpErrorResponse)) {
    return new SubjectApiError('UNKNOWN', 0, e instanceof Error ? e.message : String(e));
  }
  const body = (typeof e.error === 'object' && e.error !== null ? e.error : {}) as { error?: unknown; message?: unknown };
  const message = typeof body.message === 'string' ? body.message : e.message;
  if (typeof body.error === 'string' && (SERVER_CODES as readonly string[]).includes(body.error)) {
    return new SubjectApiError(body.error as SubjectErrorCode, e.status, message);
  }
  switch (e.status) {
    case 403:
      return new SubjectApiError('FORBIDDEN', 403, message);
    case 404:
      return new SubjectApiError('NOT_FOUND', 404, message);
    case 413:
      return new SubjectApiError('TOO_LARGE', 413, message);
    case 422:
      return new SubjectApiError('DIAGRAM_INVALID', 422, message);
    case 503:
      return new SubjectApiError('STORAGE_UNAVAILABLE', 503, message);
    default:
      return new SubjectApiError('UNKNOWN', e.status, message);
  }
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

/**
 * Client of the subject API (T25c, `ExamSubjectResource` and `SubjectResource`): files of the subject of an exam,
 * revision (`If-Match`), edition lock, reusable subjects and diagrams rendered by Kroki.
 * Every method rejects with a `SubjectApiError`.
 */
@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApplicationConfigService);

  /** The subject of an exam, undefined when the exam has none. */
  async find(examId: number): Promise<ExamSubject | undefined> {
    try {
      return await this.call(this.http.get<ExamSubject>(this.url(examId)));
    } catch (e) {
      if (e instanceof SubjectApiError && e.code === 'NOT_FOUND') {
        return undefined;
      }
      throw e;
    }
  }

  /** Creates the subject (idempotent); the caller holds the lock. */
  create(examId: number): Promise<ExamSubject> {
    return this.call(this.http.post<ExamSubject>(this.url(examId), null));
  }

  readText(examId: number, path: string): Promise<string> {
    return this.call(this.http.get(`${this.url(examId)}/files/${encodePath(path)}`, { responseType: 'text' }));
  }

  async readBytes(examId: number, path: string): Promise<Uint8Array> {
    const buffer = await this.call(this.http.get(`${this.url(examId)}/files/${encodePath(path)}`, { responseType: 'arraybuffer' }));
    return new Uint8Array(buffer);
  }

  /** Writes a file; `revision` = revision known by the editor (409 `REVISION_CONFLICT` if it changed). */
  writeFile(examId: number, path: string, content: string | Uint8Array, contentType: string, revision?: number): Promise<ExamSubject> {
    let headers = new HttpHeaders({ 'Content-Type': contentType });
    if (revision !== undefined) {
      headers = headers.set('If-Match', String(revision));
    }
    const body: string | Blob = typeof content === 'string' ? content : new Blob([content], { type: contentType });
    return this.call(this.http.put<ExamSubject>(`${this.url(examId)}/files/${encodePath(path)}`, body, { headers }));
  }

  deleteFile(examId: number, path: string, revision?: number): Promise<ExamSubject> {
    const headers = revision === undefined ? undefined : new HttpHeaders({ 'If-Match': String(revision) });
    return this.call(this.http.delete<ExamSubject>(`${this.url(examId)}/files/${encodePath(path)}`, { headers }));
  }

  /** Takes or renews the lock; `force` takes it over from another teacher. */
  lock(examId: number, force = false): Promise<ExamSubject> {
    return this.call(this.http.post<ExamSubject>(`${this.url(examId)}/lock`, null, { params: { force } }));
  }

  async unlock(examId: number): Promise<void> {
    await this.call(this.http.delete(`${this.url(examId)}/lock`));
  }

  /** Subjects of the courses of the user, to start a new exam from. */
  listReusable(): Promise<SubjectSummary[]> {
    return this.call(this.http.get<SubjectSummary[]>(this.config.getEndpointFor('api/subjects')));
  }

  /** Renders a diagram (or finds it in the cache) and returns its SVG. */
  async renderDiagram(request: DiagramRequest): Promise<string> {
    try {
      const rendered = await firstValueFrom(
        this.http.post<{ kind: string; sha256: string }>(this.config.getEndpointFor('api/subject-diagrams'), request),
      );
      return await firstValueFrom(
        this.http.get(this.config.getEndpointFor(`api/subject-diagrams/${rendered.kind}/${rendered.sha256}.svg`), { responseType: 'text' }),
      );
    } catch (e) {
      const error = toSubjectApiError(e);
      if (error.code === 'DIAGRAM_INVALID' || error.code === 'TOO_LARGE') {
        throw error;
      }
      throw new SubjectApiError('DIAGRAM_UNAVAILABLE', error.status, error.message);
    }
  }

  private url(examId: number): string {
    return this.config.getEndpointFor(`api/exams/${examId}/subject`);
  }

  private async call<T>(request: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(request);
    } catch (e) {
      throw toSubjectApiError(e);
    }
  }
}
