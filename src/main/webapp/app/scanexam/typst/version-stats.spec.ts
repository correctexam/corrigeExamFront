/**
 * @jest-environment node
 */
import { compareVersions, VersionedResult } from './version-stats';

const r = (version: string | null, note: string, q1: string, q2: string, abi = 0): VersionedResult => ({
  version,
  abi,
  note,
  notequestions: { '1': q1, '2': q2 },
});
const questions = [
  { numero: 1, label: 'Q1', bareme: 4 },
  { numero: 2, label: 'Q2', bareme: 2 },
];

describe('results per version (T25e6b)', () => {
  it('needs at least two versions', () => {
    expect(compareVersions([r('A', '3', '2', '1'), r(null, '2', '1', '1')], questions)).toBeUndefined();
    expect(compareVersions([], questions)).toBeUndefined();
  });

  it('gives the means of each version and question, and the copies without version', () => {
    const c = compareVersions(
      [
        r('A', '5', '4', '1'),
        r('A', '3', '2', '1'),
        r('B', '2,5', '1,5', '1'),
        r('B', '0', '', ''),
        r(null, '4', '3', '1'),
        r('B', '9', '4', '2', 1),
      ],
      questions,
    )!;
    expect(c.versions.map(v => [v.label, v.copies, v.mean])).toEqual([
      ['A', 2, 4],
      ['B', 2, 1.25],
    ]);
    expect(c.versions[0].questions).toEqual({ 1: 3, 2: 1 });
    // an empty note is not a note
    expect(c.versions[1].questions).toEqual({ 1: 1.5, 2: 1 });
    expect(c.overall[1]).toBeCloseTo((4 + 2 + 1.5) / 3);
    expect(c.unknown).toBe(1);
    // fewer than 3 copies: no gap reported
    expect(c.gaps).toEqual([]);
  });

  it('reports a question where a version differs by more than 15 % of the points', () => {
    const results = [...Array.from({ length: 4 }, () => r('A', '5', '4', '1')), ...Array.from({ length: 4 }, () => r('B', '3', '2', '1'))];
    const c = compareVersions(results, questions)!;
    // Q1: A 4, B 2, overall 3 → ±1 > 0.6 ; Q2: same everywhere
    expect(c.gaps).toEqual([
      { label: 'A', numero: 1, delta: 1 },
      { label: 'B', numero: 1, delta: -1 },
    ]);
  });
});
