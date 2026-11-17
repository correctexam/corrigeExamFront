import { Injectable, OnDestroy, signal } from '@angular/core';
import { createTypstWorker } from './typst-worker-factory';
import { TypstBinaryFile, TypstCompileRequest, TypstCompileResponse, TypstSourceFile, TypstWorkerResponse } from './typst-worker.protocol';

export type TypstCompilerState = 'idle' | 'loading' | 'ready' | 'failed';

export interface TypstCompileOptions {
  main?: string;
  inputs?: Record<string, string>;
  withPdf?: boolean;
  /** Images of the subject (T25c). */
  binaries?: TypstBinaryFile[];
}

/**
 * Front door of `typst.worker.ts` (T25b). The worker is created on the first compilation only: the compiler
 * and its assets are never loaded for users who do not write subjects.
 */
@Injectable({ providedIn: 'root' })
export class TypstCompilerService implements OnDestroy {
  /** `loading` until the first compilation answers (assets are downloaded then). */
  readonly state = signal<TypstCompilerState>('idle');

  private worker?: Worker;
  private nextId = 0;
  private readonly pending = new Map<number, { resolve: (r: TypstCompileResponse) => void; reject: (e: Error) => void }>();

  /** Compiles a subject. Rejects when the worker cannot compile at all (assets missing, crash). */
  compile(files: TypstSourceFile[], options: TypstCompileOptions = {}): Promise<TypstCompileResponse> {
    const worker = this.getWorker();
    const request: TypstCompileRequest = {
      kind: 'compile',
      id: ++this.nextId,
      files,
      binaries: options.binaries,
      main: options.main ?? '/main.typ',
      inputs: options.inputs ?? {},
      withPdf: options.withPdf ?? true,
    };
    return new Promise<TypstCompileResponse>((resolve, reject) => {
      this.pending.set(request.id, { resolve, reject });
      worker.postMessage(request);
    });
  }

  ngOnDestroy(): void {
    this.terminate(new Error('compiler stopped'));
  }

  /** Creates the worker; isolated so that tests can provide a fake one. */
  protected createWorker(): Worker {
    return createTypstWorker();
  }

  private getWorker(): Worker {
    if (this.worker === undefined) {
      this.state.set('loading');
      const worker = this.createWorker();
      worker.onmessage = ({ data }: MessageEvent<TypstWorkerResponse>) => this.onResponse(data);
      worker.onerror = (e: ErrorEvent) => {
        e.preventDefault();
        // the worker is unusable (script or Wasm failed to load): every pending compilation fails, the next one
        // starts a new worker
        this.terminate(new Error(e.message || 'Typst worker error'));
      };
      this.worker = worker;
    }
    return this.worker;
  }

  private onResponse(data: TypstWorkerResponse): void {
    const p = this.pending.get(data.id);
    if (p === undefined) {
      return;
    }
    this.pending.delete(data.id);
    if (data.kind === 'failure') {
      this.state.set('failed');
      p.reject(new Error(data.message));
    } else {
      this.state.set('ready');
      p.resolve(data);
    }
  }

  private terminate(error: Error): void {
    this.worker?.terminate();
    this.worker = undefined;
    this.state.set(this.pending.size > 0 ? 'failed' : 'idle');
    for (const p of this.pending.values()) {
      p.reject(error);
    }
    this.pending.clear();
  }
}
