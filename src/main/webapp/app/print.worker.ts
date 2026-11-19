/* eslint-disable spaced-comment */
/// <reference lib="webworker" />

/**
 * Assembles the print PDF of an exam written in Typst (T25d, ADR 0004) off the UI thread: several hundred pages,
 * each stamped with its code. Messages: `scanexam/typst/print-worker.protocol.ts`.
 */

import { assemblePrint } from './scanexam/typst/print-copies';
import { PrintWorkerRequest, PrintWorkerResponse } from './scanexam/typst/print-worker.protocol';

addEventListener('message', ({ data }: MessageEvent<PrintWorkerRequest>) => {
  assemblePrint(data.templates, { edition: data.edition, copies: data.copies, labels: data.labels }, p => {
    const progress: PrintWorkerResponse = { kind: 'progress', id: data.id, done: p.done, total: p.total };
    postMessage(progress);
  })
    .then(pdf => {
      const message: PrintWorkerResponse = { kind: 'printed', id: data.id, pdf };
      // the PDF buffer is transferred, not copied
      postMessage(message, [pdf.buffer]);
    })
    .catch((e: unknown) => {
      const message: PrintWorkerResponse = { kind: 'failure', id: data.id, message: e instanceof Error ? e.message : String(e) };
      postMessage(message);
    });
});
