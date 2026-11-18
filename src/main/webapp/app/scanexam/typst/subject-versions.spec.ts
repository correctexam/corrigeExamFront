/**
 * @jest-environment node
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { TypstEngine } from './typst-engine';
import { buildVersions, canVary, planVersions, seededRandom, VersionStructure } from './subject-versions';
import { buildLayout, parseZoneMetadata } from './typst-zones';
import { countPages } from './print-copies';

const structure: VersionStructure = {
  sections: [{ key: 's1', items: 4 }],
  qcms: [{ key: 'q-qcm', choices: 5, fixed: [4] }],
  variants: [{ key: 'v1', count: 2 }],
};

describe('plans of the versions of a subject', () => {
  it('keeps version A as written', () => {
    const [a] = planVersions(structure, 3, 42);
    expect(a).toEqual({ index: 0, label: 'A', order: { s1: [0, 1, 2, 3] }, choices: { 'q-qcm': [0, 1, 2, 3, 4] }, variants: { v1: 0 } });
  });

  it('draws the same versions with the same seed, other versions with another seed', () => {
    expect(planVersions(structure, 4, 42)).toEqual(planVersions(structure, 4, 42));
    expect(planVersions(structure, 4, 42)).not.toEqual(planVersions(structure, 4, 43));
  });

  it('mixes the choices but keeps the fixed ones in place, alternates the wordings', () => {
    for (const p of planVersions(structure, 6, 7)) {
      expect([...p.choices['q-qcm']].sort()).toEqual([0, 1, 2, 3, 4]);
      expect(p.choices['q-qcm'][4]).toBe(4);
      expect([...p.order.s1].sort()).toEqual([0, 1, 2, 3]);
      expect(p.variants.v1).toBe(p.index % 2);
    }
  });

  it('gives different versions when the subject allows it', () => {
    const plans = planVersions(structure, 6, 1);
    expect(new Set(plans.map(p => JSON.stringify([p.order, p.choices]))).size).toBe(6);
  });

  it('knows when nothing can vary', () => {
    expect(canVary({ sections: [], qcms: [{ key: 'q', choices: 2, fixed: [1] }], variants: [] })).toBe(false);
    expect(canVary(structure)).toBe(true);
    expect(() => planVersions(structure, 7, 1)).toThrow();
  });

  it('draws numbers in [0, 1)', () => {
    const r = seededRandom(5);
    const xs = Array.from({ length: 1000 }, () => r());
    expect(xs.every(x => x >= 0 && x < 1)).toBe(true);
  });
});

// Real compiler: the versions of a subject that mixes questions of different heights, an MCQ with a fixed choice
// and a statement with two wordings of different lengths.
const root = join(__dirname, '../../../../../..');
const content = join(root, 'src/main/webapp/content/typst');
const engine = new TypstEngine({
  bytes: path => Promise.resolve(new Uint8Array(readFileSync(join(content, path)))),
  compilerWasm: () =>
    Promise.resolve(
      new Uint8Array(readFileSync(join(root, 'node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm'))),
    ),
});
const SUBJECT = `#import "@local/correctexam:0.1.0": *
#show: exam.with(title: "Versions")
#section("s1", shuffle: true,
  question("q-court", points: 1)[#variant("v1", [Calculer $2 + 3$.], [Calculer $7 + 8$, puis expliquer la démarche en une phrase complète, avec un exemple.]) #answer(height: 2cm)],
  question("q-long", points: 2)[Question longue. #answer(height: 9cm, style: "lines")],
  qcm("q-qcm", points: 1, [Choisir.], ok[Alpha], ko[Beta], ko[Gamma], fixed(ko[Aucune])),
  question("q-moyen", points: 1)[Question moyenne. #answer(height: 6cm)],
)
`;
let id = 0;
const compileWith = (source: string) => (cePlan: Record<string, unknown>) =>
  engine.compile({
    kind: 'compile',
    id: ++id,
    files: [{ path: '/main.typ', content: source }],
    main: '/main.typ',
    inputs: { 'ce-plan': JSON.stringify(cePlan) },
    withPdf: true,
  });

describe('versions compiled by the real compiler', () => {
  jest.setTimeout(120000);

  it('compiles compatible versions with the same even number of pages', async () => {
    const built = await buildVersions(compileWith(SUBJECT), 3, 2026);
    expect(built.diagnostics).toBeUndefined();
    expect(built.issues).toEqual([]);
    expect(built.versions.map(v => v.plan.label)).toEqual(['A', 'B', 'C']);
    const pages = built.versions[0].layout.pages;
    expect(pages % 2).toBe(0);
    for (const v of built.versions) {
      expect(v.layout.pages).toBe(pages);
      expect(await countPages(v.pdf)).toBe(pages);
      expect(v.layout.parts.map(p => `${p.key}#${p.part}`).sort()).toEqual(['q-court#1', 'q-long#1', 'q-moyen#1', 'q-qcm#1']);
      expect(
        v.layout.boxes
          .filter(b => b.key === 'q-qcm')
          .map(b => b.letter)
          .sort(),
      ).toEqual(['a', 'b', 'c', 'd']);
    }
    // the versions really differ: positions of the zones and of the MCQ boxes
    const pos = (i: number): string => JSON.stringify(built.versions[i].layout.parts.map(p => [p.key, p.zone.pageNumber, p.zone.yInit]));
    expect(pos(1)).not.toEqual(pos(0));
    // the fixed choice stays the last box of the MCQ in every version
    for (const v of built.versions) {
      const boxes = v.layout.boxes.filter(b => b.key === 'q-qcm');
      const lowest = boxes.reduce((m, b) => (b.zone.pageNumber! * 1e6 + b.zone.yInit! > m.zone.pageNumber! * 1e6 + m.zone.yInit! ? b : m));
      expect(lowest.letter).toBe('d');
    }
  });

  it('gives version A the zones of the exam created from the subject', async () => {
    const built = await buildVersions(compileWith(SUBJECT), 2, 1);
    const res = await compileWith(SUBJECT)({ stamp: true, pad: built.versions[0].layout.pages - built.versions[0].pages });
    const exam = buildLayout(parseZoneMetadata(res.zones));
    expect(built.versions[0].layout.parts).toEqual(
      exam.questions.flatMap(q => q.parts.map(p => ({ key: q.key, part: p.part, zone: p.zone }))),
    );
  });

  it('refuses versions whose zones differ in size', async () => {
    const bad = SUBJECT.replace(
      'question("q-moyen", points: 1)[Question moyenne. #answer(height: 6cm)]',
      'question("q-moyen", points: 1)[#variant("v2", [Court. #answer(height: 3cm)], [Long. #answer(height: 5cm)])]',
    );
    const built = await buildVersions(compileWith(bad), 2, 3);
    expect(built.issues).toContainEqual({ version: 'B', key: 'zoneSize', params: { question: 'q-moyen', part: '1' } });
  });

  it('says when nothing can vary', async () => {
    const fixedSubject = '#import "@local/correctexam:0.1.0": *\n#show: exam\n#question("q", points: 1)[A. #answer(height: 2cm)]\n';
    const built = await buildVersions(compileWith(fixedSubject), 2, 1);
    expect(built.issues).toEqual([{ version: 'A', key: 'nothingVaries' }]);
    // one version: nothing to vary is fine
    expect((await buildVersions(compileWith(fixedSubject), 1, 1)).issues).toEqual([]);
  });
});
