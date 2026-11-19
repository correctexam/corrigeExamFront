/**
 * @jest-environment node
 */
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExamVersionsService } from './exam-versions.service';
import { BuiltVersions, VersionLayout } from './subject-versions';

const layout = (version: number, label: string): VersionLayout => ({
  format: 1,
  version,
  label,
  pages: 4,
  parts: [],
  boxes: [],
  identity: {},
});

const built: BuiltVersions = {
  seed: 42,
  issues: [],
  versions: ['A', 'B'].map((label, index) => ({
    plan: { index, label, order: {}, choices: {}, variants: {} },
    cePlan: { version: label, order: {}, choices: {}, variants: {}, stamp: true, pad: 1 },
    pdf: new Uint8Array([37, 80, 68, 70, index]),
    zones: [],
    layout: layout(index, label),
    pages: 3,
  })),
};

describe('ExamVersionsService', () => {
  let service: ExamVersionsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: DOCUMENT, useValue: { cookie: '' } }],
    });
    service = TestBed.inject(ExamVersionsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('stores the versions, then the PDF of each version', async () => {
    const stored = service.store(7, built);
    const put = http.expectOne({ method: 'PUT', url: 'api/exams/7/versions' });
    expect(put.request.body).toEqual({
      seed: 42,
      versions: [
        { index: 0, label: 'A', plan: built.versions[0].cePlan, layout: layout(0, 'A'), pages: 4 },
        { index: 1, label: 'B', plan: built.versions[1].cePlan, layout: layout(1, 'B'), pages: 4 },
      ],
    });
    put.flush([]);
    for (const index of [0, 1]) {
      // one PDF at a time
      await Promise.resolve();
      await Promise.resolve();
      const pdf = http.expectOne({ method: 'PUT', url: `api/exams/7/versions/${index}/pdf` });
      expect(pdf.request.headers.get('Content-Type')).toBe('application/pdf');
      expect(pdf.request.body).toBeInstanceOf(Blob);
      expect((pdf.request.body as Blob).size).toBe(5);
      pdf.flush({ index, hasPdf: true });
    }
    await expect(stored).resolves.toEqual([
      { index: 0, hasPdf: true },
      { index: 1, hasPdf: true },
    ]);
  });

  it('fails when the server refuses the versions', async () => {
    const stored = service.store(7, built);
    http.expectOne('api/exams/7/versions').flush({ error: 'FROZEN' }, { status: 409, statusText: 'Conflict' });
    await expect(stored).rejects.toMatchObject({ status: 409 });
  });

  it('records the version of each copy', async () => {
    const saved = service.saveCopyVersions(7, [
      { firstPage: 1, label: 'A', edition: 41, copy: 1 },
      { firstPage: 3, label: 'B' },
    ]);
    const req = http.expectOne({ method: 'PUT', url: 'api/exams/7/copy-versions' });
    expect(req.request.body).toEqual([
      { firstPage: 1, label: 'A', edition: 41, copy: 1 },
      { firstPage: 3, label: 'B', edition: null, copy: null },
    ]);
    req.flush([]);
    await expect(saved).resolves.toEqual([]);
  });

  it('reads the PDF of a version', async () => {
    const pdf = service.pdf(7, 1);
    http.expectOne('api/exams/7/versions/1/pdf').flush(new Uint8Array([1, 2, 3]).buffer);
    await expect(pdf).resolves.toEqual(new Uint8Array([1, 2, 3]));
  });
});
