/**
 * @jest-environment node
 */
import { analyseScan, EditionInfo, moveSequence, parsePageCode, parseServerSummary, ScannedPage } from './page-codes';

const editions: EditionInfo[] = [{ id: 12, copies: 30, pagesPerCopy: 2 }];
const scan = (...texts: (string | undefined)[]): ScannedPage[] => texts.map((text, i) => ({ scanPage: i + 1, text }));
const code = (copy: number, page: number, edition = 12): string => `CE1|${edition}|${copy}|${page}`;

/** Applies moves like `CacheService.moveNonAlignPages`. */
function applyMoves<T>(items: T[], moves: [number, number][]): T[] {
  const out = [...items];
  for (const [from, to] of moves) {
    const [item] = out.splice(from - 1, 1);
    out.splice(to - 1, 0, item);
  }
  return out;
}

describe('page codes', () => {
  it('parses the codes of the contract only', () => {
    expect(parsePageCode('CE1|12|3|4')).toEqual({ edition: 12, copy: 3, page: 4 });
    expect(parsePageCode(' CE1|12|3|4\n')).toEqual({ edition: 12, copy: 3, page: 4 });
    for (const t of [undefined, '', 'CE2|12|3|4', 'CE1|12|3', 'CE1|a|3|4', 'https://example.org', 'CE1|12|3|4|5']) {
      expect(parsePageCode(t)).toBeUndefined();
    }
  });

  it('finds nothing to do on a scan in order', () => {
    const report = analyseScan(scan(code(1, 1), code(1, 2), code(4, 1), code(4, 2)), editions);
    expect(report.inOrder).toBe(true);
    expect(report.copies.map(c => [c.copy, c.missing])).toEqual([
      [1, []],
      [4, []],
    ]);
  });

  it('puts mixed and upside-down pages back in order', () => {
    const scanned = scan(code(2, 2), code(1, 1), code(2, 1), code(1, 2));
    scanned[0].upsideDown = true;
    const report = analyseScan(scanned, editions);
    expect(report.inOrder).toBe(false);
    expect(report.upsideDown).toEqual([1]);
    expect(report.order).toEqual([
      { kind: 'scan', scanPage: 2, rotate: false },
      { kind: 'scan', scanPage: 4, rotate: false },
      { kind: 'scan', scanPage: 3, rotate: false },
      { kind: 'scan', scanPage: 1, rotate: true },
    ]);
  });

  it('keeps the place of a missing page with a blank page', () => {
    const report = analyseScan(scan(code(1, 1), code(2, 1), code(2, 2)), editions);
    expect(report.copies.find(c => c.copy === 1)!.missing).toEqual([2]);
    expect(report.order[1]).toEqual({ kind: 'blank', edition: 12, copy: 1, page: 2 });
    expect(report.order.length).toBe(4);
  });

  it('sets aside duplicate, foreign and unreadable pages, after the copies', () => {
    const report = analyseScan(
      scan(code(1, 1), code(1, 1), 'CE1|99|1|1', code(1, 3), 'not a code', code(3, 1), undefined, undefined, code(3, 2)),
      editions,
    );
    expect(report.duplicates).toEqual([2]);
    expect(report.foreign).toEqual([3, 4, 5]);
    expect(report.unreadable).toEqual([7, 8]);
    expect(report.order.slice(-6).map(s => (s.kind === 'scan' ? s.scanPage : 0))).toEqual([2, 3, 4, 5, 7, 8]);
  });

  it('infers an unreadable page from its neighbours', () => {
    const report = analyseScan(scan(code(5, 1), undefined, code(6, 1), code(6, 2)), editions);
    expect(report.inferred).toEqual([2]);
    expect(report.pages[1].code).toEqual({ edition: 12, copy: 5, page: 2 });
    expect(report.unreadable).toEqual([]);
    expect(report.inOrder).toBe(true);

    // from the next page too
    const next = analyseScan(scan(undefined, code(7, 2)), editions);
    expect(next.pages[0].code).toEqual({ edition: 12, copy: 7, page: 1 });
  });

  it('never infers a page that exists elsewhere', () => {
    const report = analyseScan(scan(code(5, 1), undefined, code(5, 2)), editions);
    expect(report.unreadable).toEqual([2]);
  });

  it('turns any order into the target with moves of the cache', () => {
    const current = [1, 2, 3, 4, 5, 6, 7, 8];
    for (const target of [
      [1, 2, 3, 4, 5, 6, 7, 8],
      [8, 7, 6, 5, 4, 3, 2, 1],
      [2, 1, 3, 4, 6, 5, 8, 7],
      [3, 1, 2, 7, 4, 8, 6, 5],
    ]) {
      const moves = moveSequence(current, target);
      expect(applyMoves(current, moves)).toEqual(target);
    }
    expect(moveSequence(current, current)).toEqual([]);
    // one page out of place: one move
    expect(moveSequence([1, 2, 3, 4, 5], [1, 2, 4, 5, 3])).toEqual([[3, 5]]);
    expect(moveSequence([1, 2, 3, 4, 5], [5, 1, 2, 3, 4])).toEqual([[5, 1]]);
    // random permutations
    for (let n = 0; n < 200; n++) {
      const target = [...current].sort(() => Math.random() - 0.5);
      expect(applyMoves(current, moveSequence(current, target))).toEqual(target);
    }
  });

  it('reads the summary sent by the alignment worker', () => {
    // as written by the Rust worker (finished_details)
    const details = JSON.stringify({
      pagecodes: {
        pages: 5,
        copies: 3,
        complete: 2,
        incomplete: [{ edition: 41, copy: 1, missing: [2] }],
        upside_down: [3],
        duplicates: [],
        foreign: [],
        unreadable: [],
        inferred: [],
        blanks: 1,
        reordered: true,
      },
    });
    expect(parseServerSummary(details)).toEqual(expect.objectContaining({ copies: 3, blanks: 1, upside_down: [3] }));
    for (const d of [undefined, null, '', 'Traitement complet terminé', '{"pagecodes": {"pages": 1}}', '{not json', '{"other": 1}']) {
      expect(parseServerSummary(d)).toBeUndefined();
    }
  });
});
