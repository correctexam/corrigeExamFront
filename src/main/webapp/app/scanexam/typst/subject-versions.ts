/**
 * Several versions of a subject written in Typst (T25e, ADR 0005).
 *
 * Version A is the subject as written (identity plan): it holds the template, the zones and the questions of the
 * exam. The other versions mix the questions of the sections marked `shuffle`, the choices of the MCQs (fixed
 * choices keep their place) and pick a wording variant; the package applies the plan (`ce-plan`). The copies of
 * the other versions are rebuilt in the layout of version A after the alignment, which needs, for every version,
 * the position of each answer zone and of each MCQ box: the layout computed here.
 *
 * Pure module: the compilation is given as a function, the plans are drawn with a seeded generator.
 */

import { IZone } from 'app/entities/zone/zone.model';
import { padForRectoVerso, parseCopyPages } from './exam-from-subject';
import { TypstCompileResponse, TypstDiagnostic } from './typst-worker.protocol';
import {
  buildLayout,
  GeneratedLayout,
  IdentityRole,
  parseZoneMetadata,
  PtRect,
  QcmBoxMeta,
  QuestionMeta,
  toZone,
  TypstZoneError,
} from './typst-zones';

export const MAX_VERSIONS = 6;
export const VERSION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
/** Same zone in two versions: sizes may differ by rounding only. */
const SIZE_TOLERANCE_PT = 0.5;

/** What can vary between versions, read on the compilation of version A. */
export interface VersionStructure {
  /** Sections marked `shuffle`, with their number of items. */
  sections: { key: string; items: number }[];
  /** MCQs: number of choices and choices that keep their place. */
  qcms: { key: string; choices: number; fixed: number[] }[];
  /** Wording variants and their number of wordings. */
  variants: { key: string; count: number }[];
}

/** Plan of one version, as read by the package (`ce-plan`). */
export interface VersionPlan {
  index: number;
  label: string;
  order: Record<string, number[]>;
  choices: Record<string, number[]>;
  variants: Record<string, number>;
}

/** Position of the zones of a version, in 1/100000 of the page (`format: 1`, stored with the exam in T25e2). */
export interface VersionLayout {
  format: 1;
  version: number;
  label: string;
  pages: number;
  parts: { key: string; part: number; zone: IZone }[];
  boxes: { key: string; part: number; letter: string; zone: IZone }[];
  identity: Partial<Record<IdentityRole, IZone>>;
}

export interface VersionIssue {
  version: string;
  /** i18n key (`typstsubject.versions.issue.*`). */
  key: string;
  params?: Record<string, string | number>;
}

export interface BuiltVersion {
  plan: VersionPlan;
  pdf: Uint8Array;
  layout: VersionLayout;
  /** Pages written by the subject, before the blank pages added for an even and common number of pages. */
  pages: number;
}

export interface BuiltVersions {
  seed: number;
  versions: BuiltVersion[];
  issues: VersionIssue[];
  /** Compilation errors of a version (the subject does not compile with its plan). */
  diagnostics?: { version: string; diagnostics: TypstDiagnostic[] };
}

/** Compiles the subject with the given `ce-plan` (PDF included). */
export type CompileWithPlan = (cePlan: Record<string, unknown>) => Promise<TypstCompileResponse>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function values(raw: unknown): Record<string, unknown>[] {
  return Array.isArray(raw) ? (raw as unknown[]).map(i => (isRecord(i) && isRecord(i['value']) ? i['value'] : i)).filter(isRecord) : [];
}

/** Structure of the subject from the compilation of version A. */
export function readStructure(res: Pick<TypstCompileResponse, 'zones' | 'sections' | 'variants'>): VersionStructure {
  const sections = values(res.sections)
    .filter(s => s['shuffle'] === true && typeof s['key'] === 'string' && typeof s['items'] === 'number' && s['items'] > 1)
    .map(s => ({ key: s['key'] as string, items: s['items'] as number }));
  const qcms = parseZoneMetadata(res.zones ?? [])
    .filter(m => m.kind === 'question' && m.type === 'qcm' && (m.choices ?? 0) > 1)
    .map(m => {
      const q = m as QuestionMeta;
      return { key: q.key, choices: q.choices!, fixed: Array.isArray(q.fixed) ? q.fixed.filter(i => typeof i === 'number') : [] };
    });
  const variants = new Map<string, number>();
  for (const v of values(res.variants)) {
    if (typeof v['key'] === 'string' && typeof v['count'] === 'number') {
      const known = variants.get(v['key']);
      if (known !== undefined && known !== v['count']) {
        throw new TypstZoneError(`variant ${v['key']}: ${known} and ${v['count']} wordings`);
      }
      variants.set(v['key'], v['count']);
    }
  }
  return { sections, qcms, variants: [...variants].filter(([, count]) => count > 1).map(([key, count]) => ({ key, count })) };
}

/** True when two versions can differ. */
export function canVary(s: VersionStructure): boolean {
  return s.sections.length > 0 || s.qcms.some(q => q.choices - q.fixed.length > 1) || s.variants.length > 0;
}

/** Seeded generator (mulberry32): the same seed always gives the same versions. */
export function seededRandom(seed: number): () => number {
  /* eslint-disable no-bitwise -- mulberry32 is defined on 32-bit integer operations */
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  /* eslint-enable no-bitwise */
}

function shuffle(n: number, random: () => number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Order of the choices of an MCQ: the fixed choices stay at their index, the others are mixed. */
function choiceOrder(choices: number, fixed: number[], random: () => number): number[] {
  const free = Array.from({ length: choices }, (_, i) => i).filter(i => !fixed.includes(i));
  const mixed = shuffle(free.length, random).map(i => free[i]);
  let next = 0;
  return Array.from({ length: choices }, (_, i) => (fixed.includes(i) ? i : mixed[next++]));
}

const identity = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

function signature(p: VersionPlan): string {
  return JSON.stringify([p.order, p.choices, p.variants]);
}

/**
 * Plans of `count` versions: version A is the subject as written; the others are drawn with `seed`, each one
 * different from the previous ones when the subject allows it. The variant of version `v` is `v mod wordings`:
 * two consecutive versions (two neighbours in the pile) never have the same wording when there are several.
 */
export function planVersions(s: VersionStructure, count: number, seed: number): VersionPlan[] {
  if (!Number.isInteger(count) || count < 1 || count > MAX_VERSIONS) {
    throw new TypstZoneError(`versions: between 1 and ${MAX_VERSIONS}`);
  }
  const random = seededRandom(seed);
  const plans: VersionPlan[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < count; index++) {
    let plan: VersionPlan;
    let tries = 0;
    do {
      const first = index === 0;
      plan = {
        index,
        label: VERSION_LABELS[index],
        order: Object.fromEntries(s.sections.map(sec => [sec.key, first ? identity(sec.items) : shuffle(sec.items, random)])),
        choices: Object.fromEntries(s.qcms.map(q => [q.key, first ? identity(q.choices) : choiceOrder(q.choices, q.fixed, random)])),
        variants: Object.fromEntries(s.variants.map(v => [v.key, index % v.count])),
      };
      tries++;
    } while (index > 0 && seen.has(signature(plan)) && tries < 50);
    seen.add(signature(plan));
    plans.push(plan);
  }
  return plans;
}

/** `ce-plan` of a version: its plan, an empty code area (stamped at print time) and the blank pages to add. */
export function cePlan(plan: VersionPlan, pad: number): Record<string, unknown> {
  return { version: plan.label, order: plan.order, choices: plan.choices, variants: plan.variants, stamp: true, pad };
}

/** Layout of a version from its zones (`query(<ce-zone>)`). */
export function versionLayout(zones: unknown, plan: VersionPlan, pages: number): { layout: VersionLayout; rects: GeneratedLayout } {
  const metas = parseZoneMetadata(zones);
  const generated = buildLayout(metas);
  const boxes = metas
    .filter((m): m is QcmBoxMeta => m.kind === 'qcm-box' && m.copy === generated.copy)
    .map(b => ({ key: b.question!, part: b.part, letter: b.letter, zone: toZone(rectOfBox(b)) }));
  return {
    rects: generated,
    layout: {
      format: 1,
      version: plan.index,
      label: plan.label,
      pages,
      parts: generated.questions.flatMap(q => q.parts.map(p => ({ key: q.key, part: p.part, zone: p.zone }))),
      boxes,
      identity: generated.identity,
    },
  };
}

function rectOfBox(b: QcmBoxMeta): PtRect {
  return { page: b['page-in-copy'], x: b.x, y: b.y, w: b.w, h: b.h, pageWidth: b['page-width'], pageHeight: b['page-height'] };
}

/**
 * Checks that every version can be rebuilt in the layout of version A: same answer zones (question key, part) with
 * the same size, same MCQ letters, same identity zones, same number of pages.
 */
export function checkVersions(built: { label: string; pages: number; rects: GeneratedLayout; layout: VersionLayout }[]): VersionIssue[] {
  const issues: VersionIssue[] = [];
  const [a, ...others] = built;
  if (a === undefined) {
    return issues;
  }
  const partsOf = (g: GeneratedLayout): Map<string, PtRect> =>
    new Map(g.questions.flatMap(q => q.parts.map(p => [`${q.key}#${p.part}`, p.rect] as const)));
  const lettersOf = (l: VersionLayout): Map<string, string> => {
    const m = new Map<string, string[]>();
    for (const b of l.boxes) {
      m.set(`${b.key}#${b.part}`, [...(m.get(`${b.key}#${b.part}`) ?? []), b.letter]);
    }
    return new Map([...m].map(([k, v]) => [k, [...v].sort().join('')]));
  };
  const aParts = partsOf(a.rects);
  const aLetters = lettersOf(a.layout);
  for (const v of others) {
    const parts = partsOf(v.rects);
    for (const [k, r] of aParts) {
      const [key, part] = k.split('#');
      const o = parts.get(k);
      if (o === undefined) {
        issues.push({ version: v.label, key: 'missingZone', params: { question: key, part } });
      } else if (Math.abs(o.w - r.w) > SIZE_TOLERANCE_PT || Math.abs(o.h - r.h) > SIZE_TOLERANCE_PT) {
        issues.push({ version: v.label, key: 'zoneSize', params: { question: key, part } });
      }
    }
    for (const k of parts.keys()) {
      if (!aParts.has(k)) {
        const [key, part] = k.split('#');
        issues.push({ version: v.label, key: 'extraZone', params: { question: key, part } });
      }
    }
    const letters = lettersOf(v.layout);
    for (const [k, l] of aLetters) {
      if (letters.get(k) !== undefined && letters.get(k) !== l) {
        issues.push({ version: v.label, key: 'qcmLetters', params: { question: k.split('#')[0] } });
      }
    }
    for (const role of ['lastname', 'firstname', 'stdid'] as const) {
      const ra = a.rects.identityRects[role];
      const ro = v.rects.identityRects[role];
      const same =
        (ra === undefined && ro === undefined) ||
        (ra !== undefined &&
          ro !== undefined &&
          ra.page === ro.page &&
          [ra.x - ro.x, ra.y - ro.y, ra.w - ro.w, ra.h - ro.h].every(d => Math.abs(d) <= SIZE_TOLERANCE_PT));
      if (!same) {
        issues.push({ version: v.label, key: 'identity', params: { role } });
      }
    }
    if (v.layout.pages !== a.layout.pages) {
      issues.push({ version: v.label, key: 'pages', params: { pages: v.layout.pages, expected: a.layout.pages } });
    }
  }
  return issues;
}

/**
 * Compiles the `count` versions of a subject: plans from the structure of version A, a first compilation of each
 * version to know its pages, the same even number of pages for all (blank pages added), then the checks.
 * Stops at the first version that does not compile.
 */
export async function buildVersions(compile: CompileWithPlan, count: number, seed: number): Promise<BuiltVersions> {
  const first = await compile({ stamp: true, pad: 0 });
  if (!first.ok) {
    return { seed, versions: [], issues: [], diagnostics: { version: 'A', diagnostics: first.diagnostics } };
  }
  const structure = readStructure(first);
  if (count > 1 && !canVary(structure)) {
    return { seed, versions: [], issues: [{ version: 'A', key: 'nothingVaries' }] };
  }
  const plans = planVersions(structure, count, seed);

  const compiled: { plan: VersionPlan; res: TypstCompileResponse; pages: number }[] = [];
  for (const plan of plans) {
    const res = plan.index === 0 ? first : await compile(cePlan(plan, 0));
    if (!res.ok) {
      return { seed, versions: [], issues: [], diagnostics: { version: plan.label, diagnostics: res.diagnostics } };
    }
    compiled.push({ plan, res, pages: parseCopyPages(res.copies) ?? 0 });
  }
  const most = Math.max(...compiled.map(c => c.pages));
  const pages = most + padForRectoVerso(most);

  const built: (BuiltVersion & { rects: GeneratedLayout })[] = [];
  for (const c of compiled) {
    const pad = pages - c.pages;
    const res = pad > 0 ? await compile(cePlan(c.plan, pad)) : c.res;
    if (!res.ok || !res.pdf) {
      return { seed, versions: [], issues: [], diagnostics: { version: c.plan.label, diagnostics: res.diagnostics } };
    }
    const { layout, rects } = versionLayout(res.zones, c.plan, pages);
    built.push({ plan: c.plan, pdf: res.pdf, layout, pages: c.pages, rects });
  }
  const issues = checkVersions(built.map(b => ({ label: b.plan.label, pages: b.layout.pages, rects: b.rects, layout: b.layout })));
  return { seed, versions: built.map(b => ({ plan: b.plan, pdf: b.pdf, layout: b.layout, pages: b.pages })), issues };
}

/** A new seed for a draw of versions. */
export function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
