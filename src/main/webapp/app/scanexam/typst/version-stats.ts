/**
 * Results per version of the subject (T25e6b, ADR 0005): the copies of the versions were rebuilt in the layout of
 * version A and graded together; their notes are compared version by version to spot a version that was harder (a
 * wording variant, an order of questions). Pure module.
 */

/** A result as returned by `api/showResult` (notes in text, with a decimal comma or dot). */
export interface VersionedResult {
  version?: string | null;
  /** > 0: absent. */
  abi: number;
  note?: string;
  notequestions: Record<string, string>;
}

export interface VersionedQuestion {
  numero: number;
  label: string;
  bareme: number;
}

export interface VersionStats {
  label: string;
  copies: number;
  /** Mean of the final notes. */
  mean: number;
  /** Mean note of each question (by numero), undefined when no copy of the version has a note for it. */
  questions: Record<number, number | undefined>;
}

export interface VersionGap {
  label: string;
  numero: number;
  /** Mean of the version minus mean of all the copies, in points. */
  delta: number;
}

export interface VersionComparison {
  versions: VersionStats[];
  /** Mean of each question over all the copies with a known version. */
  overall: Record<number, number | undefined>;
  /** Questions where a version differs from the others by more than `GAP_RATIO` of the points. */
  gaps: VersionGap[];
  /** Results without a known version (copy not read, not printed by CorrectExam). */
  unknown: number;
}

/** A version is reported when its mean differs from the overall mean by more than 15 % of the points. */
export const GAP_RATIO = 0.15;
/** Below this number of copies, a mean says little: no gap reported. */
export const MIN_COPIES_FOR_GAP = 3;

const num = (s: string | undefined): number | undefined => {
  if (s === undefined || s === null) {
    return undefined;
  }
  const v = parseFloat(String(s).replace(',', '.'));
  return Number.isFinite(v) ? v : undefined;
};

const mean = (xs: number[]): number | undefined => (xs.length === 0 ? undefined : xs.reduce((a, b) => a + b, 0) / xs.length);

/** Comparison of the versions; undefined when the results hold fewer than two versions. */
export function compareVersions(results: VersionedResult[], questions: VersionedQuestion[]): VersionComparison | undefined {
  const present = results.filter(r => r.abi <= 0);
  const known = present.filter(r => typeof r.version === 'string' && r.version !== '');
  const labels = [...new Set(known.map(r => r.version!))].sort();
  if (labels.length < 2) {
    return undefined;
  }
  const noteOf = (r: VersionedResult, numero: number): number | undefined => num(r.notequestions[String(numero)]);
  const overall: Record<number, number | undefined> = {};
  for (const q of questions) {
    overall[q.numero] = mean(known.map(r => noteOf(r, q.numero)).filter((n): n is number => n !== undefined));
  }
  const versions: VersionStats[] = labels.map(label => {
    const of = known.filter(r => r.version === label);
    const qs: Record<number, number | undefined> = {};
    for (const q of questions) {
      qs[q.numero] = mean(of.map(r => noteOf(r, q.numero)).filter((n): n is number => n !== undefined));
    }
    return { label, copies: of.length, mean: mean(of.map(r => num(r.note) ?? 0)) ?? 0, questions: qs };
  });
  const gaps: VersionGap[] = [];
  for (const v of versions) {
    if (v.copies < MIN_COPIES_FOR_GAP) {
      continue;
    }
    for (const q of questions) {
      const m = v.questions[q.numero];
      const o = overall[q.numero];
      if (m !== undefined && o !== undefined && q.bareme > 0 && Math.abs(m - o) > GAP_RATIO * q.bareme) {
        gaps.push({ label: v.label, numero: q.numero, delta: m - o });
      }
    }
  }
  return { versions, overall, gaps, unknown: present.length - known.length };
}
