/**
 * Print PDF of an exam written in Typst (T25d, ADR 0004): the template of the exam repeated once per copy, each page
 * stamped with its code `CE1|<print run>|<copy>|<page>` (Data Matrix) and a label readable by a human.
 * Pure module (no DOM): run in `print.worker.ts`, tested with Node.
 *
 * Geometry shared with the Typst package (`_geom` in `content/typst/correctexam/0.1.0/lib.typ`): code 11 mm wide,
 * centred horizontally, its centre 9 mm above the bottom edge (the height of the bottom alignment circles).
 */

import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import bwipjs from 'bwip-js';

export const PAGE_CODE_FORMAT = 'CE1';
const MM = 72 / 25.4;
export const CODE_SIZE_MM = 11;
export const CODE_CENTER_FROM_BOTTOM_MM = 9;
/** White band painted under the code: hides the "preview" mention of templates made before T25d. */
const CLEAR_HALF_WIDTH_MM = 32;
const CLEAR_HALF_HEIGHT_MM = 6.5;

export interface PrintRequest {
  /** Identifier of the print run (`exam_edition.id`). */
  edition: number;
  copies: number;
}

export interface PrintProgress {
  done: number;
  total: number;
}

export function pageCode(edition: number, copy: number, page: number): string {
  return `${PAGE_CODE_FORMAT}|${edition}|${copy}|${page}`;
}

/** Modules of the Data Matrix of a text: `rows[y][x]` true for a dark module. */
export function dataMatrix(text: string): boolean[][] {
  const raw = bwipjs.raw({ bcid: 'datamatrix', text })[0] as { pixs: number[]; pixx: number; pixy: number };
  const rows: boolean[][] = [];
  for (let y = 0; y < raw.pixy; y++) {
    rows.push(raw.pixs.slice(y * raw.pixx, (y + 1) * raw.pixx).map(v => v === 1));
  }
  return rows;
}

/** Horizontal runs of dark modules, `[x, y, length]`: one rectangle per run instead of one per module. */
export function darkRuns(rows: boolean[][]): [number, number, number][] {
  const runs: [number, number, number][] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < row.length && row[x]) {
        x++;
      }
      runs.push([start, y, x - start]);
    }
  });
  return runs;
}

/** Draws the code of a page and its label at the bottom of the page. */
function stamp(page: PDFPage, code: string, label: string, font: PDFFont): void {
  const { width } = page.getSize();
  const cx = width / 2;
  const cy = CODE_CENTER_FROM_BOTTOM_MM * MM;
  page.drawRectangle({
    x: cx - CLEAR_HALF_WIDTH_MM * MM,
    y: cy - CLEAR_HALF_HEIGHT_MM * MM,
    width: 2 * CLEAR_HALF_WIDTH_MM * MM,
    height: 2 * CLEAR_HALF_HEIGHT_MM * MM,
    color: rgb(1, 1, 1),
  });
  const rows = dataMatrix(code);
  const module = (CODE_SIZE_MM * MM) / rows.length;
  const left = cx - (CODE_SIZE_MM * MM) / 2;
  const top = cy + (CODE_SIZE_MM * MM) / 2;
  for (const [x, y, length] of darkRuns(rows)) {
    page.drawRectangle({ x: left + x * module, y: top - (y + 1) * module, width: length * module, height: module, color: rgb(0, 0, 0) });
  }
  page.drawText(label, { x: cx + (CODE_SIZE_MM / 2 + 2) * MM, y: cy - 2.5, size: 7, font, color: rgb(0.31, 0.31, 0.31) });
}

/** Number of pages of a PDF (pages of one copy for a template). */
export async function countPages(pdf: Uint8Array): Promise<number> {
  return (await PDFDocument.load(pdf)).getPageCount();
}

/**
 * The print PDF: `copies` times the template, copy `c` page `p` stamped with `pageCode(edition, c, p)`.
 * The pages of the template are embedded once and drawn on every copy: the file grows with the codes only.
 */
export async function assemblePrint(template: Uint8Array, req: PrintRequest, onProgress?: (p: PrintProgress) => void): Promise<Uint8Array> {
  const source = await PDFDocument.load(template);
  const out = await PDFDocument.create();
  out.setTitle(`CorrectExam — ${req.copies} copies`);
  out.setProducer('CorrectExam');
  const font = await out.embedFont(StandardFonts.Helvetica);
  const pages = await out.embedPages(source.getPages());
  const sizes = source.getPages().map(p => p.getSize());
  for (let copy = 1; copy <= req.copies; copy++) {
    pages.forEach((embedded, i) => {
      const page = out.addPage([sizes[i].width, sizes[i].height]);
      page.drawPage(embedded, { x: 0, y: 0, width: sizes[i].width, height: sizes[i].height });
      stamp(page, pageCode(req.edition, copy, i + 1), `${copy} · p. ${i + 1}`, font);
    });
    onProgress?.({ done: copy, total: req.copies });
  }
  return out.save();
}
