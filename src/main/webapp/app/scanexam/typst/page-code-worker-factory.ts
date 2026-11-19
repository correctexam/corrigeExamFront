/**
 * Creates the page code worker (T25d2). In its own module, like `typst-worker-factory.ts`: `import.meta` is only
 * understood by the bundler, the unit tests replace this module.
 */
export function createPageCodeWorker(): Worker {
  return new Worker(new URL('../../page-code.worker', import.meta.url), { type: 'module' });
}
