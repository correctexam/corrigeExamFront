/**
 * Rebuilt copies (T25e4, ADR 0005): a copy printed in version B, C… is rebuilt in the layout of version A just after
 * the alignment, so that everything downstream (cutting of the zones, MCQ detection, grading, exports) works as for a
 * single version. Pure module (no DOM, no canvas): pixels in, pixels out; run in `page-code.worker.ts`, tested with
 * Node. The same algorithm runs in the alignment worker in Rust (T25e5).
 *
 * For each page p of the rebuilt copy:
 *  - background: page p of the template (version A, empty);
 *  - each part of a question placed on page p in version A is cut at its place in the version of the copy (possibly
 *    on another page) and pasted at its place in version A (same size, checked when the versions were made);
 *  - an MCQ keeps the background of version A (its choices in the canonical order) and gets each box of the copy at
 *    the place of the box of the same canonical letter, with a margin of 2 pt: the detection by rank reads the
 *    canonical letters directly;
 *  - identity zones and the band of the page code are copied as they are (same place in every version).
 */

import type { IZone } from 'app/entities/zone/zone.model';
import type { VersionLayout } from './subject-versions';

/** RGBA pixels, as `ImageData`. */
export interface Raster {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

/** Positions of the zones: 1/100000 of the page (as the `Zone` of the exam). */
const SCALE = 100000;
/** A4 in points: the margin of the boxes and the band of the code are given in points / millimetres. */
const PAGE_WIDTH_PT = 595.28;
const PAGE_HEIGHT_MM = 297;
const PAGE_WIDTH_MM = 210;
export const BOX_MARGIN_PT = 2;
/** Band of the page code and of its label (`print-copies.ts`: code centred, 9 mm above the bottom, label on its right). */
const CODE_BAND_HALF_WIDTH_MM = 32;
const CODE_BAND_CENTER_MM = 9;
const CODE_BAND_HALF_HEIGHT_MM = 6.5;

/** A rectangle in pixels of a page. */
export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Version of copy `copy` (from 1) in a print run of `versions` versions: the versions are taken in turn. */
export function versionOfCopy(copy: number, versions: number): number {
  const k = Math.max(1, versions);
  return (((copy - 1) % k) + k) % k;
}

export function zoneToPixels(zone: IZone, width: number, height: number, marginPt = 0): PixelRect {
  const m = (marginPt / PAGE_WIDTH_PT) * width;
  const x = ((zone.xInit ?? 0) / SCALE) * width - m;
  const y = ((zone.yInit ?? 0) / SCALE) * height - m;
  const w = ((zone.width ?? 0) / SCALE) * width + 2 * m;
  const h = ((zone.height ?? 0) / SCALE) * height + 2 * m;
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

/** Band of the page code at the bottom of a page. */
export function codeBand(width: number, height: number): PixelRect {
  const px = width / PAGE_WIDTH_MM;
  const py = height / PAGE_HEIGHT_MM;
  const w = 2 * CODE_BAND_HALF_WIDTH_MM * px;
  const h = 2 * CODE_BAND_HALF_HEIGHT_MM * py;
  return {
    x: Math.round(width / 2 - w / 2),
    y: Math.round(height - (CODE_BAND_CENTER_MM + CODE_BAND_HALF_HEIGHT_MM) * py),
    w: Math.round(w),
    h: Math.round(h),
  };
}

export function cloneRaster(r: Raster): Raster {
  return { width: r.width, height: r.height, data: new Uint8ClampedArray(r.data) };
}

/**
 * Copies `from` of `src` into `to` of `dst` (nearest pixel when the sizes differ by a rounding). Parts of the
 * rectangles outside their page are ignored.
 */
export function blit(src: Raster, from: PixelRect, dst: Raster, to: PixelRect): void {
  if (from.w <= 0 || from.h <= 0 || to.w <= 0 || to.h <= 0) {
    return;
  }
  for (let y = 0; y < to.h; y++) {
    const dy = to.y + y;
    if (dy < 0 || dy >= dst.height) {
      continue;
    }
    const sy = from.y + Math.min(from.h - 1, Math.floor((y * from.h) / to.h));
    if (sy < 0 || sy >= src.height) {
      continue;
    }
    for (let x = 0; x < to.w; x++) {
      const dx = to.x + x;
      if (dx < 0 || dx >= dst.width) {
        continue;
      }
      const sx = from.x + Math.min(from.w - 1, Math.floor((x * from.w) / to.w));
      if (sx < 0 || sx >= src.width) {
        continue;
      }
      const s = (sy * src.width + sx) * 4;
      const d = (dy * dst.width + dx) * 4;
      dst.data[d] = src.data[s];
      dst.data[d + 1] = src.data[s + 1];
      dst.data[d + 2] = src.data[s + 2];
      dst.data[d + 3] = src.data[s + 3];
    }
  }
}

export interface RebuildIssue {
  /** i18n key (`scanexam.versions.issue.*`). */
  key: 'missingPart' | 'missingBox' | 'missingPage';
  question?: string;
  part?: number;
  letter?: string;
}

/**
 * Rebuilds the pages of one copy printed in version `layout` into the layout `canonical` (version A).
 *
 * @param copy      aligned pages of the copy, page 1 first (as many as the template)
 * @param templates pages of the template (version A without any answer), page 1 first
 */
export function rebuildCopy(
  copy: Raster[],
  templates: Raster[],
  canonical: VersionLayout,
  layout: VersionLayout,
): { pages: Raster[]; issues: RebuildIssue[] } {
  const issues: RebuildIssue[] = [];
  const pages = templates.map(cloneRaster);
  const qcm = new Set(canonical.boxes.map(b => b.key));
  const partOf = new Map(layout.parts.map(p => [`${p.key}#${p.part}`, p.zone]));
  const boxOf = new Map(layout.boxes.map(b => [`${b.key}#${b.part}#${b.letter}`, b.zone]));

  const paste = (zoneV: IZone, zoneA: IZone, marginPt = 0): boolean => {
    const src = copy[(zoneV.pageNumber ?? 1) - 1];
    const dst = pages[(zoneA.pageNumber ?? 1) - 1];
    if (!src || !dst) {
      return false;
    }
    blit(src, zoneToPixels(zoneV, src.width, src.height, marginPt), dst, zoneToPixels(zoneA, dst.width, dst.height, marginPt));
    return true;
  };

  for (const part of canonical.parts) {
    if (qcm.has(part.key)) {
      continue;
    }
    const zone = partOf.get(`${part.key}#${part.part}`);
    if (!zone) {
      issues.push({ key: 'missingPart', question: part.key, part: part.part });
    } else if (!paste(zone, part.zone)) {
      issues.push({ key: 'missingPage', question: part.key, part: part.part });
    }
  }
  for (const box of canonical.boxes) {
    const zone = boxOf.get(`${box.key}#${box.part}#${box.letter}`);
    if (!zone) {
      issues.push({ key: 'missingBox', question: box.key, part: box.part, letter: box.letter });
    } else if (!paste(zone, box.zone, BOX_MARGIN_PT)) {
      issues.push({ key: 'missingPage', question: box.key, part: box.part, letter: box.letter });
    }
  }
  for (const [role, zoneA] of Object.entries(canonical.identity)) {
    const zoneV = layout.identity[role as keyof VersionLayout['identity']];
    if (zoneA && zoneV) {
      paste(zoneV, zoneA);
    }
  }
  // the code and its label stay those of the printed page
  pages.forEach((page, i) => {
    const src = copy[i];
    if (src) {
      blit(src, codeBand(src.width, src.height), page, codeBand(page.width, page.height));
    }
  });
  return { pages, issues };
}

/** A copy of the scan: consecutive pages, as the copies are cut by CorrectExam. */
export interface CopySlot {
  /** First page of the copy in the scan (from 1). */
  firstPage: number;
  pages: number;
}

export function copySlots(totalPages: number, pagesPerCopy: number): CopySlot[] {
  const slots: CopySlot[] = [];
  for (let first = 1; first <= totalPages; first += pagesPerCopy) {
    slots.push({ firstPage: first, pages: Math.min(pagesPerCopy, totalPages - first + 1) });
  }
  return slots;
}

/** Print run as known by the front (`ExamEdition`). */
export interface VersionedEdition {
  id: number;
  copies: number;
  pagesPerCopy: number;
  versions?: number;
}

/** Where a page code read on a copy leads. */
export type CopyVersion =
  | { kind: 'version'; edition: number; copy: number; version: number }
  /** No code of a print run of this exam on the copy. */
  | { kind: 'unknown' }
  /** The code read is not at the expected place: the scan is not in the order of the copies. */
  | { kind: 'disordered'; page: number; code: { edition: number; copy: number; page: number } };

/**
 * Version of a copy from the code read on its page `pageInCopy` (from 1). The code must be of a print run of the
 * exam and name the same page: a scan put in order by the page code check (T25d2) always is.
 */
export function versionFromCode(
  code: { edition: number; copy: number; page: number } | undefined,
  pageInCopy: number,
  editions: VersionedEdition[],
): CopyVersion {
  if (!code) {
    return { kind: 'unknown' };
  }
  const edition = editions.find(e => e.id === code.edition);
  if (!edition || code.copy < 1 || code.copy > edition.copies) {
    return { kind: 'unknown' };
  }
  if (code.page !== pageInCopy) {
    return { kind: 'disordered', page: pageInCopy, code };
  }
  return { kind: 'version', edition: code.edition, copy: code.copy, version: versionOfCopy(code.copy, edition.versions ?? 1) };
}
