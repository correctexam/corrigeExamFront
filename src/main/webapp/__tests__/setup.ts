import 'jest-canvas-mock';
jest.mock('../app/scanexam/services/workerimport', () => ({ worker: Promise.resolve(), worker1: Promise.resolve() }));
// Web Workers created with `new URL(…, import.meta.url)`: understood by the bundler only. The services that use them
// are tested with fake workers (their own specs); any other spec that imports them gets no worker.
jest.mock('../app/scanexam/typst/typst-worker-factory', () => ({ createTypstWorker: () => undefined }));
jest.mock('../app/scanexam/typst/page-code-worker-factory', () => ({ createPageCodeWorker: () => undefined }));
jest.mock('../app/scanexam/typst/print-worker-factory', () => ({ createPrintWorker: () => undefined }));
