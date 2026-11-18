import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { ExamPrintService } from './exam-print.service';
import { ExamVersion, ExamVersionsService } from './exam-versions.service';
import { PageCodeCheckService } from './page-code-check.service';
import { parsePageCode } from './page-codes';
import { CopyVersion, copySlots, RebuildIssue, versionFromCode } from './version-rebuild';

export interface RebuildProgress {
  done: number;
  total: number;
}

export type NotRebuiltReason =
  /** No code of a print run of this exam could be read on the copy. */
  | 'unknown'
  /** The code read is not at its place: the scan is not in the order of the copies (page code check, T25d2). */
  | 'disordered'
  /** The last copy of the scan has fewer pages than the template. */
  | 'incomplete'
  /** Some pages of the copy were rebuilt, others not (partial alignment): align the whole copy again. */
  | 'partial'
  /** The layout of the version of the copy is not stored. */
  | 'noLayout'
  /** The rebuilding failed (image that cannot be decoded…). */
  | 'failed';

export interface RebuildReport {
  /** False when the exam has no print run of several versions: nothing to do. */
  applicable: boolean;
  copies: number;
  /** Copies of version A: nothing to rebuild. */
  versionA: number;
  /** Copies rebuilt during an earlier alignment, left as they are. */
  alreadyRebuilt: number;
  rebuilt: { firstPage: number; edition: number; copy: number; label: string; issues: RebuildIssue[] }[];
  notRebuilt: { firstPage: number; reason: NotRebuiltReason; detail?: string }[];
}

/** Value of an aligned page in the cache; `rebuilt` (T25e4) is the letter of the version it was rebuilt from. */
interface AlignedValue {
  pages: string;
  rebuilt?: string;
}

/**
 * Rebuilds the copies printed in a version other than A after the local alignment (T25e4, ADR 0005): the version of
 * each copy comes from the page code read on it, its aligned pages are replaced by pages in the layout of version A
 * (`version-rebuild.ts`, in the page code worker). The pages that are not aligned (the scan as it is) do not change:
 * they remain the original copy. Rebuilt pages are marked in the cache and never rebuilt twice.
 */
@Injectable({ providedIn: 'root' })
export class VersionRebuildService {
  private readonly cache = inject(CacheServiceImpl);
  private readonly printService = inject(ExamPrintService);
  private readonly versionsService = inject(ExamVersionsService);
  private readonly pageCodes = inject(PageCodeCheckService);
  private readonly translate = inject(TranslateService);

  async rebuild(examId: number, onProgress?: (p: RebuildProgress) => void): Promise<RebuildReport> {
    const report: RebuildReport = { applicable: false, copies: 0, versionA: 0, alreadyRebuilt: 0, rebuilt: [], notRebuilt: [] };
    const editions = await this.printService.listEditions(examId);
    if (!editions.some(e => (e.versions ?? 1) > 1)) {
      return report;
    }
    report.applicable = true;
    const versions = [...(await this.versionsService.list(examId))].sort((a, b) => a.index - b.index);
    const canonical = versions.find(v => v.index === 0);
    if (!canonical) {
      throw new Error(`exam ${examId}: print runs of several versions but no version A`);
    }
    const pagesPerCopy = canonical.pages;
    const total = await this.cache.countAlignImage(examId);
    const slots = copySlots(total, pagesPerCopy);
    report.copies = slots.length;
    const type = this.pageCodes.imageType();
    try {
      const templates = await this.templates(examId, pagesPerCopy);
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        try {
          await this.rebuildSlot(examId, slot.firstPage, slot.pages, pagesPerCopy, editions, versions, canonical, templates, type, report);
        } catch (e) {
          console.warn(`copy starting at page ${slot.firstPage}: not rebuilt`, e);
          report.notRebuilt.push({ firstPage: slot.firstPage, reason: 'failed', detail: e instanceof Error ? e.message : String(e) });
        }
        onProgress?.({ done: i + 1, total: slots.length });
      }
    } finally {
      this.pageCodes.release();
    }
    return report;
  }

  private async rebuildSlot(
    examId: number,
    firstPage: number,
    pages: number,
    pagesPerCopy: number,
    editions: { id: number; copies: number; pagesPerCopy: number; versions?: number }[],
    versions: ExamVersion[],
    canonical: ExamVersion,
    templates: string[],
    type: string,
    report: RebuildReport,
  ): Promise<void> {
    if (pages < pagesPerCopy) {
      report.notRebuilt.push({ firstPage, reason: 'incomplete' });
      return;
    }
    const numbers = Array.from({ length: pages }, (_, j) => firstPage + j);
    const stored = new Map((await this.cache.getAlignImagesForPageNumbers(examId, numbers)).map(img => [img.pageNumber, img.value]));
    const values: AlignedValue[] = numbers.map(n => {
      const value = stored.get(n);
      if (value === undefined) {
        throw new Error(`aligned page ${n} missing from the cache`);
      }
      return JSON.parse(value) as AlignedValue;
    });
    const marked = values.filter(v => v.rebuilt !== undefined).length;
    if (marked === values.length) {
      report.alreadyRebuilt++;
      return;
    }
    if (marked > 0) {
      report.notRebuilt.push({ firstPage, reason: 'partial' });
      return;
    }

    const found = await this.versionOfCopy(values, editions);
    if (found.kind === 'unknown') {
      report.notRebuilt.push({ firstPage, reason: 'unknown' });
      return;
    }
    if (found.kind === 'disordered') {
      report.notRebuilt.push({
        firstPage,
        reason: 'disordered',
        detail: `${found.code.edition}|${found.code.copy}|${found.code.page} @ ${found.page}`,
      });
      return;
    }
    if (found.version === 0) {
      report.versionA++;
      return;
    }
    const version = versions.find(v => v.index === found.version);
    if (!version) {
      report.notRebuilt.push({ firstPage, reason: 'noLayout', detail: String(found.version) });
      return;
    }
    const { images, issues } = await this.pageCodes.rebuildImages({
      copy: values.map(v => v.pages),
      templates,
      canonical: canonical.layout,
      layout: version.layout,
      mention: this.translate.instant('scanexam.versions.mention', { label: version.label }) as string,
      type,
    });
    for (let j = 0; j < images.length; j++) {
      await this.cache.removePageAlignForExamForPage(examId, firstPage + j);
      await this.cache.addAligneImage({
        examId,
        pageNumber: firstPage + j,
        value: JSON.stringify({ pages: images[j], rebuilt: version.label } satisfies AlignedValue),
      });
    }
    report.rebuilt.push({ firstPage, edition: found.edition, copy: found.copy, label: version.label, issues });
  }

  /** Version of a copy: the first page code read on it, page after page. */
  private async versionOfCopy(
    values: AlignedValue[],
    editions: { id: number; copies: number; pagesPerCopy: number; versions?: number }[],
  ): Promise<CopyVersion> {
    for (let j = 0; j < values.length; j++) {
      const code = parsePageCode((await this.pageCodes.readImage(values[j].pages)).text);
      if (code) {
        return versionFromCode(code, j + 1, editions);
      }
    }
    return { kind: 'unknown' };
  }

  /** Pages of the template (version A without answers), as stored in the cache. */
  private async templates(examId: number, pages: number): Promise<string[]> {
    const images: string[] = [];
    for (let p = 1; p <= pages; p++) {
      const t = await this.cache.getFirstTemplate(examId, p);
      if (!t) {
        throw new Error(`template page ${p} missing from the cache`);
      }
      images.push((JSON.parse(t.value) as { pages: string }).pages);
    }
    return images;
  }
}
