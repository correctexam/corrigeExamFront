/**
 * @jest-environment node
 */
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TemplateService } from 'app/entities/template/service/template.service';
import { ExamEdition, ExamPrintService } from './exam-print.service';
import { PrintWorkerRequest, PrintWorkerResponse } from './print-worker.protocol';

jest.mock('./print-worker-factory', () => ({ createPrintWorker: () => undefined }));

/** Worker answering like `print.worker.ts`. */
class FakeWorker {
  onmessage?: (e: MessageEvent<PrintWorkerResponse>) => void;
  onerror?: (e: ErrorEvent) => void;
  terminated = false;
  constructor(private readonly fail = false) {}
  postMessage(req: PrintWorkerRequest): void {
    setTimeout(() => {
      for (let c = 1; c <= req.copies; c++) {
        this.onmessage?.({ data: { kind: 'progress', id: req.id, done: c, total: req.copies } } as MessageEvent<PrintWorkerResponse>);
      }
      const data: PrintWorkerResponse = this.fail
        ? { kind: 'failure', id: req.id, message: 'broken template' }
        : { kind: 'printed', id: req.id, pdf: new Uint8Array([req.edition]) };
      this.onmessage?.({ data } as MessageEvent<PrintWorkerResponse>);
    });
  }
  terminate(): void {
    this.terminated = true;
  }
}

describe('ExamPrintService', () => {
  let service: ExamPrintService;
  let http: HttpTestingController;
  let worker: FakeWorker;
  const edition: ExamEdition = { id: 12, examId: 7, copies: 3, pagesPerCopy: 4 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // a document with cookies only (XSRF): the spec also runs without a DOM
        { provide: DOCUMENT, useValue: { cookie: '' } },
        { provide: TemplateService, useValue: { getPdf: () => of(new Blob([new Uint8Array([37, 80, 68, 70])])) } },
      ],
    });
    service = TestBed.inject(ExamPrintService);
    http = TestBed.inject(HttpTestingController);
    jest.spyOn(service as unknown as { createWorker: () => Worker }, 'createWorker').mockImplementation(() => worker as unknown as Worker);
  });

  afterEach(() => http.verify());

  it('records a print run with the pages of the template', async () => {
    const created = service.createEdition(7, 3, 4);
    const req = http.expectOne('api/exams/7/editions');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ copies: 3, pagesPerCopy: 4 });
    req.flush(edition);
    await expect(created).resolves.toEqual(edition);
  });

  it('records a print run of several versions', async () => {
    const created = service.createEdition(7, 30, 4, 3);
    const req = http.expectOne('api/exams/7/editions');
    expect(req.request.body).toEqual({ copies: 30, pagesPerCopy: 4, versions: 3 });
    req.flush({ ...edition, versions: 3 });
    await expect(created).resolves.toEqual({ ...edition, versions: 3 });
  });

  it('sends one template per version to the worker', async () => {
    worker = new FakeWorker();
    const posted = jest.spyOn(worker, 'postMessage');
    await service.assemble([new Uint8Array([1]), new Uint8Array([2])], { ...edition, versions: 2 }, undefined, ['A', 'B']);
    expect(posted.mock.calls[0][0]).toMatchObject({ templates: [new Uint8Array([1]), new Uint8Array([2])], labels: ['A', 'B'], copies: 3 });
  });

  it('reads the template PDF', async () => {
    await expect(service.templatePdf(5)).resolves.toEqual(new Uint8Array([37, 80, 68, 70]));
  });

  it('assembles off the UI thread and reports the progress', async () => {
    worker = new FakeWorker();
    const progress: number[] = [];
    await expect(service.assemble([new Uint8Array([1])], edition, p => progress.push(p.done))).resolves.toEqual(new Uint8Array([12]));
    expect(progress).toEqual([1, 2, 3]);
    expect(worker.terminated).toBe(true);
  });

  it('rejects when the worker fails', async () => {
    worker = new FakeWorker(true);
    await expect(service.assemble([new Uint8Array([1])], edition)).rejects.toThrow('broken template');
    expect(worker.terminated).toBe(true);
  });
});
