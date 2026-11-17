/**
 * Creates the Typst worker (T25b). In its own module, like `services/workerimport.ts`: `import.meta` is only
 * understood by the bundler, the unit tests replace this module.
 */
export function createTypstWorker(): Worker {
  return new Worker(new URL('../../typst.worker', import.meta.url), { type: 'module' });
}
