/**
 * @jest-environment node
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PDFDocument } from 'pdf-lib';
import { TypstEngine } from './typst-engine';
import { TypstCompileResponse } from './typst-worker.protocol';
import { assemblePrint, countPages, darkRuns, dataMatrix, pageCode, pageLabel, versionOfCopy } from './print-copies';
import { padForRectoVerso, parseCopyPages, templatePlan } from './exam-from-subject';
import { SUBJECT_STARTER } from '../subject-editor/subject-starter';

const root = join(__dirname, '../../../../../..');
const content = join(root, 'src/main/webapp/content/typst');
const engine = new TypstEngine({
  bytes: path => Promise.resolve(new Uint8Array(readFileSync(join(content, path)))),
  compilerWasm: () =>
    Promise.resolve(
      new Uint8Array(readFileSync(join(root, 'node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm'))),
    ),
});
let id = 0;
const compileTemplate = (source: string, pad: number): Promise<TypstCompileResponse> =>
  engine.compile({
    kind: 'compile',
    id: ++id,
    files: [{ path: '/main.typ', content: source }],
    main: '/main.typ',
    inputs: { 'ce-plan': templatePlan(pad) },
    withPdf: true,
  });

describe('print of an exam written in Typst', () => {
  jest.setTimeout(120000);

  it('encodes the page codes of the contract', () => {
    expect(pageCode(12, 3, 4)).toBe('CE1|12|3|4');
    const rows = dataMatrix(pageCode(12, 3, 4));
    expect(rows.length).toBe(rows[0].length);
    // runs cover exactly the dark modules
    const dark = rows.flat().filter(Boolean).length;
    expect(darkRuns(rows).reduce((n, [, , l]) => n + l, 0)).toBe(dark);
  });

  it('makes a template with an even number of pages and no code, then prints the copies with their codes', async () => {
    const first = await compileTemplate(SUBJECT_STARTER, 0);
    expect(first.ok).toBe(true);
    const pages = parseCopyPages(first.copies)!;
    expect(pages).toBeGreaterThan(0);
    const pad = padForRectoVerso(pages);
    const template = pad > 0 ? await compileTemplate(SUBJECT_STARTER, pad) : first;
    expect(template.zones).toEqual(first.zones);
    const templatePages = await countPages(template.pdf!);
    expect(templatePages % 2).toBe(0);
    expect(templatePages).toBe(pages + pad);

    const progress: number[] = [];
    const pdf = await assemblePrint([template.pdf!], { edition: 12, copies: 3 }, p => progress.push(p.done));
    expect(progress).toEqual([1, 2, 3]);
    const doc = await PDFDocument.load(pdf);
    expect(doc.getPageCount()).toBe(3 * templatePages);
    // the pages of the template are shared: 3 copies cost much less than 3 templates
    expect(pdf.length).toBeLessThan(template.pdf!.length * 2);
    // manual checks (decoding of the codes with zxing-cpp, end-to-end test of the print dialog)
    if (process.env.PRINT_OUT) {
      writeFileSync(process.env.PRINT_OUT, pdf);
      writeFileSync(`${process.env.PRINT_OUT}.template.pdf`, template.pdf!);
    }
  });

  it('takes the versions in turn and labels their pages', () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(c => versionOfCopy(c, 3))).toEqual([0, 1, 2, 0, 1, 2, 0]);
    expect(versionOfCopy(5, 1)).toBe(0);
    expect(pageLabel(3, 2)).toBe('3 · p. 2');
    expect(pageLabel(3, 2, 'B')).toBe('B · 3 · p. 2');
  });

  it('prints each copy from the template of its version', async () => {
    const pdf = async (width: number, pages: number): Promise<Uint8Array> => {
      const doc = await PDFDocument.create();
      for (let i = 0; i < pages; i++) {
        doc.addPage([width, 842]).drawRectangle({ x: 10, y: 10, width: 5, height: 5 });
      }
      return doc.save();
    };
    // the width tells the versions apart in the output
    const out = await PDFDocument.load(
      await assemblePrint([await pdf(595, 2), await pdf(600, 2)], { edition: 5, copies: 3, labels: ['A', 'B'] }),
    );
    expect(out.getPages().map(p => Math.round(p.getWidth()))).toEqual([595, 595, 600, 600, 595, 595]);
    await expect(assemblePrint([await pdf(595, 2), await pdf(595, 4)], { edition: 5, copies: 2 })).rejects.toThrow('different page counts');
    await expect(assemblePrint([], { edition: 5, copies: 2 })).rejects.toThrow('no template');
  });
});
