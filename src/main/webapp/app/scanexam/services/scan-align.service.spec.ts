import { Observable, Subject, of, throwError } from 'rxjs';
import {
  ScanAlignError,
  ScanAlignService,
  ScanRequestPayload,
  ScanStatusDto,
  pagesToManage,
  serverAlgoFromMode,
} from './scan-align.service';

class FakeEventSource {
  static readonly CLOSED = 2;
  readyState = 1;
  closed = false;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;

  emit(status: Partial<ScanStatusDto>): void {
    const dto: ScanStatusDto = { exam_id: 7, page: 0, status: 'running', progress: 0, details: '', ...status };
    this.onmessage?.({ data: JSON.stringify(dto) } as MessageEvent);
  }

  close(): void {
    this.closed = true;
    this.readyState = FakeEventSource.CLOSED;
  }
}

const payload: ScanRequestPayload = {
  pages_to_manage: '1-2',
  exam_id: 7,
  template_id: 1,
  scan_id: 2,
  algo: 1,
  heightresolution: 2000,
  corner_square_size: 300,
  min_radius: 10,
};

describe('ScanAlignService.runJob', () => {
  let source: FakeEventSource;
  let launched: number;
  let launchResult: Observable<void>;
  let service: ScanAlignService;

  beforeAll(() => {
    (globalThis as any).EventSource = FakeEventSource;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    source = new FakeEventSource();
    launched = 0;
    launchResult = of(undefined);
    service = new ScanAlignService({} as any, {} as any);
    jest.spyOn(service, 'streamProgress').mockImplementation(() => source as unknown as EventSource);
    jest.spyOn(service, 'launch').mockImplementation(() => {
      launched++;
      return launchResult;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('submits the job only once the stream is connected, then completes on finished', () => {
    const received: string[] = [];
    let completed = false;
    service.runJob(payload).subscribe({ next: s => received.push(s.status), complete: () => (completed = true) });

    expect(launched).toBe(0);
    source.emit({ status: 'connected' });
    expect(launched).toBe(1);

    source.emit({ page: 1, progress: 50 });
    source.emit({ page: 2, progress: 100 });
    expect(completed).toBe(false); // 100 % on a page is not the end: the cache is not uploaded yet

    source.emit({ status: 'finished', progress: 100 });
    expect(completed).toBe(true);
    expect(received).toEqual(['running', 'running', 'finished']);
    expect(source.closed).toBe(true);
  });

  it('submits after the connect timeout when the back-end sends no connected event', () => {
    service.runJob(payload, { connectTimeoutMs: 1000 }).subscribe();
    jest.advanceTimersByTime(999);
    expect(launched).toBe(0);
    jest.advanceTimersByTime(1);
    expect(launched).toBe(1);
  });

  it('fails with the worker message on an error status', () => {
    let error: unknown;
    service.runJob(payload).subscribe({ error: e => (error = e) });
    source.emit({ status: 'connected' });
    source.emit({ status: 'error', details: 'cache upload failed' });

    expect(error).toBeInstanceOf(ScanAlignError);
    expect((error as ScanAlignError).reason).toBe('worker');
    expect((error as ScanAlignError).message).toBe('cache upload failed');
    expect(source.closed).toBe(true);
  });

  it('fails when no status arrives before the inactivity timeout', () => {
    let error: ScanAlignError | undefined;
    service.runJob(payload, { inactivityTimeoutMs: 60_000 }).subscribe({ error: e => (error = e) });
    source.emit({ status: 'connected' });

    jest.advanceTimersByTime(59_000);
    source.emit({ page: 1, progress: 50 }); // resets the timer
    jest.advanceTimersByTime(59_000);
    expect(error).toBeUndefined();

    jest.advanceTimersByTime(1_000);
    expect(error?.reason).toBe('timeout');
  });

  it('fails when the job submission fails', () => {
    launchResult = throwError(() => ({ status: 500 }));
    let error: ScanAlignError | undefined;
    service.runJob(payload).subscribe({ error: e => (error = e) });
    source.emit({ status: 'connected' });

    expect(error?.reason).toBe('submit');
    expect(error?.message).toContain('HTTP 500');
  });

  it('fails when the stream is closed by the browser', () => {
    let error: ScanAlignError | undefined;
    service.runJob(payload).subscribe({ error: e => (error = e) });
    source.readyState = FakeEventSource.CLOSED;
    source.onerror?.();

    expect(error?.reason).toBe('connection');
  });

  it('ignores malformed messages and closes the stream on unsubscribe', () => {
    const received: ScanStatusDto[] = [];
    const subscription = service.runJob(payload).subscribe(s => received.push(s));
    source.onmessage?.({ data: 'not json' } as MessageEvent);
    expect(received).toEqual([]);

    subscription.unsubscribe();
    expect(source.closed).toBe(true);
  });

  it('cancels the pending submission on unsubscribe', () => {
    const subject = new Subject<void>();
    launchResult = subject.asObservable();
    const subscription = service.runJob(payload, { connectTimeoutMs: 1000 }).subscribe();
    subscription.unsubscribe();
    jest.advanceTimersByTime(2000);
    expect(launched).toBe(0);
  });
});

describe('scan-align helpers', () => {
  it('formats page ranges', () => {
    expect(pagesToManage([5, 1, 2, 3])).toBe('1-3; 5');
    expect(pagesToManage([])).toBe('');
  });

  it('maps alignment modes to worker algorithms', () => {
    expect(serverAlgoFromMode('marker')).toBe(1);
    expect(serverAlgoFromMode('nomarker')).toBe(2);
    expect(serverAlgoFromMode('off')).toBe(0);
  });
});
