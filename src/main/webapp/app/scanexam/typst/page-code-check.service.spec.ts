/**
 * @jest-environment node
 */
import { Injector, runInInjectionContext } from '@angular/core';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { PreferenceService } from '../preference-page/preference.service';
import { ExamPrintService } from './exam-print.service';
import { PageCodeCheckService } from './page-code-check.service';
import { PageCodeWorkerRequest, PageCodeWorkerResponse } from './page-code-worker.protocol';

jest.mock('./page-code-worker-factory', () => ({ createPageCodeWorker: () => undefined }));
jest.mock('./exam-print.service', () => ({ ExamPrintService: class {} }));
jest.mock('../db/CacheServiceImpl', () => ({ CacheServiceImpl: class {} }));

const EXAM = 7;
/** An image is the text of its code in this test; `~` marks an upside-down page, `blank` a blank page. */
const img = (s: string): string => JSON.stringify({ pages: s });

/** Cache of non aligned pages with the semantics of `moveNonAlignPages` (Dexie and SQLite). */
class FakeCache {
  pages = new Map<number, string>();
  aligned = 0;
  moves = 0;
  constructor(images: string[]) {
    images.forEach((s, i) => this.pages.set(i + 1, img(s)));
  }
  countNonAlignImage = (): Promise<number> => Promise.resolve(this.pages.size);
  countAlignImage = (): Promise<number> => Promise.resolve(this.aligned);
  removePageAlignForExam = (): Promise<void> => {
    this.aligned = 0;
    return Promise.resolve();
  };
  getFirstNonAlignImage = (_e: number, p: number): Promise<{ examId: number; pageNumber: number; value: string } | undefined> =>
    Promise.resolve(this.pages.has(p) ? { examId: EXAM, pageNumber: p, value: this.pages.get(p)! } : undefined);
  removePageNonAlignForExamForPage = (_e: number, p: number): Promise<void> => {
    this.pages.delete(p);
    return Promise.resolve();
  };
  addNonAligneImage = (e: { pageNumber: number; value: string }): Promise<void> => {
    this.pages.set(e.pageNumber, e.value);
    return Promise.resolve();
  };
  moveNonAlignPages = (_e: number, from: number, to: number): Promise<void> => {
    this.moves++;
    const order = [...this.pages.keys()].sort((a, b) => a - b).map(k => this.pages.get(k)!);
    const [item] = order.splice(from - 1, 1);
    order.splice(to - 1, 0, item);
    this.pages = new Map(order.map((v, i) => [i + 1, v]));
    return Promise.resolve();
  };
  texts(): string[] {
    return [...this.pages.keys()].sort((a, b) => a - b).map(k => (JSON.parse(this.pages.get(k)!) as { pages: string }).pages);
  }
}

/** Worker reading the "image" as the code, `~` meaning upside down. */
class FakeWorker {
  onmessage?: (e: MessageEvent<PageCodeWorkerResponse>) => void;
  onerror?: (e: ErrorEvent) => void;
  postMessage(req: PageCodeWorkerRequest): void {
    let data: PageCodeWorkerResponse;
    if (req.kind === 'read') {
      const upsideDown = req.image.startsWith('~');
      const text = req.image.replace('~', '');
      data = text === '?' || text === 'blank' ? { kind: 'read', id: req.id } : { kind: 'read', id: req.id, text, upsideDown };
    } else if (req.kind === 'rotate') {
      data = { kind: 'image', id: req.id, image: req.image.replace('~', '') };
    } else {
      data = { kind: 'image', id: req.id, image: 'blank' };
    }
    setTimeout(() => this.onmessage?.({ data } as MessageEvent<PageCodeWorkerResponse>));
  }
  terminate(): void {
    // nothing to release
  }
}

function service(cache: FakeCache): PageCodeCheckService {
  const injector = Injector.create({
    providers: [
      { provide: CacheServiceImpl, useValue: cache },
      { provide: ExamPrintService, useValue: { listEditions: () => Promise.resolve([{ id: 12, copies: 30, pagesPerCopy: 2 }]) } },
      { provide: PreferenceService, useValue: { getPreference: () => ({ imageTypeExport: 'image/webp' }) } },
    ],
  });
  const s = runInInjectionContext(injector, () => new PageCodeCheckService());
  jest
    .spyOn(s as unknown as { createWorker: () => Worker }, 'createWorker')
    .mockImplementation(() => new FakeWorker() as unknown as Worker);
  return s;
}

describe('PageCodeCheckService', () => {
  it('reads every page and reports what is wrong', async () => {
    const cache = new FakeCache(['CE1|12|2|2', 'CE1|12|1|1', '~CE1|12|2|1', 'CE1|12|1|1', 'CE1|12|3|1', '?']);
    const progress: number[] = [];
    const report = await service(cache).check(EXAM, p => progress.push(p.done));
    expect(progress.length).toBe(6);
    expect(report.upsideDown).toEqual([3]);
    expect(report.duplicates).toEqual([4]);
    expect(report.inferred).toEqual([6]);
    expect(report.copies.find(c => c.copy === 1)!.missing).toEqual([2]);
    expect(report.inOrder).toBe(false);
  });

  it('puts the pages back in order in the cache, with blank pages and turned pages', async () => {
    const cache = new FakeCache(['CE1|12|2|2', 'CE1|12|1|1', '~CE1|12|2|1', 'CE1|12|1|1', 'CE1|12|4|1', 'CE1|12|4|2']);
    cache.aligned = 6;
    const s = service(cache);
    const report = await s.check(EXAM);
    await s.apply(EXAM, report);
    expect(cache.texts()).toEqual(['CE1|12|1|1', 'blank', 'CE1|12|2|1', 'CE1|12|2|2', 'CE1|12|4|1', 'CE1|12|4|2', 'CE1|12|1|1']);
    expect(cache.aligned).toBe(0);
    // checked again: in order, the blank page is unreadable but inferred from its neighbour
    const after = await s.check(EXAM);
    expect(after.upsideDown).toEqual([]);
    expect(after.inferred).toEqual([2]);
    expect(after.duplicates).toEqual([7]);
    expect(after.inOrder).toBe(true);
  });

  it('does few moves on a scan almost in order', async () => {
    const cache = new FakeCache(['CE1|12|1|1', 'CE1|12|1|2', 'CE1|12|3|1', 'CE1|12|3|2', 'CE1|12|2|1', 'CE1|12|2|2']);
    const s = service(cache);
    await s.apply(EXAM, await s.check(EXAM));
    expect(cache.texts()).toEqual(['CE1|12|1|1', 'CE1|12|1|2', 'CE1|12|2|1', 'CE1|12|2|2', 'CE1|12|3|1', 'CE1|12|3|2']);
    expect(cache.moves).toBe(2);
  });
});
