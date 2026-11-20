/* eslint-disable spaced-comment */
/// <reference lib="webworker" />

/**
 * Compiles Typst subjects off the UI thread (T25b, ADR 0004). Messages: `scanexam/typst/typst-worker.protocol.ts`.
 * Assets are loaded on the first compilation only (compiler ~28 Mo, fonts ~6 Mo, packages ~2,5 Mo), from
 * `content/typst/` (the compiler possibly from a CDN, see `compilerWasmUrl`); they are cached by the browser and
 * the service worker.
 */

import { compilerWasmUrl, fetchAsset, FetchFn } from './scanexam/typst/typst-assets';
import { TypstEngine } from './scanexam/typst/typst-engine';
import { TypstWorkerRequest, TypstWorkerResponse } from './scanexam/typst/typst-worker.protocol';

const base = new URL('content/typst/', self.location.href);

const fetchFn: FetchFn = (input, init) => fetch(input, init);

const engine = new TypstEngine({
  bytes: path => fetchAsset(fetchFn, new URL(path, base)),
  // the application's copy, or a CDN when the deployment cannot serve it (compiler.json)
  compilerWasm: async () => fetchAsset(fetchFn, await compilerWasmUrl(fetchFn, base), true),
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
