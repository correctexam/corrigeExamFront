/* eslint-disable spaced-comment */
/// <reference lib="webworker" />

/**
 * Compiles Typst subjects off the UI thread (T25b, ADR 0004). Messages: `scanexam/typst/typst-worker.protocol.ts`.
 * Assets are loaded on the first compilation only (compiler ~28 Mo, fonts ~6 Mo, packages ~2,5 Mo), from
 * `content/typst/`; they are cached by the browser and the service worker.
 */

import { TypstEngine } from './scanexam/typst/typst-engine';
import { TypstWorkerRequest, TypstWorkerResponse } from './scanexam/typst/typst-worker.protocol';

const base = new URL('content/typst/', self.location.href);

async function fetchBytes(url: URL): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${url.pathname}: HTTP ${res.status}`);
  }
  return new Uint8Array(await res.arrayBuffer());
}

const engine = new TypstEngine({
  bytes: path => fetchBytes(new URL(path, base)),
  compilerWasm: () => fetchBytes(new URL('wasm/typst_ts_web_compiler_bg.wasm', base)),
});

addEventListener('message', ({ data }: MessageEvent<TypstWorkerRequest>) => {
  engine
    .compile(data)
    .then(res => {
      const message: TypstWorkerResponse = res;
      // the PDF buffer is transferred, not copied
      postMessage(message, res.pdf ? [res.pdf.buffer] : []);
    })
    .catch((e: unknown) => {
      const message: TypstWorkerResponse = { kind: 'failure', id: data.id, message: e instanceof Error ? e.message : String(e) };
      postMessage(message);
    });
});
