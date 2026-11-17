/**
 * Creates the print worker (T25d). In its own module, like `typst-worker-factory.ts`: `import.meta` is only
 * understood by the bundler, the unit tests replace this module.
 */
export function createPrintWorker(): Worker {
  return new Worker(new URL('../../print.worker', import.meta.url), { type: 'module' });
}
