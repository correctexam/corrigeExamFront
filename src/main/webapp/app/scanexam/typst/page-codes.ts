/**
 * Page codes read on a scan (T25d2, ADR 0004): which copy and page of which print run each scanned page is, what is
 * missing, doubled or foreign, and the order that puts the pages back where the template expects them.
 * Pure module: the codes are read by `page-code.worker.ts`, the cache is changed by `PageCodeCheckService`.
 *
 * Code printed by T25d1: `CE1|<print run>|<copy>|<page>`, copy and page numbered from 1.
 */

export interface PageCode {
  edition: number;
  copy: number;
  page: number;
}

/** Print run as recorded by the server (`exam_edition`). */
export interface EditionInfo {
  id: number;
  copies: number;
  pagesPerCopy: number;
}

/** What the reader found on a page of the scan (numbered from 1, as in the cache). */
export interface ScannedPage {
  scanPage: number;
  /** Text of the Data Matrix found, if any. */
  text?: string;
  /** The code was read upside down: the page was scanned rotated by 180°. */
  upsideDown?: boolean;
}

export type PageStatus =
  /** Code of a print run of this exam, first page with this code. */
  | 'ok'
  /** No code read, but its neighbours tell which page it is. */
  | 'inferred'
  /** No code read. */
  | 'unreadable'
  /** A code, but not of a print run of this exam (another exam, a page out of range, another format). */
  | 'foreign'
  /** Same code as an earlier page of the scan. */
  | 'duplicate';

export interface AnalysedPage extends ScannedPage {
  status: PageStatus;
  code?: PageCode;
}

export interface CopyReport {
  edition: number;
  copy: number;
  /** Pages found, in the order of the copy. */
  present: number[];
  missing: number[];
}

/** One place of the target order: a page of the scan, or a blank page standing for a missing one. */
export type OrderSlot =
  | { kind: 'scan'; scanPage: number; rotate: boolean }
  | { kind: 'blank'; edition: number; copy: number; page: number };

export interface CodeReport {
  pages: AnalysedPage[];
  copies: CopyReport[];
  /** Scan pages by status (inferred pages are counted as read). */
  unreadable: number[];
  foreign: number[];
  duplicates: number[];
  inferred: number[];
  upsideDown: number[];
  /** Target order: the copies in print order, each page at its place, then the pages that could not be placed. */
  order: OrderSlot[];
  /** True when the scan is already in this order, without missing nor rotated page. */
  inOrder: boolean;
}

/** A symbol found by the reader in a band of the page. */
export interface BandRead {
  text: string;
}

/**
 * Code of a page from what was read in its bottom band (where the code is printed) and in its top band (where it
 * is when the page was scanned upside down). A code of the contract is preferred to any other symbol.
 */
export function pickCode(bottom: BandRead[], top: BandRead[]): Pick<ScannedPage, 'text' | 'upsideDown'> {
  const ours = (reads: BandRead[]): BandRead | undefined => reads.find(r => parsePageCode(r.text) !== undefined);
  const b = ours(bottom);
  if (b) {
    return { text: b.text, upsideDown: false };
  }
  const t = ours(top);
  if (t) {
    return { text: t.text, upsideDown: true };
  }
  // another symbol (a code of something else): reported as foreign, never placed
  const other = bottom[0] ?? top[0];
  return other ? { text: other.text, upsideDown: false } : {};
}

const CODE = /^CE1\|(\d{1,9})\|(\d{1,6})\|(\d{1,4})$/;

export function parsePageCode(text: string | undefined): PageCode | undefined {
  const m = CODE.exec(text?.trim() ?? '');
  return m ? { edition: Number(m[1]), copy: Number(m[2]), page: Number(m[3]) } : undefined;
}

const key = (c: PageCode): string => `${c.edition}|${c.copy}|${c.page}`;

/**
 * Analyses the codes read on a scan. `editions` are the print runs of the exam: a code of another print run, or out of
 * its range, is foreign. An unreadable page is inferred when the page before it (or after it) in the scan is the
 * previous (or next) page of the same copy and the page in between is missing.
 */
export function analyseScan(scanned: ScannedPage[], editions: EditionInfo[]): CodeReport {
  const byId = new Map(editions.map(e => [e.id, e]));
  const seen = new Set<string>();
  const pages: AnalysedPage[] = [...scanned]
    .sort((a, b) => a.scanPage - b.scanPage)
    .map(p => {
      if (p.text === undefined || p.text === '') {
        return { ...p, status: 'unreadable' as const };
      }
      const code = parsePageCode(p.text);
      const edition = code ? byId.get(code.edition) : undefined;
      if (!code || !edition || code.copy < 1 || code.copy > edition.copies || code.page < 1 || code.page > edition.pagesPerCopy) {
        return { ...p, status: 'foreign' as const };
      }
      if (seen.has(key(code))) {
        return { ...p, status: 'duplicate' as const, code };
      }
      seen.add(key(code));
      return { ...p, status: 'ok' as const, code };
    });

  // unreadable pages placed by their neighbours (a smudged or torn code)
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].status !== 'unreadable') {
      continue;
    }
    const candidates: PageCode[] = [];
    const before = pages[i - 1];
    const after = pages[i + 1];
    if (before?.code && (before.status === 'ok' || before.status === 'inferred')) {
      candidates.push({ ...before.code, page: before.code.page + 1 });
    }
    if (after?.code && after.status === 'ok') {
      candidates.push({ ...after.code, page: after.code.page - 1 });
    }
    const found = candidates.find(c => {
      const edition = byId.get(c.edition);
      return edition !== undefined && c.page >= 1 && c.page <= edition.pagesPerCopy && !seen.has(key(c));
    });
    if (found) {
      seen.add(key(found));
      // a page without code keeps its orientation: the neighbours say nothing about it
      pages[i] = { ...pages[i], status: 'inferred', code: found };
    }
  }

  // copies found in the scan, in print order; the copies of absent students are not expected
  const copyKeys = new Map<string, { edition: number; copy: number }>();
  for (const p of pages) {
    if (p.code && (p.status === 'ok' || p.status === 'inferred')) {
      copyKeys.set(`${p.code.edition}|${p.code.copy}`, { edition: p.code.edition, copy: p.code.copy });
    }
  }
  const located = new Map<string, AnalysedPage>();
  for (const p of pages) {
    if (p.code && (p.status === 'ok' || p.status === 'inferred')) {
      located.set(key(p.code), p);
    }
  }
  const copies: CopyReport[] = [...copyKeys.values()]
    .sort((a, b) => a.edition - b.edition || a.copy - b.copy)
    .map(({ edition, copy }) => {
      const n = byId.get(edition)!.pagesPerCopy;
      const present: number[] = [];
      const missing: number[] = [];
      for (let page = 1; page <= n; page++) {
        (located.has(key({ edition, copy, page })) ? present : missing).push(page);
      }
      return { edition, copy, present, missing };
    });

  const order: OrderSlot[] = [];
  for (const c of copies) {
    const n = byId.get(c.edition)!.pagesPerCopy;
    for (let page = 1; page <= n; page++) {
      const p = located.get(key({ edition: c.edition, copy: c.copy, page }));
      order.push(
        p
          ? { kind: 'scan', scanPage: p.scanPage, rotate: p.upsideDown === true }
          : { kind: 'blank', edition: c.edition, copy: c.copy, page },
      );
    }
  }
  for (const p of pages) {
    if (p.status === 'unreadable' || p.status === 'foreign' || p.status === 'duplicate') {
      order.push({ kind: 'scan', scanPage: p.scanPage, rotate: p.upsideDown === true });
    }
  }

  const select = (s: PageStatus): number[] => pages.filter(p => p.status === s).map(p => p.scanPage);
  const inOrder = order.every((slot, i) => slot.kind === 'scan' && !slot.rotate && slot.scanPage === pages[i]?.scanPage);
  return {
    pages,
    copies,
    unreadable: select('unreadable'),
    foreign: select('foreign'),
    duplicates: select('duplicate'),
    inferred: select('inferred'),
    upsideDown: pages.filter(p => p.upsideDown).map(p => p.scanPage),
    order,
    inOrder,
  };
}

/**
 * Moves (`from` → `to`, positions from 1, as `CacheService.moveNonAlignPages`: the page leaves `from`, the pages in
 * between shift by one, it lands at `to`) that turn `current` into `target`. Both lists hold the same items.
 * The items of the longest subsequence already in the target order stay where they are: each move places one of the
 * other items, so a scan almost in order costs a few moves.
 */
export function moveSequence<T>(current: T[], target: T[]): [number, number][] {
  if (current.length !== target.length) {
    throw new Error('moveSequence: different lengths');
  }
  const rank = new Map(target.map((item, i) => [item, i]));
  const ranks = current.map(item => {
    const r = rank.get(item);
    if (r === undefined) {
      throw new Error('moveSequence: item missing from the target order');
    }
    return r;
  });
  const settled = new Set(longestIncreasing(ranks).map(i => current[i]));
  const cur = [...current];
  const moves: [number, number][] = [];
  target.forEach((item, t) => {
    if (settled.has(item)) {
      return;
    }
    const from = cur.indexOf(item);
    cur.splice(from, 1);
    // right after the closest item before it in the target order that is already in place
    let k = t - 1;
    while (k >= 0 && !settled.has(target[k])) {
      k--;
    }
    const to = k < 0 ? 0 : cur.indexOf(target[k]) + 1;
    cur.splice(to, 0, item);
    settled.add(item);
    if (from !== to) {
      moves.push([from + 1, to + 1]);
    }
  });
  return moves;
}

/** Indices of a longest strictly increasing subsequence (patience sorting, O(n log n)). */
function longestIncreasing(values: number[]): number[] {
  const tails: number[] = [];
  const previous: number[] = new Array<number>(values.length).fill(-1);
  values.forEach((v, i) => {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (values[tails[mid]] < v) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    previous[i] = lo > 0 ? tails[lo - 1] : -1;
    tails[lo] = i;
  });
  const out: number[] = [];
  for (let i = tails.length ? tails[tails.length - 1] : -1; i >= 0; i = previous[i]) {
    out.unshift(i);
  }
  return out;
}

/**
 * Summary of the page codes read by the alignment worker (T25d3): `details` of the `finished` status, JSON
 * `{"pagecodes": …}` written by the Rust worker (`Summary` in `pagecodes.rs`). Scan pages are those of the original
 * scan; the cache is already in print order.
 */
export interface ServerPageCodeSummary {
  pages: number;
  copies: number;
  complete: number;
  incomplete: { edition: number; copy: number; missing: number[] }[];
  upside_down: number[];
  duplicates: number[];
  foreign: number[];
  unreadable: number[];
  inferred: number[];
  blanks: number;
  reordered: boolean;
}

/** The summary in the `details` of a `finished` status, undefined for the other details (plain text). */
export function parseServerSummary(details: string | null | undefined): ServerPageCodeSummary | undefined {
  if (!details?.trim().startsWith('{')) {
    return undefined;
  }
  try {
    const value = (JSON.parse(details) as { pagecodes?: unknown }).pagecodes;
    const numbers = (v: unknown): v is number[] => Array.isArray(v) && v.every(n => typeof n === 'number');
    if (typeof value !== 'object' || value === null) {
      return undefined;
    }
    const s = value as Partial<ServerPageCodeSummary>;
    const valid =
      typeof s.pages === 'number' &&
      typeof s.copies === 'number' &&
      typeof s.complete === 'number' &&
      typeof s.blanks === 'number' &&
      typeof s.reordered === 'boolean' &&
      Array.isArray(s.incomplete) &&
      [s.upside_down, s.duplicates, s.foreign, s.unreadable, s.inferred].every(numbers);
    return valid ? (s as ServerPageCodeSummary) : undefined;
  } catch {
    return undefined;
  }
}
