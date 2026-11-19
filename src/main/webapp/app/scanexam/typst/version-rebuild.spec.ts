/**
 * @jest-environment node
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import type { IZone } from 'app/entities/zone/zone.model';
import type { VersionLayout } from './subject-versions';
import {
  blit,
  codeBand,
  copySlots,
  parseServerVersions,
  Raster,
  rebuildCopy,
  versionFromCode,
  versionOfCopy,
  zoneToPixels,
} from './version-rebuild';

const W = 210;
const H = 297;

/** A page of one grey level. */
const page = (level: number): Raster => ({ width: W, height: H, data: new Uint8ClampedArray(W * H * 4).fill(level) });
const at = (r: Raster, x: number, y: number): number => r.data[(y * r.width + x) * 4];
const fill = (r: Raster, rect: { x: number; y: number; w: number; h: number }, level: number): void => {
  for (let y = rect.y; y < rect.y + rect.h; y++) {
    for (let x = rect.x; x < rect.x + rect.w; x++) {
      r.data.fill(level, (y * r.width + x) * 4, (y * r.width + x) * 4 + 4);
    }
  }
};
/** Zone in 1/100000 of the page from millimetres (the test pages have 1 pixel per millimetre). */
const zone = (pageNumber: number, x: number, y: number, w: number, h: number): IZone => ({
  pageNumber,
  xInit: (x / W) * 100000,
  yInit: (y / H) * 100000,
  width: (w / W) * 100000,
  height: (h / H) * 100000,
});
const layout = (
  version: number,
  parts: VersionLayout['parts'],
  boxes: VersionLayout['boxes'] = [],
  identity: VersionLayout['identity'] = {},
): VersionLayout => ({
  format: 1,
  version,
  label: 'AB'[version],
  pages: 2,
  parts,
  boxes,
  identity,
});

describe('rebuilt copies (T25e4)', () => {
  it('takes the versions in turn', () => {
    expect([1, 2, 3, 4].map(c => versionOfCopy(c, 2))).toEqual([0, 1, 0, 1]);
    expect(versionOfCopy(3, 1)).toBe(0);
  });

  it('converts zones to pixels, with a margin in points', () => {
    expect(zoneToPixels(zone(1, 20, 30, 40, 10), W, H)).toEqual({ x: 20, y: 30, w: 40, h: 10 });
    const m = zoneToPixels(zone(1, 20, 30, 40, 10), W, H, 2);
    expect(m.x).toBeLessThan(20);
    expect(m.w).toBeGreaterThan(40);
  });

  it('copies a rectangle and ignores what is outside the page', () => {
    const src = page(255);
    fill(src, { x: 0, y: 0, w: 10, h: 10 }, 0);
    const dst = page(200);
    blit(src, { x: 0, y: 0, w: 10, h: 10 }, dst, { x: 205, y: 290, w: 10, h: 10 });
    expect(at(dst, 205, 290)).toBe(0);
    expect(at(dst, 209, 296)).toBe(0);
    expect(at(dst, 204, 290)).toBe(200);
  });

  it('pastes each answer where version A expects it, from its place in the version (another page)', () => {
    const canonical = layout(0, [{ key: 'q1', part: 1, zone: zone(1, 20, 50, 100, 30) }]);
    const versionB = layout(1, [{ key: 'q1', part: 1, zone: zone(2, 30, 100, 100, 30) }]);
    const copy = [page(255), page(255)];
    fill(copy[1], { x: 40, y: 110, w: 5, h: 5 }, 0); // the student's ink in the zone, page 2 of version B
    fill(copy[0], { x: 150, y: 150, w: 5, h: 5 }, 0); // ink outside any zone
    const templates = [page(250), page(250)];
    const { pages, issues } = rebuildCopy(copy, templates, canonical, versionB);
    expect(issues).toEqual([]);
    expect(at(pages[0], 30, 60)).toBe(0); // same offset in the zone, at the place of version A (page 1)
    expect(at(pages[0], 29, 60)).toBe(255); // the rest of the zone comes from the copy (white paper)
    expect(at(pages[0], 150, 150)).toBe(250); // outside the zones: the template
    expect(at(pages[1], 40, 110)).toBe(250);
    expect(templates[0].data[0]).toBe(250); // the templates are not changed
  });

  it('moves each MCQ box to the box of the same canonical letter, on the background of version A', () => {
    const canonical = layout(
      0,
      [{ key: 'q2', part: 1, zone: zone(1, 10, 10, 100, 20) }],
      [
        { key: 'q2', part: 1, letter: 'a', zone: zone(1, 20, 15, 4, 4) },
        { key: 'q2', part: 1, letter: 'b', zone: zone(1, 60, 15, 4, 4) },
      ],
    );
    // version B shows b first: the box of letter a is on the right
    const versionB = layout(
      1,
      [{ key: 'q2', part: 1, zone: zone(1, 10, 10, 100, 20) }],
      [
        { key: 'q2', part: 1, letter: 'a', zone: zone(1, 60, 15, 4, 4) },
        { key: 'q2', part: 1, letter: 'b', zone: zone(1, 20, 15, 4, 4) },
      ],
    );
    const copy = [page(255), page(255)];
    fill(copy[0], { x: 61, y: 16, w: 2, h: 2 }, 0); // the student ticks "a" (shown second in version B)
    fill(copy[0], { x: 90, y: 12, w: 3, h: 3 }, 0); // text of the choices of version B in the zone
    const { pages } = rebuildCopy(copy, [page(250), page(250)], canonical, versionB);
    expect(at(pages[0], 21, 16)).toBe(0); // ticked at the place of "a" in version A
    expect(at(pages[0], 61, 16)).toBe(255); // box "b" of version A: empty box of the copy
    expect(at(pages[0], 90, 12)).toBe(250); // the rest of the MCQ zone: background of version A
  });

  it('copies the identity zones and the page code band, reports what the version lacks', () => {
    const id = zone(1, 30, 20, 120, 10);
    const canonical = layout(
      0,
      [{ key: 'q1', part: 1, zone: zone(1, 20, 50, 100, 30) }],
      [{ key: 'q2', part: 1, letter: 'c', zone: zone(2, 20, 15, 4, 4) }],
      { lastname: id },
    );
    const versionB = layout(1, [], [], { lastname: id });
    const copy = [page(255), page(255)];
    fill(copy[0], { x: 40, y: 22, w: 3, h: 3 }, 0);
    const band = codeBand(W, H);
    fill(copy[1], { x: band.x + 2, y: band.y + 2, w: 3, h: 3 }, 0);
    const { pages, issues } = rebuildCopy(copy, [page(250), page(250)], canonical, versionB);
    expect(at(pages[0], 40, 22)).toBe(0);
    expect(at(pages[1], band.x + 2, band.y + 2)).toBe(0);
    expect(issues).toEqual([
      { key: 'missingPart', question: 'q1', part: 1 },
      { key: 'missingBox', question: 'q2', part: 1, letter: 'c' },
    ]);
  });

  it('cuts the scan into copies of the template size', () => {
    expect(copySlots(7, 2)).toEqual([
      { firstPage: 1, pages: 2 },
      { firstPage: 3, pages: 2 },
      { firstPage: 5, pages: 2 },
      { firstPage: 7, pages: 1 },
    ]);
  });

  it('finds the version of a copy from a page code', () => {
    const editions = [{ id: 12, copies: 30, pagesPerCopy: 2, versions: 3 }];
    expect(versionFromCode({ edition: 12, copy: 5, page: 2 }, 2, editions)).toEqual({ kind: 'version', edition: 12, copy: 5, version: 1 });
    expect(versionFromCode({ edition: 12, copy: 5, page: 1 }, 2, editions).kind).toBe('disordered');
    expect(versionFromCode({ edition: 13, copy: 5, page: 2 }, 2, editions).kind).toBe('unknown');
    expect(versionFromCode({ edition: 12, copy: 31, page: 2 }, 2, editions).kind).toBe('unknown');
    expect(versionFromCode(undefined, 1, editions).kind).toBe('unknown');
    expect(versionFromCode({ edition: 12, copy: 5, page: 1 }, 1, [{ id: 12, copies: 30, pagesPerCopy: 2 }])).toMatchObject({ version: 0 });
  });

  /**
   * Cases shared with the alignment worker (`versions.rs` in pdf_to_webp, `tests/fixtures/version-rebuild-cases.json`):
   * both implementations must give the same pixels. Regenerate the file when the algorithm changes, and copy it to
   * the worker.
   */
  describe('cases shared with the Rust worker', () => {
    interface Shared {
      zoneToPixels: { zone: IZone; width: number; height: number; marginPt: number; expected: unknown }[];
      codeBand: { width: number; height: number; expected: unknown }[];
      versionOfCopy: [number, number, number][];
      copySlots: { total: number; pagesPerCopy: number; expected: [number, number][] }[];
      versionFromCode: {
        code: { edition: number; copy: number; page: number } | null;
        page: number;
        editions: { id: number; copies: number; pages_per_copy: number; versions?: number }[];
        expected: { kind: string; version?: number };
      }[];
      rebuild: {
        name: string;
        width: number;
        height: number;
        pages: number;
        template: number;
        paper: number;
        canonical: VersionLayout;
        layout: VersionLayout;
        ink: { page: number; x: number; y: number; w: number; h: number }[];
        probes: { page: number; x: number; y: number; value: number }[];
        issues: unknown[];
      }[];
      finishedDetails: { details: string; expected: unknown };
    }
    const shared = JSON.parse(readFileSync(join(__dirname, 'fixtures/version-rebuild-cases.json'), 'utf8')) as Shared;

    it('converts the zones and the code band', () => {
      for (const c of shared.zoneToPixels) {
        expect(zoneToPixels(c.zone, c.width, c.height, c.marginPt)).toEqual(c.expected);
      }
      for (const c of shared.codeBand) {
        expect(codeBand(c.width, c.height)).toEqual(c.expected);
      }
    });

    it('finds the versions and the copies', () => {
      for (const [copy, k, expected] of shared.versionOfCopy) {
        expect(versionOfCopy(copy, k)).toBe(expected);
      }
      for (const c of shared.copySlots) {
        expect(copySlots(c.total, c.pagesPerCopy).map(s => [s.firstPage, s.pages])).toEqual(c.expected);
      }
      for (const c of shared.versionFromCode) {
        const editions = c.editions.map(e => ({ id: e.id, copies: e.copies, pagesPerCopy: e.pages_per_copy, versions: e.versions }));
        const r = versionFromCode(c.code ?? undefined, c.page, editions);
        expect(r.kind === 'version' ? { kind: r.kind, version: r.version } : { kind: r.kind }).toEqual(c.expected);
      }
    });

    it('reads the bilan of the worker in its finished status', () => {
      expect(parseServerVersions(shared.finishedDetails.details)).toEqual(shared.finishedDetails.expected);
      expect(parseServerVersions('Traitement complet terminé')).toBeUndefined();
      expect(parseServerVersions('{"pagecodes":{}}')).toBeUndefined();
      expect(parseServerVersions('{"versions":{"copies":"x"}}')).toBeUndefined();
      expect(parseServerVersions('{broken')).toBeUndefined();
    });

    it('rebuilds the same pixels', () => {
      for (const c of shared.rebuild) {
        const plain = (level: number): Raster => ({
          width: c.width,
          height: c.height,
          data: new Uint8ClampedArray(c.width * c.height * 4).fill(level),
        });
        const copy = Array.from({ length: c.pages }, () => plain(c.paper));
        for (const ink of c.ink) {
          fill(copy[ink.page - 1], ink, 0);
        }
        const { pages, issues } = rebuildCopy(
          copy,
          Array.from({ length: c.pages }, () => plain(c.template)),
          c.canonical,
          c.layout,
        );
        expect(issues).toEqual(c.issues);
        for (const p of c.probes) {
          expect([c.name, p, at(pages[p.page - 1], p.x, p.y)]).toEqual([c.name, p, p.value]);
        }
      }
    });
  });
});
