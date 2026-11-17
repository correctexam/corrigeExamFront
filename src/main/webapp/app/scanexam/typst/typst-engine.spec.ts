/**
 * @jest-environment node
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { TypstEngine } from './typst-engine';
import { TypstCompileResponse } from './typst-worker.protocol';
import { buildLayout, parseZoneMetadata } from './typst-zones';

// Real compiler and real vendored assets: the same files as the ones served to the browser.
const root = join(__dirname, '../../../../../..');
const content = join(root, 'src/main/webapp/content/typst');
const engine = new TypstEngine({
  bytes: path => Promise.resolve(new Uint8Array(readFileSync(join(content, path)))),
  compilerWasm: () =>
    Promise.resolve(
      new Uint8Array(readFileSync(join(root, 'node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm'))),
    ),
});
const example = readFileSync(join(content, 'examples/genie-logiciel.typ'), 'utf8');
let id = 0;
const compile = (source: string, withPdf = false, inputs: Record<string, string> = {}): Promise<TypstCompileResponse> =>
  engine.compile({ kind: 'compile', id: ++id, files: [{ path: '/main.typ', content: source }], main: '/main.typ', inputs, withPdf });

describe('TypstEngine (real compiler)', () => {
  jest.setTimeout(120000);

  it('compiles the example subject offline and gives the same zones as the Typst CLI', async () => {
    const res = await compile(example, true);
    expect(res.diagnostics.filter(d => d.severity === 'error')).toEqual([]);
    expect(res.ok).toBe(true);
    expect(res.pdf!.length).toBeGreaterThan(10000);
    expect(String.fromCharCode(...res.pdf!.slice(0, 5))).toBe('%PDF-');
    const fixture = JSON.parse(readFileSync(join(__dirname, 'fixtures/genie-logiciel.preview.json'), 'utf8')) as unknown;
    expect(parseZoneMetadata(res.zones)).toEqual(parseZoneMetadata(fixture));
    expect(buildLayout(parseZoneMetadata(res.zones)).questions.length).toBe(7);
  });

  it('applies the plan given in the inputs', async () => {
    const plan = { choices: { 'q-patterns': [2, 0, 1, 3] } };
    const res = await compile(example, false, { 'ce-plan': JSON.stringify(plan) });
    const qcm = buildLayout(parseZoneMetadata(res.zones)).questions.find(q => q.key === 'q-patterns')!;
    expect(qcm.parts[0].boxes).toEqual(['c', 'a', 'b', 'd']);
    expect(res.pdf).toBeUndefined();
  });

  it('reports errors with 1-based positions', async () => {
    const res = await compile(
      '#import "@local/correctexam:0.1.0": *\n#show: exam\n#question("q", points: 1)[\n  #answer(height: oops)\n]\n',
    );
    expect(res.ok).toBe(false);
    const error = res.diagnostics.find(d => d.severity === 'error')!;
    expect(error.line).toBe(4);
    expect(error.message).toContain('oops');
  });

  it('never downloads a package: only the vendored allow list resolves', async () => {
    const res = await compile('#import "@preview/touying:0.5.5": *\nHello');
    expect(res.ok).toBe(false);
    expect(res.diagnostics[0].message).toMatch(/package/i);
  });

  it('forgets the files removed from the subject', async () => {
    const withPart = await engine.compile({
      kind: 'compile',
      id: ++id,
      files: [
        { path: '/main.typ', content: '#include "part.typ"' },
        { path: '/part.typ', content: 'Part' },
      ],
      main: '/main.typ',
      inputs: {},
      withPdf: false,
    });
    expect(withPart.ok).toBe(true);
    const without = await compile('#include "part.typ"');
    expect(without.ok).toBe(false);
  });

  it('loads the assets again after a failed start', async () => {
    let calls = 0;
    const flaky = new TypstEngine({
      bytes: path => Promise.resolve(new Uint8Array(readFileSync(join(content, path)))),
      compilerWasm() {
        calls++;
        return calls === 1
          ? Promise.reject(new Error('incomplete download'))
          : Promise.resolve(
              new Uint8Array(
                readFileSync(join(root, 'node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm')),
              ),
            );
      },
    });
    const req = {
      kind: 'compile' as const,
      id: 1,
      files: [{ path: '/main.typ', content: 'Hello' }],
      main: '/main.typ',
      inputs: {},
      withPdf: false,
    };
    await expect(flaky.compile(req)).rejects.toThrow('incomplete download');
    await expect(flaky.compile(req)).resolves.toEqual(expect.objectContaining({ ok: true }));
  });
});
