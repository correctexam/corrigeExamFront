import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { TemplateService } from 'app/entities/template/service/template.service';
import type { PrintProgress } from './print-copies';
import { createPrintWorker } from './print-worker-factory';
import { PrintWorkerRequest, PrintWorkerResponse } from './print-worker.protocol';

/** Print run of an exam (T25d, `ExamEditionResource`). */
export interface ExamEdition {
  id: number;
  examId: number;
  copies: number;
  pagesPerCopy: number;
  /** Versions of the subject in the print run (T25e): copy c is printed in version (c - 1) mod versions. */
  versions?: number;
  createdAt?: string | null;
  createdBy?: string | null;
}

/**
 * Printing of an exam written in Typst (T25d, ADR 0004): the server records the print run (its id goes into the page
 * codes), the browser assembles the PDF from the template of the exam in a Web Worker. Nothing is stored: printing a
 * print run again gives the same PDF, with the same codes.
 */
@Injectable({ providedIn: 'root' })
export class ExamPrintService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApplicationConfigService);
  private readonly templateService = inject(TemplateService);
  private nextId = 0;

  listEditions(examId: number): Promise<ExamEdition[]> {
    return firstValueFrom(this.http.get<ExamEdition[]>(this.url(examId)));
  }

  /** Records a print run; with `versions` > 1 the server checks the stored versions and freezes them. */
  createEdition(examId: number, copies: number, pagesPerCopy: number, versions = 1): Promise<ExamEdition> {
    const body = versions > 1 ? { copies, pagesPerCopy, versions } : { copies, pagesPerCopy };
    return firstValueFrom(this.http.post<ExamEdition>(this.url(examId), body));
  }

  /** PDF of the template of the exam (the sheets the zones were made from). */
  async templatePdf(templateId: number): Promise<Uint8Array> {
    const blob = (await firstValueFrom(this.templateService.getPdf(templateId))) as Blob;
    return new Uint8Array(await blob.arrayBuffer());
  }

  /** Pages of a PDF; pdf-lib is loaded on demand, not with the exam page. */
  async pageCount(pdf: Uint8Array): Promise<number> {
    const { countPages } = await import('./print-copies');
    return countPages(pdf);
  }

  /**
   * Assembles the PDF of a print run off the UI thread: one template per version of the print run (version A first),
   * copy c printed from template (c - 1) mod templates.length.
   */
  assemble(templates: Uint8Array[], edition: ExamEdition, onProgress?: (p: PrintProgress) => void, labels?: string[]): Promise<Uint8Array> {
    const worker = this.createWorker();
    const request: PrintWorkerRequest = {
      kind: 'print',
      id: ++this.nextId,
      templates,
      labels,
      edition: edition.id,
      copies: edition.copies,
    };
    return new Promise<Uint8Array>((resolve, reject) => {
      worker.onmessage = ({ data }: MessageEvent<PrintWorkerResponse>) => {
        if (data.kind === 'progress') {
          onProgress?.({ done: data.done, total: data.total });
          return;
        }
        worker.terminate();
        if (data.kind === 'printed') {
          resolve(data.pdf);
        } else {
          reject(new Error(data.message));
        }
      };
      worker.onerror = (e: ErrorEvent) => {
        e.preventDefault();
        worker.terminate();
        reject(new Error(e.message || 'print worker error'));
      };
      worker.postMessage(request);
    });
  }

  /** Creates the worker; isolated so that tests can provide a fake one. */
  protected createWorker(): Worker {
    return createPrintWorker();
  }

  private url(examId: number): string {
    return this.config.getEndpointFor(`api/exams/${examId}/editions`);
  }
}
