import { Injectable, inject } from '@angular/core';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { PreferenceService } from '../preference-page/preference.service';
import { ExamPrintService } from './exam-print.service';
import { analyseScan, CodeReport, moveSequence, ScannedPage } from './page-codes';
import { createPageCodeWorker } from './page-code-worker-factory';
import { PageCodeWorkerRequest, PageCodeWorkerResponse } from './page-code-worker.protocol';

export interface CheckProgress {
  done: number;
  total: number;
}

/** A request without its id (given by `send`). */
type WorkerRequest = PageCodeWorkerRequest extends infer R ? (R extends unknown ? Omit<R, 'id'> : never) : never;

/** Pages read at the same time: the cache and the decoder work in parallel, memory stays bounded. */
const IN_FLIGHT = 4;

/**
 * Page codes of a scan (T25d2, ADR 0004). Reads the code of every page of the local cache (pages not aligned yet) in a
 * Web Worker, reports the copies, missing, doubled, foreign and unreadable pages, then puts the pages back in order:
 * upside-down pages turned, a blank page at the place of each missing page (the copies keep the number of pages of
 * the template), set-aside pages at the end. Only the local cache changes, with the operations of the reordering
 * screen: the scan stored on the server is not modified.
 */
@Injectable({ providedIn: 'root' })
export class PageCodeCheckService {
  private readonly cache = inject(CacheServiceImpl);
  private readonly printService = inject(ExamPrintService);
  private readonly preferences = inject(PreferenceService);
  private worker?: Worker;
  private nextId = 0;
  private readonly pending = new Map<number, { resolve: (r: PageCodeWorkerResponse) => void; reject: (e: Error) => void }>();

  /** Print runs of the exam: none means an exam whose sheets carry no code. */
  editions(examId: number): Promise<{ id: number; copies: number; pagesPerCopy: number }[]> {
    return this.printService.listEditions(examId);
  }

  /** Aligned pages of the cache: removed when the order changes. */
  alignedPages(examId: number): Promise<number> {
    return this.cache.countAlignImage(examId);
  }

  /** Reads every page and analyses the scan. */
  async check(examId: number, onProgress?: (p: CheckProgress) => void): Promise<CodeReport> {
    const [editions, total] = await Promise.all([this.editions(examId), this.cache.countNonAlignImage(examId)]);
    const scanned: ScannedPage[] = [];
    let next = 1;
    let done = 0;
    const readNext = async (): Promise<void> => {
      while (next <= total) {
        const scanPage = next++;
        scanned.push(await this.readPage(examId, scanPage));
        onProgress?.({ done: ++done, total });
      }
    };
    try {
      await Promise.all(Array.from({ length: Math.min(IN_FLIGHT, total) }, () => readNext()));
    } finally {
      this.stopWorker();
    }
    return analyseScan(scanned, editions);
  }

  /** Puts the pages in the order of the report. The aligned pages, if any, are removed: they must be aligned again. */
  async apply(examId: number, report: CodeReport, onProgress?: (p: CheckProgress) => void): Promise<void> {
    const type = this.imageType();
    const total = await this.cache.countNonAlignImage(examId);
    try {
      if ((await this.cache.countAlignImage(examId)) > 0) {
        await this.cache.removePageAlignForExam(examId);
      }
      for (const slot of report.order) {
        if (slot.kind === 'scan' && slot.rotate) {
          const image = await this.pageImage(examId, slot.scanPage);
          const rotated = await this.image({ kind: 'rotate', image, type });
          await this.cache.removePageNonAlignForExamForPage(examId, slot.scanPage);
          await this.cache.addNonAligneImage({ examId, pageNumber: slot.scanPage, value: JSON.stringify({ pages: rotated }) });
        }
      }
      // blank pages at the end first, then everything is moved to its place
      const current: string[] = Array.from({ length: total }, (_, i) => `s${i + 1}`);
      const target: string[] = [];
      let blanks = 0;
      let blank: string | undefined;
      for (const slot of report.order) {
        if (slot.kind === 'scan') {
          target.push(`s${slot.scanPage}`);
        } else {
          blank ??= await this.image({ kind: 'blank', like: await this.pageImage(examId, 1), type });
          blanks++;
          await this.cache.addNonAligneImage({ examId, pageNumber: total + blanks, value: JSON.stringify({ pages: blank }) });
          current.push(`b${blanks}`);
          target.push(`b${blanks}`);
        }
      }
      const moves = moveSequence(current, target);
      for (let i = 0; i < moves.length; i++) {
        await this.cache.moveNonAlignPages(examId, moves[i][0], moves[i][1]);
        onProgress?.({ done: i + 1, total: moves.length });
      }
    } finally {
      this.stopWorker();
    }
  }

  /** Creates the worker; isolated so that tests can provide a fake one. */
  protected createWorker(): Worker {
    return createPageCodeWorker();
  }

  private async readPage(examId: number, scanPage: number): Promise<ScannedPage> {
    try {
      const res = await this.send({ kind: 'read', image: await this.pageImage(examId, scanPage) });
      return res.kind === 'read' ? { scanPage, text: res.text, upsideDown: res.upsideDown } : { scanPage };
    } catch (e) {
      // a page that cannot be decoded is unreadable, the others are still read
      console.warn(`page ${scanPage}: code not read`, e);
      return { scanPage };
    }
  }

  private async pageImage(examId: number, page: number): Promise<string> {
    const stored = await this.cache.getFirstNonAlignImage(examId, page);
    if (stored === undefined) {
      throw new Error(`page ${page} missing from the cache`);
    }
    return (JSON.parse(stored.value) as { pages: string }).pages;
  }

  private async image(req: WorkerRequest): Promise<string> {
    const res = await this.send(req);
    if (res.kind !== 'image') {
      throw new Error('unexpected answer of the page code worker');
    }
    return res.image;
  }

  private imageType(): string {
    const type = this.preferences.getPreference().imageTypeExport;
    return ['image/webp', 'image/png', 'image/jpg'].includes(type) ? type : 'image/webp';
  }

  private send(req: WorkerRequest): Promise<PageCodeWorkerResponse> {
    const worker = this.getWorker();
    const id = ++this.nextId;
    return new Promise<PageCodeWorkerResponse>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      worker.postMessage({ ...req, id } as PageCodeWorkerRequest);
    });
  }

  private getWorker(): Worker {
    if (this.worker === undefined) {
      const worker = this.createWorker();
      worker.onmessage = ({ data }: MessageEvent<PageCodeWorkerResponse>) => {
        const p = this.pending.get(data.id);
        if (p === undefined) {
          return;
        }
        this.pending.delete(data.id);
        if (data.kind === 'failure') {
          p.reject(new Error(data.message));
        } else {
          p.resolve(data);
        }
      };
      worker.onerror = (e: ErrorEvent) => {
        e.preventDefault();
        this.stopWorker(new Error(e.message || 'page code worker error'));
      };
      this.worker = worker;
    }
    return this.worker;
  }

  private stopWorker(error = new Error('page code worker stopped')): void {
    this.worker?.terminate();
    this.worker = undefined;
    for (const p of this.pending.values()) {
      p.reject(error);
    }
    this.pending.clear();
  }
}
