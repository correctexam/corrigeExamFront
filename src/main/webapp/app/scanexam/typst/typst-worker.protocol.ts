/**
 * Messages exchanged with `typst.worker.ts` (T25b, ADR 0004). The worker compiles a Typst subject with the
 * vendored packages only, and returns the PDF, the diagnostics, the `<ce-zone>` metadata and the diagrams to render
 * (`<ce-diagram>`, T25c).
 * Pure module: shared by the worker and the Angular service.
 */

/** A text file of the subject (`main.typ`, other `.typ` files, code files…), path absolute from the root. */
export interface TypstSourceFile {
  path: string;
  content: string;
}

/** A binary file of the subject (image), path absolute from the root (T25c). */
export interface TypstBinaryFile {
  path: string;
  /** Identity of the content (SHA-256): the worker maps the file again only when it changes. */
  key: string;
  data: Uint8Array;
}

export interface TypstCompileRequest {
  kind: 'compile';
  id: number;
  files: TypstSourceFile[];
  /** Images and other binary files of the subject (T25c); absent = none. */
  binaries?: TypstBinaryFile[];
  /** Path of the main file, e.g. `/main.typ`. */
  main: string;
  /** `sys.inputs` (e.g. `ce-plan`). */
  inputs: Record<string, string>;
  /** False for a check without PDF export (zones and diagnostics only). */
  withPdf: boolean;
}

export type TypstWorkerRequest = TypstCompileRequest;

export type TypstSeverity = 'error' | 'warning';

export interface TypstDiagnostic {
  severity: TypstSeverity;
  message: string;
  /** File of the subject, or `@preview/name:version/…` for a package. */
  path: string;
  /** 1-based, absent when Typst gives no position. */
  line?: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  hints: string[];
}

export interface TypstCompileResponse {
  kind: 'compiled';
  id: number;
  /** True when the document compiled (warnings allowed). */
  ok: boolean;
  diagnostics: TypstDiagnostic[];
  pdf?: Uint8Array;
  /** Raw result of `query(<ce-zone>)`, read with `parseZoneMetadata`. */
  zones?: unknown;
  /** Raw result of `query(<ce-diagram>)` (T25c), read with `parseDiagramRequests`. */
  diagrams?: unknown;
  durationMs: number;
}

/** The worker could not compile at all (assets not loaded, internal error of the compiler). */
export interface TypstFailureResponse {
  kind: 'failure';
  id: number;
  message: string;
}

export type TypstWorkerResponse = TypstCompileResponse | TypstFailureResponse;

/** Diagnostic as returned by typst.ts (`diagnostics: 'full'`): range `line:col-line:col`, 0-based. */
export interface RawTypstDiagnostic {
  package?: string;
  path?: string;
  range?: string;
  severity?: string;
  message?: string;
  hints?: string[];
}

/** Converts a typst.ts diagnostic into a typed one, with 1-based positions. */
export function toTypstDiagnostic(raw: RawTypstDiagnostic): TypstDiagnostic {
  const d: TypstDiagnostic = {
    severity: raw.severity === 'warning' ? 'warning' : 'error',
    message: raw.message ?? 'unknown error',
    path: raw.package ? `${raw.package}${raw.path ?? ''}` : (raw.path ?? ''),
    hints: Array.isArray(raw.hints) ? raw.hints.map(String) : [],
  };
  const m = /^(\d+):(\d+)-(\d+):(\d+)$/.exec(raw.range ?? '');
  if (m) {
    d.line = Number(m[1]) + 1;
    d.column = Number(m[2]) + 1;
    d.endLine = Number(m[3]) + 1;
    d.endColumn = Number(m[4]) + 1;
  }
  return d;
}

/** Packages that a compilation may use: the vendored allow list (`content/typst/packages/preview/index.json`). */
export interface VendoredPackageIndex {
  namespace: 'preview';
  allowed: string[];
  packages: { name: string; version: string; file: string; bytes: number; dependencies: string[] }[];
}
