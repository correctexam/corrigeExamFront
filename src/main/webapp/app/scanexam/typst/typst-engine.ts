/**
 * Typst compiler of the platform (T25b, ADR 0004), run in `typst.worker.ts`.
 *
 * - Offline: fonts and packages are vendored assets (`content/typst/`); a package that is not in the allow list
 *   is not found, nothing is ever downloaded during a compilation.
 * - One compilation gives the PDF, the diagnostics, the `<ce-zone>` metadata and the `<ce-diagram>` requests of the
 *   same document; images of the subject are mapped as binary files (T25c).
 * Independent from the worker so that it can be tested with the real compiler (Node).
 */

import { createTypstCompiler, type TypstCompiler } from '@myriaddreamin/typst.ts/dist/esm/compiler.mjs';
import {
  disableDefaultFontAssets,
  loadFonts,
  withAccessModel,
  withPackageRegistry,
} from '@myriaddreamin/typst.ts/dist/esm/options.init.mjs';
import { MemoryAccessModel } from '@myriaddreamin/typst.ts/dist/esm/fs/memory.mjs';
import type { PackageResolveContext, PackageSpec } from '@myriaddreamin/typst.ts/dist/esm/internal.types.mjs';
// static import: typst.ts would otherwise load the wrapper with a dynamic import of the package (Node shim)
import * as webCompiler from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler.mjs';

import {
  RawTypstDiagnostic,
  toTypstDiagnostic,
  TypstCompileRequest,
  TypstCompileResponse,
  TypstDiagnostic,
  VendoredPackageIndex,
} from './typst-worker.protocol';

/** Reads the vendored assets (relative to `content/typst/`). */
export interface TypstAssets {
  bytes(path: string): Promise<Uint8Array>;
  /** The compiler (`@myriaddreamin/typst-ts-web-compiler`, `typst_ts_web_compiler_bg.wasm`). */
  compilerWasm(): Promise<Uint8Array>;
}

/** Files of the platform package, served from `content/typst/correctexam/<version>/`. */
export const CORRECTEXAM_PACKAGE = { name: 'correctexam', version: '0.1.0', files: ['typst.toml', 'lib.typ'] };

const LOCAL_ROOT = '/@memory/packages/local';
const PREVIEW_ROOT = '/@memory/packages/preview';

export class TypstEngine {
  private compiler?: TypstCompiler;
  private initializing?: Promise<TypstCompiler>;
  private readonly am = new MemoryAccessModel();
  /** Vendored archives, `name:version` → `.tar.gz`. */
  private readonly archives = new Map<string, Uint8Array>();
  private readonly extracted = new Map<string, string>();
  private previousFiles: string[] = [];
  private previousBinaries = new Map<string, string>();

  constructor(private readonly assets: TypstAssets) {}

  /** Loads the compiler, the fonts and the packages once; later calls return the same compiler. */
  init(): Promise<TypstCompiler> {
    this.initializing ??= this.load().then(
      c => (this.compiler = c),
      (e: unknown) => {
        // a failed load (network, incomplete asset) is tried again by the next compilation
        this.initializing = undefined;
        throw e;
      },
    );
    return this.initializing;
  }

  async compile(req: TypstCompileRequest): Promise<TypstCompileResponse> {
    const compiler = await this.init();
    const start = Date.now();
    // files removed from the subject must not stay visible
    for (const path of this.previousFiles) {
      if (!req.files.some(f => f.path === path)) {
        compiler.unmapShadow(path);
      }
    }
    for (const f of req.files) {
      compiler.addSource(f.path, f.content);
    }
    this.previousFiles = req.files.map(f => f.path);
    const binaries = new Map<string, string>();
    for (const b of req.binaries ?? []) {
      // same content as for the previous compilation: not copied into the compiler again
      if (this.previousBinaries.get(b.path) !== b.key) {
        compiler.mapShadow(b.path, b.data);
      }
      binaries.set(b.path, b.key);
    }
    for (const path of this.previousBinaries.keys()) {
      if (!binaries.has(path) && !req.files.some(f => f.path === path)) {
        compiler.unmapShadow(path);
      }
    }
    this.previousBinaries = binaries;

    return compiler.runWithWorld({ mainFilePath: req.main, inputs: req.inputs }, async world => {
      const compiled = await world.compile({ diagnostics: 'full' });
      const diagnostics: TypstDiagnostic[] = ((compiled.diagnostics ?? []) as RawTypstDiagnostic[]).map(toTypstDiagnostic);
      if (diagnostics.some(d => d.severity === 'error')) {
        return { kind: 'compiled', id: req.id, ok: false, diagnostics, durationMs: Date.now() - start };
      }
      const zones: unknown = await world.query({ selector: '<ce-zone>', field: 'value' });
      const diagrams: unknown = await world.query({ selector: '<ce-diagram>', field: 'value' });
      const pdf = req.withPdf ? (await world.pdf({ diagnostics: 'full' })).result : undefined;
      return { kind: 'compiled', id: req.id, ok: true, diagnostics, pdf, zones, diagrams, durationMs: Date.now() - start };
    });
  }

  private async load(): Promise<TypstCompiler> {
    const decoder = new TextDecoder();
    const fontIndex = JSON.parse(decoder.decode(await this.assets.bytes('fonts/index.json'))) as { fonts: string[] };
    const packageIndex = JSON.parse(decoder.decode(await this.assets.bytes('packages/preview/index.json'))) as VendoredPackageIndex;

    const [fonts, archives, local, wasm] = await Promise.all([
      Promise.all(fontIndex.fonts.map(f => this.assets.bytes(`fonts/${f}`))),
      Promise.all(
        packageIndex.packages.map(async p => [`${p.name}:${p.version}`, await this.assets.bytes(`packages/preview/${p.file}`)] as const),
      ),
      Promise.all(
        CORRECTEXAM_PACKAGE.files.map(
          async f => [f, await this.assets.bytes(`${CORRECTEXAM_PACKAGE.name}/${CORRECTEXAM_PACKAGE.version}/${f}`)] as const,
        ),
      ),
      this.assets.compilerWasm(),
    ]);
    for (const [spec, data] of archives) {
      this.archives.set(spec, data);
    }
    const localDir = `${LOCAL_ROOT}/${CORRECTEXAM_PACKAGE.name}/${CORRECTEXAM_PACKAGE.version}`;
    for (const [file, data] of local) {
      this.am.insertFile(`${localDir}/${file}`, data, new Date(0));
    }

    const registry = {
      resolve: (spec: PackageSpec, context: PackageResolveContext): string | undefined => this.resolve(spec, context, localDir),
    };
    const compiler = createTypstCompiler();
    await compiler.init({
      getWrapper: () => Promise.resolve(webCompiler),
      getModule: () => wasm,
      beforeBuild: [disableDefaultFontAssets(), loadFonts(fonts), withAccessModel(this.am), withPackageRegistry(registry)],
    });
    return compiler;
  }

  /** Allow list: the platform package and the vendored `@preview` packages, nothing else. */
  private resolve(spec: PackageSpec, context: PackageResolveContext, localDir: string): string | undefined {
    if (spec.namespace === 'local' && spec.name === CORRECTEXAM_PACKAGE.name && spec.version === CORRECTEXAM_PACKAGE.version) {
      return localDir;
    }
    if (spec.namespace !== 'preview') {
      return undefined;
    }
    const key = `${spec.name}:${spec.version}`;
    const done = this.extracted.get(key);
    if (done !== undefined) {
      return done;
    }
    const data = this.archives.get(key);
    if (data === undefined) {
      return undefined;
    }
    const dir = `${PREVIEW_ROOT}/${spec.name}/${spec.version}`;
    context.untar(data, (path, content, mtime) => this.am.insertFile(`${dir}/${path.replace(/^\.\//, '')}`, content, new Date(mtime)));
    this.extracted.set(key, dir);
    return dir;
  }
}
