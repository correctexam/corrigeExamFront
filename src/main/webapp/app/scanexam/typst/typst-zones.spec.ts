/**
 * @jest-environment node
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  boundingRect,
  buildLayout,
  parseZoneMetadata,
  toCanonicalAnswer,
  toLatexCompatibleProperties,
  toZone,
  TypstZoneError,
  ZONE_SCALE,
} from './typst-zones';

// Output of `typst eval 'query(<ce-zone>).map(m => (value: m.value))'` on
// `content/typst/examples/genie-logiciel.typ`, without plan (preview) and for version B.
const fixture = (name: string): unknown => JSON.parse(readFileSync(join(__dirname, 'fixtures', name), 'utf8'));
const preview = parseZoneMetadata(fixture('genie-logiciel.preview.json'));
const versionB = parseZoneMetadata(fixture('genie-logiciel.version-b.json'));

describe('typst-zones', () => {
  describe('parseZoneMetadata', () => {
    it('accepts the query elements and the bare values', () => {
      expect(preview.length).toBe(41);
      expect(parseZoneMetadata(preview)).toEqual(preview);
    });

    it('rejects an unknown format or kind', () => {
      const value = { ...preview[0] } as Record<string, unknown>;
      expect(() => parseZoneMetadata([{ ...value, format: 2 }])).toThrow(TypstZoneError);
      expect(() => parseZoneMetadata([{ ...value, kind: 'mystery' }])).toThrow(TypstZoneError);
      expect(() => parseZoneMetadata([{ ...value, x: 'left' }])).toThrow(TypstZoneError);
      expect(() => parseZoneMetadata({})).toThrow(TypstZoneError);
    });
  });

  describe('toZone', () => {
    it('expresses a rectangle in 1/100000 of the page', () => {
      const z = toZone({ page: 2, x: 59.5, y: 84.2, w: 297.6, h: 42.1, pageWidth: 595.2, pageHeight: 841.9 });
      expect(z).toEqual({ pageNumber: 2, xInit: 9996, yInit: 10001, width: 50000, height: 5001 });
    });

    it('keeps an enlarged bounding box inside the page', () => {
      const r = boundingRect([{ page: 1, x: 1, y: 1, w: 10, h: 10, pageWidth: 100, pageHeight: 100 }], 10);
      expect(r.x).toBe(0);
      expect(r.y).toBe(0);
    });
  });

  describe('buildLayout (preview, source order)', () => {
    const layout = buildLayout(preview);

    it('reads the way names are written (cells by default)', () => {
      expect(layout.identityStyle).toBe('cells');
      const free = preview.map(m => (m.kind === 'identity' && m.role !== 'stdid' ? { ...m, style: 'free' as const } : m));
      expect(buildLayout(free).identityStyle).toBe('free');
      // the student number is always in cells: it does not decide the style
      const idOnly = preview.map(m => (m.kind === 'identity' && m.role === 'stdid' ? { ...m, style: 'free' as const } : m));
      expect(buildLayout(idOnly).identityStyle).toBe('cells');
    });

    it('finds the three identity zones', () => {
      expect(Object.keys(layout.identity).sort()).toEqual(['firstname', 'lastname', 'stdid']);
      const name = layout.identity.lastname!;
      expect(name.pageNumber).toBe(1);
      expect(name.xInit!).toBeGreaterThan(0);
      expect(name.xInit! + name.width!).toBeLessThanOrEqual(ZONE_SCALE);
    });

    it('lists the questions with their canonical numbers and one zone per part', () => {
      expect(layout.questions.map(q => [q.key, q.number, q.kind, q.parts.length])).toEqual([
        ['q-classes', 1, 'manual', 1],
        ['q-sequence', 2, 'manual', 1],
        ['q-code', 3, 'manual', 1],
        ['q-patterns', 4, 'qcm', 1],
        ['q-temps', 5, 'numeric', 1],
        ['q-nb-classes', 6, 'numeric', 1],
        ['q-pont', 7, 'short', 1],
      ]);
    });

    it('keeps the MCQ grading and the canonical boxes', () => {
      const qcm = layout.questions.find(q => q.key === 'q-patterns')!;
      expect(qcm.validExpression).toBe('a&c=100;a+=50;*=-25');
      expect(qcm.meta.correct).toBe('a&c');
      expect(qcm.parts[0].boxes).toEqual(['a', 'b', 'c', 'd']);
    });

    it('describes a numeric grid box by box, in the order of the detection', () => {
      const grid = layout.questions.find(q => q.key === 'q-nb-classes')!.parts[0];
      expect(grid.boxes!.length).toBe(20);
      expect(grid.boxes!.slice(0, 4)).toEqual(['0:0', '1:0', '0:1', '1:1']);
      const cells = layout.questions.find(q => q.key === 'q-temps')!.parts[0];
      expect(cells.cells!.length).toBe(3);
    });
  });

  describe('buildLayout (version B: shuffled section and choices)', () => {
    const layout = buildLayout(versionB);

    it('keeps the canonical numbers while the printed numbers follow the version', () => {
      const printed = layout.questions.map(q => `${q.number}->${q.displayed}`);
      expect(printed).toEqual(['1->1', '2->2', '5->3', '6->4', '3->5', '4->6', '7->7']);
      expect(layout.copy).toBe('c001');
    });

    it('maps the boxes of the version to the canonical letters', () => {
      const qcm = layout.questions.find(q => q.key === 'q-patterns')!;
      // plan: displayed order = canonical c, a, b, d
      expect(qcm.parts[0].boxes).toEqual(['c', 'a', 'b', 'd']);
      // the detection reads the 1st and 3rd boxes (`a&c` on the sheet): canonical answer b&c
      expect(toCanonicalAnswer('a&c', qcm.parts[0].boxes!)).toBe('b&c');
      expect(toCanonicalAnswer('', qcm.parts[0].boxes!)).toBe('');
      expect(() => toCanonicalAnswer('e', qcm.parts[0].boxes!)).toThrow(TypstZoneError);
    });

    it('places the zones of a version where the version prints them', () => {
      const a = buildLayout(preview).questions.find(q => q.key === 'q-patterns')!.parts[0].zone;
      const b = layout.questions.find(q => q.key === 'q-patterns')!.parts[0].zone;
      expect(b.pageNumber).not.toBe(a.pageNumber);
    });
  });

  describe('consistency checks', () => {
    it('rejects a question number used twice', () => {
      const copy = preview.map(m => (m.kind === 'question' && m.key === 'q-pont' ? { ...m, number: 1 } : m));
      expect(() => buildLayout(copy)).toThrow('question number 1 used twice');
    });

    it('rejects a question without zone', () => {
      const copy = preview.filter(m => !(m.kind !== 'question' && m.question === 'q-pont'));
      expect(() => buildLayout(copy)).toThrow('question q-pont has no answer zone');
    });
  });

  describe('toLatexCompatibleProperties', () => {
    it('writes the properties read by the current template flow', () => {
      const props = toLatexCompatibleProperties(buildLayout(preview));
      expect(Object.keys(props)).toContain('correctexam-lastname');
      expect(Object.keys(props)).toContain('correctexam-stdid');
      expect(Object.keys(props)).toContain('correctexam-answer-4-1');
      const qcm = JSON.parse(props['correctexam-answer-4-1']) as { x: number; y: number; h: number; p: number; t: string };
      expect(qcm.t).toBe('qcm');
      expect(qcm.p).toBe(2);
      // bottom edge, from the top of the page, in cm
      expect(qcm.y).toBeGreaterThan(qcm.h);
    });
  });
});
