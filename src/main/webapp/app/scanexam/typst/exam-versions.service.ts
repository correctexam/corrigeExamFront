import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import type { BuiltVersions, VersionLayout } from './subject-versions';
import type { CopyVersionRecord } from './version-rebuild';

/** Version of an exam as stored by the server (T25e2, `ExamVersionResource`). */
export interface ExamVersion {
  id: number;
  examId: number;
  index: number;
  label: string;
  seed: number;
  /** `ce-plan` input the version was compiled with. */
  plan: Record<string, unknown>;
  layout: VersionLayout;
  pages: number;
  hasPdf: boolean;
  pdfSize?: number | null;
  createdAt?: string | null;
  createdBy?: string | null;
}

/**
 * Versions of an exam written in Typst (T25e, ADR 0005): plan and layout of each version in the database, its PDF in
 * the object storage. Written once, when the exam is created; frozen by the server after the first print run of
 * several versions.
 */
@Injectable({ providedIn: 'root' })
export class ExamVersionsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApplicationConfigService);

  list(examId: number): Promise<ExamVersion[]> {
    return firstValueFrom(this.http.get<ExamVersion[]>(this.url(examId)));
  }

  /** Records the versions (replacing the previous ones), then the PDF of each version. */
  async store(examId: number, built: BuiltVersions): Promise<ExamVersion[]> {
    const body = {
      seed: built.seed,
      versions: built.versions.map(v => ({
        index: v.plan.index,
        label: v.plan.label,
        plan: v.cePlan,
        layout: v.layout,
        pages: v.layout.pages,
      })),
    };
    await firstValueFrom(this.http.put<ExamVersion[]>(this.url(examId), body));
    const stored: ExamVersion[] = [];
    // one at a time: a version PDF can weigh several megabytes
    for (const v of built.versions) {
      stored.push(await this.uploadPdf(examId, v.plan.index, v.pdf));
    }
    return stored;
  }

  uploadPdf(examId: number, index: number, pdf: Uint8Array): Promise<ExamVersion> {
    // a copy in a plain ArrayBuffer: the PDF may be a view on a larger (or shared) buffer
    const body = new Blob([pdf.slice()], { type: 'application/pdf' });
    return firstValueFrom(
      this.http.put<ExamVersion>(`${this.url(examId)}/${index}/pdf`, body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/pdf' }),
      }),
    );
  }

  async pdf(examId: number, index: number): Promise<Uint8Array> {
    const buffer = await firstValueFrom(this.http.get(`${this.url(examId)}/${index}/pdf`, { responseType: 'arraybuffer' }));
    return new Uint8Array(buffer);
  }

  /** Version of each copy of the scan (T25e6b): replaces the list recorded by the back, for the statistics. */
  saveCopyVersions(examId: number, copies: CopyVersionRecord[]): Promise<CopyVersionRecord[]> {
    const body = copies.map(c => ({ firstPage: c.firstPage, label: c.label, edition: c.edition ?? null, copy: c.copy ?? null }));
    return firstValueFrom(this.http.put<CopyVersionRecord[]>(this.config.getEndpointFor(`api/exams/${examId}/copy-versions`), body));
  }

  private url(examId: number): string {
    return this.config.getEndpointFor(`api/exams/${examId}/versions`);
  }
}
