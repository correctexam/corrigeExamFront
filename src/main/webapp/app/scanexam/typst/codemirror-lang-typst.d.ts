/**
 * `codemirror-lang-typst/lezer` is declared in the package `exports` only; with `moduleResolution: node` TypeScript
 * looks for `codemirror-lang-typst/lezer.d.ts`. The bundler resolves the real path.
 */
declare module 'codemirror-lang-typst/lezer' {
  export * from 'codemirror-lang-typst/dist/lezer';
}
