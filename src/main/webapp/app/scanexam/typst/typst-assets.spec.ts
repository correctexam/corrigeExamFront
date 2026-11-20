/**
 * @jest-environment node
 */
import { compilerWasmUrl, fetchAsset, FetchFn, TypstAssetError } from './typst-assets';

const url = new URL('http://localhost/content/typst/wasm/typst_ts_web_compiler_bg.wasm');
const wasm = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 1, 0, 0, 0, 9, 9]);

/** Answers with the given bodies in turn; `length` overrides the announced Content-Length. */
function server(bodies: { body: Uint8Array; length?: number; status?: number; encoding?: string }[]): {
  fetchFn: FetchFn;
  caches: RequestCache[];
} {
  const caches: RequestCache[] = [];
  let i = 0;
  const fetchFn: FetchFn = (_input, init) => {
    caches.push(init?.cache ?? 'default');
    const r = bodies[Math.min(i++, bodies.length - 1)];
    const headers: Record<string, string> = { 'content-length': String(r.length ?? r.body.length) };
    if (r.encoding) {
      headers['content-encoding'] = r.encoding;
    }
    return Promise.resolve(new Response(r.body, { status: r.status ?? 200, headers }));
  };
  return { fetchFn, caches };
}

describe('fetchAsset', () => {
  it('returns a complete download', async () => {
    const s = server([{ body: wasm }]);
    await expect(fetchAsset(s.fetchFn, url, true)).resolves.toEqual(wasm);
    expect(s.caches).toEqual(['default']);
  });

  it('downloads again, bypassing the cache, when the body is shorter than announced', async () => {
    const s = server([{ body: wasm.slice(0, 6), length: wasm.length }, { body: wasm }]);
    await expect(fetchAsset(s.fetchFn, url, true)).resolves.toEqual(wasm);
    expect(s.caches).toEqual(['default', 'reload']);
  });

  it('fails with an explicit message when the download stays incomplete', async () => {
    const s = server([{ body: wasm.slice(0, 6), length: wasm.length }]);
    await expect(fetchAsset(s.fetchFn, url, true)).rejects.toThrow(/incomplete download \(6 bytes received, 10 expected\)/);
  });

  it('checks the WebAssembly header when the length is unknown (compressed response)', async () => {
    const s = server([{ body: new Uint8Array([1, 2, 3, 4]), encoding: 'gzip' }]);
    await expect(fetchAsset(s.fetchFn, url, true)).rejects.toBeInstanceOf(TypstAssetError);
    const ok = server([{ body: wasm, length: 3, encoding: 'gzip' }]);
    await expect(fetchAsset(ok.fetchFn, url, true)).resolves.toEqual(wasm);
  });

  it('reports an HTTP error', async () => {
    const s = server([{ body: new Uint8Array(), status: 404 }]);
    await expect(fetchAsset(s.fetchFn, url)).rejects.toThrow('HTTP 404');
  });
});

describe('compilerWasmUrl', () => {
  const base = new URL('https://correctexam.pages.dev/content/typst/');
  const local = 'https://correctexam.pages.dev/content/typst/wasm/typst_ts_web_compiler_bg.wasm';
  const cdn = 'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler@0.7.0/pkg/typst_ts_web_compiler_bg.wasm';
  const answering =
    (body: string, status = 200): FetchFn =>
    input => {
      expect(input.href).toBe('https://correctexam.pages.dev/content/typst/compiler.json');
      return Promise.resolve(new Response(body, { status }));
    };

  it('takes the copy of the application by default', async () => {
    expect((await compilerWasmUrl(answering('{"wasm": "wasm/typst_ts_web_compiler_bg.wasm"}'), base)).href).toBe(local);
  });

  it('takes the CDN given by the deployment', async () => {
    expect((await compilerWasmUrl(answering(JSON.stringify({ wasm: cdn })), base)).href).toBe(cdn);
  });

  it('falls back to the copy of the application when the file is missing, broken or unsafe', async () => {
    expect((await compilerWasmUrl(answering('', 404), base)).href).toBe(local);
    expect((await compilerWasmUrl(answering('{broken'), base)).href).toBe(local);
    expect((await compilerWasmUrl(answering('{"wasm": 3}'), base)).href).toBe(local);
    expect((await compilerWasmUrl(answering('{"wasm": "http://cdn.example/x.wasm"}'), base)).href).toBe(local);
    expect((await compilerWasmUrl(() => Promise.reject(new Error('offline')), base)).href).toBe(local);
  });
});
