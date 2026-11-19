/**
 * Zones described in the information dictionary of a template PDF (format of the LaTeX class of CorrectExam, also
 * writable by any tool): `correctexam-lastname`, `-firstname`, `-stdid`, `correctexam-answer-{question}-{part}`, each
 * value a JSON string `{"x", "y", "w", "h", "p", "t"?}` in centimetres, `y` being the bottom edge of the zone from the
 * top of the page. Read by the template annotation screen when the template is opened.
 * Pure module: the conversion only depends on the size of the PDF page, never on the screen.
 */

import { IQuestionType } from 'app/entities/question-type/question-type.model';
import { IZone } from 'app/entities/zone/zone.model';
import { DrawingTools } from './paint/models';

/** Zones are stored in 1/100000 of the page. */
export const ZONE_SCALE = 100000;
const CM_PER_PT = 2.54 / 72;

export interface MetadataRect {
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
  /** `qcm` for a multiple choice question. */
  t?: string;
  type: DrawingTools;
  /** Question number (answer zones). */
  q?: number;
  /** Part of the question, from 1 (answer zones). */
  subq?: number;
}

export interface PageSizeCm {
  width: number;
  height: number;
}

function drawingTool(kind: string): DrawingTools | undefined {
  switch (kind) {
    case 'answer':
      return DrawingTools.QUESTIONBOX;
    case 'firstname':
      return DrawingTools.PRENOMBOX;
    case 'lastname':
      return DrawingTools.NOMBOX;
    case 'stdid':
      return DrawingTools.INEBOX;
  }
  return undefined;
}

/** One entry of the information dictionary, undefined when it is not a zone of CorrectExam. */
export function toMetadataRect(key: string, value: unknown): MetadataRect | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const infos = key.split('-');
  const type = drawingTool(infos[1] ?? '');
  if (infos[0] !== 'correctexam' || type === undefined) {
    return undefined;
  }
  let r: Partial<MetadataRect>;
  try {
    r = JSON.parse(value) as Partial<MetadataRect>;
  } catch {
    return undefined;
  }
  const numbers = [r.p, r.x, r.y, r.w, r.h];
  if (!numbers.every(n => typeof n === 'number' && Number.isFinite(n))) {
    return undefined;
  }
  const q = parseInt(infos[2] ?? '', 10);
  const subq = parseInt(infos[3] ?? '', 10);
  if (type === DrawingTools.QUESTIONBOX && (!Number.isFinite(q) || !Number.isFinite(subq) || subq < 1)) {
    return undefined;
  }
  return {
    x: r.x!,
    y: r.y!,
    w: r.w!,
    h: r.h!,
    p: r.p!,
    ...(typeof r.t === 'string' ? { t: r.t } : {}),
    type,
    ...(Number.isFinite(q) ? { q } : {}),
    ...(Number.isFinite(subq) ? { subq } : {}),
  };
}

/** Zones of the `Custom` entries returned by pdf.js (`getMetadata().info.Custom`). */
export function parsePdfZoneMetadata(custom: unknown): MetadataRect[] {
  if (typeof custom !== 'object' || custom === null) {
    return [];
  }
  return Object.entries(custom as Record<string, unknown>)
    .map(([key, value]) => toMetadataRect(key, value))
    .filter((r): r is MetadataRect => r !== undefined);
}

/** Size of a page in centimetres from its size in points (`page.getViewport({ scale: 1 })`, rotation included). */
export function pageSizeCm(widthPt: number, heightPt: number): PageSizeCm {
  return { width: widthPt * CM_PER_PT, height: heightPt * CM_PER_PT };
}

/** Names of the identity zones in the keys of the PDF, for the messages. */
const KEY_OF: Partial<Record<DrawingTools, string>> = {
  [DrawingTools.NOMBOX]: 'lastname',
  [DrawingTools.PRENOMBOX]: 'firstname',
  [DrawingTools.INEBOX]: 'stdid',
};

/** Tolerance on the edges of the page, in centimetres (rounding of the LaTeX class, frames drawn on the margin). */
const EDGE_TOLERANCE_CM = 0.5;

/**
 * Reasons why the zones of a PDF cannot be trusted, empty when they all lie inside existing pages. A LaTeX document
 * compiled only once writes positions that are not computed yet (page 0, x = 0, y below the bottom of the page): the
 * zones that look right in such a file are wrong too, so one problem is enough to ignore all of them.
 * `pageSize` gives the size of a page of the document, undefined for a page that does not exist.
 */
export function metadataProblems(rects: MetadataRect[], pageSize: (page: number) => PageSizeCm | undefined): string[] {
  const problems: string[] = [];
  for (const r of rects) {
    const name = r.type === DrawingTools.QUESTIONBOX ? `question ${r.q}-${r.subq}` : (KEY_OF[r.type] ?? r.type);
    const page = Number.isInteger(r.p) ? pageSize(r.p) : undefined;
    if (page === undefined) {
      problems.push(`${name}: page ${r.p} does not exist`);
    } else if (r.w <= 0 || r.h <= 0) {
      problems.push(`${name}: empty zone (${r.w} × ${r.h} cm)`);
    } else if (
      r.x < -EDGE_TOLERANCE_CM ||
      r.x + r.w > page.width + EDGE_TOLERANCE_CM ||
      r.y - r.h < -EDGE_TOLERANCE_CM ||
      r.y > page.height + EDGE_TOLERANCE_CM
    ) {
      problems.push(`${name}: outside page ${r.p}`);
    }
  }
  return problems;
}

/** The zone of a rectangle, in 1/100000 of its page, kept inside the page. */
export function metadataRectToZone(rect: MetadataRect, page: PageSizeCm): IZone {
  const ratio = (cm: number, size: number): number => Math.min(ZONE_SCALE, Math.max(0, Math.round((cm / size) * ZONE_SCALE)));
  return {
    pageNumber: rect.p,
    xInit: ratio(rect.x, page.width),
    yInit: ratio(rect.y - rect.h, page.height),
    width: ratio(rect.w, page.width),
    height: ratio(rect.h, page.height),
  };
}

/**
 * Type of a question created from the metadata, found by name as the template editor does (ids differ between
 * databases): `QCM` for `t: "qcm"`, otherwise the type preferred by the teacher if it exists, else `manual`.
 */
export function questionTypeFor(rect: MetadataRect, types: IQuestionType[], preferredTypeId: number | undefined): number | undefined {
  const byName = (name: string): number | undefined => types.find(t => t.algoName === name)?.id;
  if (rect.t === 'qcm') {
    return byName('QCM');
  }
  if (preferredTypeId !== undefined && types.some(t => t.id === preferredTypeId)) {
    return preferredTypeId;
  }
  return byName('manual');
}
