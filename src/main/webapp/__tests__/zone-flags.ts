/*
 * Read by zone.js when it loads (setup of the Angular Jest builder, after this file).
 *
 * In the specs run in Node (`@jest-environment node`), EventTarget, MessagePort… are those of the Node process,
 * shared by all the spec files a Jest worker runs: each file loads its own zone.js, which patched them again, and an
 * event delivered to a listener added under another file's zone failed in zone.js with "Cannot read properties of
 * undefined (reading 'false')" (seen at random on the CI, typst-engine.spec.ts). These specs need no zone around DOM
 * events: zone.js leaves EventTarget alone there.
 */
if (typeof window === 'undefined') {
  (globalThis as Record<string, unknown>)['__Zone_disable_EventTarget'] = true;
}
