/**
 * Zones of a subject written with the Typst package `correctexam` (T25, ADR 0004).
 *
 * The package exposes the exact position of every zone as metadata labelled `<ce-zone>`; the platform reads
 * them after the compilation (`query(<ce-zone>)`) and turns them into CorrectExam zones, so that nobody has to
 * draw a zone on a generated subject. Pure module: no Angular, no HTTP, no Typst compiler.
 *
 * Units: Typst positions are in points from the top-left corner of the page; CorrectExam zones are in
 * 1/100000 of the page width (x, width) and height (y, height), pages numbered from 1 in each copy.
 */

import { IZone } from 'app/entities/zone/zone.model';
import { normalizeQcmAnswer } from '../grading/qcm-option';

/** Version of the metadata written by the package (`ZONE_FORMAT` in `lib.typ`). */
export const ZONE_FORMAT = 1;
/** CorrectExam zones are expressed in 1/100000 of the page. */
export const ZONE_SCALE = 100000;
/** Margin added around generated boxes so that the existing detection sees their whole outline. */
export const DETECTION_PADDING_MM = 1.2;

const PT_PER_MM = 72 / 25.4;
const PT_PER_CM = 72 / 2.54;

export type QuestionKind = 'manual' | 'short' | 'qcm' | 'numeric';
export type IdentityRole = 'lastname' | 'firstname' | 'stdid';

interface MetaBase {
  format: number;
  copy: string | null;
  /** Key of the question the zone belongs to (null for the identity header). */
  question: string | null;
  /** Physical page of the compiled document. */
  page: number;
  /** Page number in the copy (1-based): the page number of CorrectExam zones. */
  'page-in-copy': number;
  x: number;
  y: number;
  w: number;
  h: number;
  'page-width': number;
  'page-height': number;
}

export interface QuestionMeta extends MetaBase {
  kind: 'question';
  key: string;
  type: QuestionKind;
  points: number;
  /** Number printed on this copy. */
  displayed: number;
  /** Canonical number (same for every version): `Question.numero`. */
  number: number;
  grade?: string;
  grading?: string | null;
  /** Right choices of an MCQ, in canonical letters (`a&c`). */
  correct?: string;
  choices?: number;
  digits?: number;
  decimals?: number;
  signed?: boolean;
  expected?: unknown;
  tolerance?: number;
  style?: 'cells' | 'grid';
}

export interface AnswerMeta extends MetaBase {
  kind: 'answer' | 'short';
  part: number;
}

export interface QcmBoxMeta extends MetaBase {
  kind: 'qcm-box';
  part: number;
  /** Letter printed next to the box on this copy. */
  displayed: string;
  /** Canonical letter (order of the source): the one used by the grading DSL. */
  letter: string;
}

export interface NumericCellMeta extends MetaBase {
  kind: 'numeric-digit' | 'numeric-sign';
  part: number;
  digit?: number;
}

export interface NumericBubbleMeta extends MetaBase {
  kind: 'numeric-bubble';
  part: number;
  digit: number;
  value: number;
}

export interface IdentityMeta extends MetaBase {
  kind: 'identity';
  role: IdentityRole;
}

export type ZoneMeta = QuestionMeta | AnswerMeta | QcmBoxMeta | NumericCellMeta | NumericBubbleMeta | IdentityMeta;

const KINDS = new Set(['question', 'answer', 'short', 'qcm-box', 'numeric-digit', 'numeric-sign', 'numeric-bubble', 'identity']);

/** A rectangle in points, on a page of the copy. */
export interface PtRect {
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  pageWidth: number;
  pageHeight: number;
}

export interface GeneratedPart {
  part: number;
  rect: PtRect;
  zone: IZone;
  /**
   * MCQ and numeric grids: canonical value of each box, in the order in which the existing detection
   * (`qcm.ts`) numbers the boxes of the zone (top to bottom, then left to right).
   * MCQ: canonical letters; numeric grid: `digit:value`.
   */
  boxes?: string[];
  /** Numeric cells: zone of each handwritten cell, sign first when there is one. */
  cells?: IZone[];
}

export interface GeneratedQuestion {
  key: string;
  kind: QuestionKind;
  number: number;
  displayed: number;
  points: number;
  /** Expression for `Question.validExpression`: the grading DSL when given, else the right answers. */
  validExpression?: string;
  meta: QuestionMeta;
  parts: GeneratedPart[];
}

export interface GeneratedLayout {
  copy: string | null;
  identity: Partial<Record<IdentityRole, IZone>>;
  identityRects: Partial<Record<IdentityRole, PtRect>>;
  questions: GeneratedQuestion[];
}

export class TypstZoneError extends Error {}

/**
 * Reads the result of `query(<ce-zone>)`: either the metadata values or the elements (`{ value }`).
 * Throws on a format this version does not know rather than producing wrong zones.
 */
export function parseZoneMetadata(input: unknown): ZoneMeta[] {
  if (!Array.isArray(input)) {
    throw new TypstZoneError('ce-zone: an array is expected');
  }
  return input.map((item: unknown, i) => {
    const value = (isRecord(item) && isRecord(item['value']) ? item['value'] : item) as Record<string, unknown>;
    if (!isRecord(value) || value['format'] !== ZONE_FORMAT) {
      throw new TypstZoneError(`ce-zone #${i}: unsupported format ${String(isRecord(value) ? value['format'] : value)}`);
    }
    if (typeof value['kind'] !== 'string' || !KINDS.has(value['kind'])) {
      throw new TypstZoneError(`ce-zone #${i}: unknown kind ${String(value['kind'])}`);
    }
    for (const field of ['page', 'page-in-copy', 'x', 'y', 'w', 'h', 'page-width', 'page-height']) {
      if (typeof value[field] !== 'number' || !Number.isFinite(value[field])) {
        throw new TypstZoneError(`ce-zone #${i}: ${field} is not a number`);
      }
    }
    return value as unknown as ZoneMeta;
  });
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function rectOf(m: MetaBase): PtRect {
  return { page: m['page-in-copy'], x: m.x, y: m.y, w: m.w, h: m.h, pageWidth: m['page-width'], pageHeight: m['page-height'] };
}

/** Bounding box of rectangles of the same page, enlarged by `paddingMm` and kept inside the page. */
export function boundingRect(rects: PtRect[], paddingMm = 0): PtRect {
  if (rects.length === 0) {
    throw new TypstZoneError('boundingRect: no rectangle');
  }
  const pad = paddingMm * PT_PER_MM;
  const first = rects[0];
  const x0 = Math.max(0, Math.min(...rects.map(r => r.x)) - pad);
  const y0 = Math.max(0, Math.min(...rects.map(r => r.y)) - pad);
  const x1 = Math.min(first.pageWidth, Math.max(...rects.map(r => r.x + r.w)) + pad);
  const y1 = Math.min(first.pageHeight, Math.max(...rects.map(r => r.y + r.h)) + pad);
  return { ...first, x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** Converts a rectangle in points to a CorrectExam zone (1/100000 of the page, truncated like the editor). */
export function toZone(rect: PtRect): IZone {
  return {
    pageNumber: rect.page,
    xInit: Math.trunc((rect.x / rect.pageWidth) * ZONE_SCALE),
    yInit: Math.trunc((rect.y / rect.pageHeight) * ZONE_SCALE),
    width: Math.ceil((rect.w / rect.pageWidth) * ZONE_SCALE),
    height: Math.ceil((rect.h / rect.pageHeight) * ZONE_SCALE),
  };
}

/** Order in which `qcm.ts` numbers the boxes of a zone: top to bottom, then left to right. */
function detectionOrder<T extends MetaBase>(boxes: T[]): T[] {
  // the rasterized boxes of one row share the same y: compare at a tenth of a point
  return [...boxes].sort((a, b) => Math.round(a.y * 10) - Math.round(b.y * 10) || a.x - b.x);
}

/**
 * Builds the layout of one copy (the first one by default): identity zones and, for each question, its zones.
 * All the copies of a version share the same layout; a copy only changes the page code.
 */
export function buildLayout(metas: ZoneMeta[], copy?: string | null): GeneratedLayout {
  const selected = copy === undefined ? (metas[0]?.copy ?? null) : copy;
  const ms = metas.filter(m => m.copy === selected);

  const identity: GeneratedLayout['identity'] = {};
  const identityRects: GeneratedLayout['identityRects'] = {};
  for (const m of ms) {
    if (m.kind === 'identity') {
      identityRects[m.role] = rectOf(m);
      identity[m.role] = toZone(rectOf(m));
    }
  }

  const questions: GeneratedQuestion[] = [];
  const byKey = new Map<string, GeneratedQuestion>();
  for (const m of ms) {
    if (m.kind === 'question') {
      if (byKey.has(m.key)) {
        throw new TypstZoneError(`question ${m.key} defined twice`);
      }
      const q: GeneratedQuestion = {
        key: m.key,
        kind: m.type,
        number: m.number,
        displayed: m.displayed,
        points: m.points,
        validExpression: m.type === 'qcm' ? (m.grading ?? m.correct ?? undefined) || undefined : undefined,
        meta: m,
        parts: [],
      };
      byKey.set(m.key, q);
      questions.push(q);
    }
  }

  const partsOf = new Map<string, Map<number, ZoneMeta[]>>();
  for (const m of ms) {
    if (m.kind === 'question' || m.kind === 'identity') {
      continue;
    }
    if (m.question === null || !byKey.has(m.question)) {
      throw new TypstZoneError(`zone ${m.kind} outside of a question`);
    }
    const parts = partsOf.get(m.question) ?? new Map<number, ZoneMeta[]>();
    parts.set(m.part, [...(parts.get(m.part) ?? []), m]);
    partsOf.set(m.question, parts);
  }

  for (const q of questions) {
    const parts = partsOf.get(q.key) ?? new Map<number, ZoneMeta[]>();
    for (const [part, zs] of [...parts.entries()].sort((a, b) => a[0] - b[0])) {
      q.parts.push(buildPart(q, part, zs));
    }
    if (q.parts.length === 0) {
      throw new TypstZoneError(`question ${q.key} has no answer zone`);
    }
  }

  const numbers = new Set<number>();
  for (const q of questions) {
    if (numbers.has(q.number)) {
      throw new TypstZoneError(`question number ${q.number} used twice`);
    }
    numbers.add(q.number);
  }

  return { copy: selected, identity, identityRects, questions };
}

function buildPart(q: GeneratedQuestion, part: number, zs: ZoneMeta[]): GeneratedPart {
  const pages = new Set(zs.map(z => z['page-in-copy']));
  if (pages.size > 1) {
    throw new TypstZoneError(`question ${q.key}, part ${part}: zone split over several pages`);
  }
  const boxes = zs.filter((z): z is QcmBoxMeta | NumericBubbleMeta => z.kind === 'qcm-box' || z.kind === 'numeric-bubble');
  if (boxes.length > 0) {
    const ordered = detectionOrder(boxes);
    const rect = boundingRect(ordered.map(rectOf), DETECTION_PADDING_MM);
    return {
      part,
      rect,
      zone: toZone(rect),
      boxes: ordered.map(b => (b.kind === 'qcm-box' ? b.letter : `${b.digit}:${b.value}`)),
    };
  }
  const cells = zs.filter((z): z is NumericCellMeta => z.kind === 'numeric-digit' || z.kind === 'numeric-sign');
  if (cells.length > 0) {
    const ordered = [...cells].sort((a, b) => a.x - b.x);
    const rect = boundingRect(ordered.map(rectOf), DETECTION_PADDING_MM);
    return { part, rect, zone: toZone(rect), cells: ordered.map(c => toZone(rectOf(c))) };
  }
  if (zs.length !== 1) {
    throw new TypstZoneError(`question ${q.key}, part ${part}: ${zs.length} zones`);
  }
  const rect = rectOf(zs[0]);
  return { part, rect, zone: toZone(rect) };
}

/**
 * Translates the answer read by the MCQ detection on a copy into canonical letters.
 * The detection names the ticked boxes after their rank in the zone (`a` = first box), which is the order
 * printed on that version; the grading DSL and the options use the canonical letters.
 * `boxes`: canonical letter of each box in detection order (`GeneratedPart.boxes`).
 */
export function toCanonicalAnswer(detected: string, boxes: string[]): string {
  const ranks = normalizeQcmAnswer(detected)
    .split('&')
    .filter(l => l !== '')
    .map(l => l.charCodeAt(0) - 97);
  const unknown = ranks.find(r => r < 0 || r >= boxes.length);
  if (unknown !== undefined) {
    throw new TypstZoneError(`box ${String.fromCharCode(97 + unknown)} is not in the zone (${boxes.length} boxes)`);
  }
  return normalizeQcmAnswer(ranks.map(r => boxes[r]).join('&'));
}

interface LatexRect {
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
  t?: 'qcm';
}

function toLatexRect(r: PtRect, t?: 'qcm'): LatexRect {
  const cm = (v: number): number => Math.round((v / PT_PER_CM) * 1000) / 1000;
  // Same convention as the LaTeX class (`latex-template.zip`): y is the bottom edge, from the top of the page
  return { x: cm(r.x), y: cm(r.y + r.h), w: cm(r.w), h: cm(r.h), p: r.page, ...(t ? { t } : {}) };
}

/**
 * Custom properties of the PDF information dictionary in the format written by the LaTeX class of CorrectExam
 * (`correctexam-answer-{question}-{part}`, `correctexam-lastname`, …). With them, a generated PDF can also be
 * uploaded through the current template flow, which creates the zones when the template is opened
 * (`fabric-canvas.component.ts`, `getCustomPdfProperties`).
 */
export function toLatexCompatibleProperties(layout: GeneratedLayout): Record<string, string> {
  const props: Record<string, string> = {};
  const names: Record<IdentityRole, string> = { lastname: 'lastname', firstname: 'firstname', stdid: 'stdid' };
  for (const role of Object.keys(names) as IdentityRole[]) {
    const r = layout.identityRects[role];
    if (r) {
      props[`correctexam-${names[role]}`] = JSON.stringify(toLatexRect(r));
    }
  }
  for (const q of layout.questions) {
    for (const p of q.parts) {
      props[`correctexam-answer-${q.number}-${p.part}`] = JSON.stringify(toLatexRect(p.rect, q.kind === 'qcm' ? 'qcm' : undefined));
    }
  }
  return props;
}
