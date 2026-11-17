/**
 * The wasm-bindgen wrapper of the Typst compiler, imported directly (see `typst-engine.ts`): its declaration file
 * is named `.d.ts` while the module is `.mjs`, so TypeScript does not find it. Only the initialisation function is
 * used, by typst.ts.
 */
declare module '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler.mjs' {
  const init: (input?: unknown) => Promise<unknown>;
  export default init;
}
