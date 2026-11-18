/**
 * @jest-environment node
 */
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { ExamPrintService } from './exam-print.service';
import { ExamVersionsService } from './exam-versions.service';
import { PageCodeCheckService } from './page-code-check.service';
import { VersionLayout } from './subject-versions';
import { VersionRebuildService } from './version-rebuild.service';

// the cache (Dexie) and the worker need a browser: replaced by fakes
jest.mock('../db/CacheServiceImpl', () => ({ CacheServiceImpl: class {} }));
jest.mock('./page-code-check.service', () => ({ PageCodeCheckService: class {} }));
jest.mock('./print-worker-factory', () => ({ createPrintWorker: () => undefined }));

const layout = (version: number): VersionLayout => ({
  format: 1,
  version,
  label: 'ABC'[version],
  pages: 2,
  parts: [],
  boxes: [],
  identity: {},
});
const versions = [0, 1, 2].map(index => ({ index, label: 'ABC'[index], pages: 2, layout: layout(index), hasPdf: true }));

/** Aligned pages of the cache: `img:<page>` images; the code of each page is given by `codes`. */
class FakeCache {
  aligned = new Map<number, string>();
  countAlignImage = jest.fn(() => Promise.resolve(this.aligned.size));
  getAlignImagesForPageNumbers = jest.fn((_: number, pages: number[]) =>
    Promise.resolve(pages.filter(p => this.aligned.has(p)).map(p => ({ examId: 7, pageNumber: p, value: this.aligned.get(p)! }))),
  );
  getFirstTemplate = jest.fn((_: number, p: number) =>
    Promise.resolve({ examId: 7, pageNumber: p, value: JSON.stringify({ pages: `tpl:${p}` }) }),
  );
  removePageAlignForExamForPage = jest.fn((_: number, p: number) => Promise.resolve(void this.aligned.delete(p)));
  addAligneImage = jest.fn((e: { pageNumber: number; value: string }) => Promise.resolve(this.aligned.set(e.pageNumber, e.value)));

  constructor(pages: number) {
    for (let p = 1; p <= pages; p++) {
      this.aligned.set(p, JSON.stringify({ pages: `img:${p}` }));
    }
  }
}

describe('VersionRebuildService', () => {
  let cache: FakeCache;
  let codes: Record<string, string | undefined>;
  let editions: { id: number; examId: number; copies: number; pagesPerCopy: number; versions?: number }[];
  let rebuildImages: jest.Mock;
  let service: VersionRebuildService;

  const setup = (pages: number): void => {
    cache = new FakeCache(pages);
    rebuildImages = jest.fn((req: { copy: string[]; mention: string }) =>
      Promise.resolve({ images: req.copy.map(c => `${c}>${req.mention}`), issues: [] }),
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: { cookie: '' } },
        { provide: CacheServiceImpl, useValue: cache },
        { provide: ExamPrintService, useValue: { listEditions: () => Promise.resolve(editions) } },
        { provide: ExamVersionsService, useValue: { list: () => Promise.resolve(versions) } },
        {
          provide: PageCodeCheckService,
          useValue: {
            readImage: (image: string) => Promise.resolve({ text: codes[image] }),
            rebuildImages,
            release: jest.fn(),
            imageType: () => 'image/webp',
          },
        },
        { provide: TranslateService, useValue: { instant: (_: string, p: { label: string }) => `Version ${p.label}` } },
      ],
    });
    service = TestBed.inject(VersionRebuildService);
  };

  beforeEach(() => {
    editions = [{ id: 12, examId: 7, copies: 30, pagesPerCopy: 2, versions: 3 }];
    codes = {};
  });

  it('does nothing for an exam without print run of several versions', async () => {
    editions = [{ id: 12, examId: 7, copies: 30, pagesPerCopy: 2 }];
    setup(4);
    await expect(service.rebuild(7)).resolves.toMatchObject({ applicable: false });
    expect(cache.countAlignImage).not.toHaveBeenCalled();
  });

  it('rebuilds the copies of versions B and C, leaves version A and marks the rebuilt pages', async () => {
    setup(6);
    // copy 1 (A), copy 2 (B, code unreadable on its first page), copy 3 (C)
    codes = { 'img:1': 'CE1|12|1|1', 'img:4': 'CE1|12|2|2', 'img:5': 'CE1|12|3|1' };
    const progress: number[] = [];
    const report = await service.rebuild(7, p => progress.push(p.done));
    expect(report).toMatchObject({ applicable: true, copies: 3, versionA: 1, alreadyRebuilt: 0, notRebuilt: [] });
    expect(report.rebuilt.map(r => [r.firstPage, r.copy, r.label])).toEqual([
      [3, 2, 'B'],
      [5, 3, 'C'],
    ]);
    expect(progress).toEqual([1, 2, 3]);
    expect(rebuildImages.mock.calls[0][0]).toMatchObject({
      copy: ['img:3', 'img:4'],
      templates: ['tpl:1', 'tpl:2'],
      layout: layout(1),
      canonical: layout(0),
    });
    expect(JSON.parse(cache.aligned.get(3)!)).toEqual({ pages: 'img:3>Version B', rebuilt: 'B' });
    expect(JSON.parse(cache.aligned.get(1)!)).toEqual({ pages: 'img:1' });

    // a second pass changes nothing
    rebuildImages.mockClear();
    const again = await service.rebuild(7);
    expect(again).toMatchObject({ versionA: 1, alreadyRebuilt: 2, rebuilt: [] });
    expect(rebuildImages).not.toHaveBeenCalled();
  });

  it('reports the copies it cannot rebuild', async () => {
    setup(7);
    codes = { 'img:3': 'CE1|12|2|2', 'img:5': 'CE1|99|1|1' };
    cache.aligned.set(2, JSON.stringify({ pages: 'img:2', rebuilt: 'B' }));
    const report = await service.rebuild(7);
    expect(report.notRebuilt.map(n => [n.firstPage, n.reason])).toEqual([
      [1, 'partial'],
      [3, 'disordered'],
      [5, 'unknown'],
      [7, 'incomplete'],
    ]);
    expect(rebuildImages).not.toHaveBeenCalled();
  });
});
