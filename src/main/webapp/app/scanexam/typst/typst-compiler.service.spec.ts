/**
 * @jest-environment node
 */
import { Injector, runInInjectionContext } from '@angular/core';
import { TypstCompilerService } from './typst-compiler.service';
import { TypstCompileRequest, TypstWorkerResponse } from './typst-worker.protocol';

/** Worker double: records the requests, answers when the test says so. */
class FakeWorker {
  onmessage: ((e: MessageEvent<TypstWorkerResponse>) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  requests: TypstCompileRequest[] = [];
  terminated = false;
  postMessage(r: TypstCompileRequest): void {
    this.requests.push(r);
  }
  terminate(): void {
    this.terminated = true;
  }
  answer(r: TypstWorkerResponse): void {
    this.onmessage!({ data: r } as MessageEvent<TypstWorkerResponse>);
  }
  crash(message: string): void {
    this.onerror!({ message, preventDefault: () => undefined } as ErrorEvent);
  }
}

class TestableCompilerService extends TypstCompilerService {
  workers: FakeWorker[] = [];
  protected override createWorker(): Worker {
    const w = new FakeWorker();
    this.workers.push(w);
    return w as unknown as Worker;
  }
}

jest.mock('./typst-worker-factory', () => ({ createTypstWorker: () => undefined }));

const create = (): TestableCompilerService =>
  runInInjectionContext(Injector.create({ providers: [] }), () => new TestableCompilerService());
const files = [{ path: '/main.typ', content: 'Hello' }];

describe('TypstCompilerService', () => {
  it('starts the worker on the first compilation only', async () => {
    const s = create();
    expect(s.state()).toBe('idle');
    const p = s.compile(files, { inputs: { 'ce-plan': '{}' } });
    expect(s.state()).toBe('loading');
    const w = s.workers[0];
    expect(w.requests[0]).toEqual({ kind: 'compile', id: 1, files, main: '/main.typ', inputs: { 'ce-plan': '{}' }, withPdf: true });
    w.answer({ kind: 'compiled', id: 1, ok: true, diagnostics: [], durationMs: 3 });
    await expect(p).resolves.toEqual(expect.objectContaining({ ok: true }));
    expect(s.state()).toBe('ready');
    void s.compile(files);
    expect(s.workers.length).toBe(1);
  });

  it('matches answers to requests', async () => {
    const s = create();
    const first = s.compile(files);
    const second = s.compile(files, { withPdf: false });
    const w = s.workers[0];
    w.answer({ kind: 'compiled', id: 2, ok: false, diagnostics: [], durationMs: 1 });
    w.answer({ kind: 'compiled', id: 1, ok: true, diagnostics: [], durationMs: 1 });
    await expect(second).resolves.toEqual(expect.objectContaining({ id: 2, ok: false }));
    await expect(first).resolves.toEqual(expect.objectContaining({ id: 1, ok: true }));
  });

  it('rejects when the worker cannot compile', async () => {
    const s = create();
    const p = s.compile(files);
    s.workers[0].answer({ kind: 'failure', id: 1, message: 'content/typst/fonts/index.json: HTTP 404' });
    await expect(p).rejects.toThrow('HTTP 404');
    expect(s.state()).toBe('failed');
  });

  it('fails the pending compilations when the worker crashes, and starts a new one next time', async () => {
    const s = create();
    const p = s.compile(files);
    s.workers[0].crash('out of memory');
    await expect(p).rejects.toThrow('out of memory');
    expect(s.workers[0].terminated).toBe(true);
    void s.compile(files);
    expect(s.workers.length).toBe(2);
  });
});
