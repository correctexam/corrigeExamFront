/*
 * DOM mocks of the jsdom specs. They used to be the global mocks of @angular-builders/jest (`globalMocks`, now empty
 * in angular.json): those ran before every spec and failed in the specs run in Node (`@jest-environment node`:
 * WebAssembly of the Typst compiler, pdf-lib, Blob), which have no `document` nor `window`.
 */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('jest-canvas-mock');
  // jsdom has no `transform` style property (https://github.com/angular/material2/issues/7101)
  Object.defineProperty(document.body.style, 'transform', { value: () => ({ enumerable: true, configurable: true }) });
  Object.defineProperty(document, 'doctype', { value: '<!DOCTYPE html>' });
  Object.defineProperty(window, 'getComputedStyle', { value: () => ({}) });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
jest.mock('../app/scanexam/services/workerimport', () => ({ worker: Promise.resolve(), worker1: Promise.resolve() }));
// Web Workers created with `new URL(…, import.meta.url)`: understood by the bundler only. The services that use them
// are tested with fake workers (their own specs); any other spec that imports them gets no worker.
jest.mock('../app/scanexam/typst/typst-worker-factory', () => ({ createTypstWorker: () => undefined }));
jest.mock('../app/scanexam/typst/page-code-worker-factory', () => ({ createPageCodeWorker: () => undefined }));
jest.mock('../app/scanexam/typst/print-worker-factory', () => ({ createPrintWorker: () => undefined }));
