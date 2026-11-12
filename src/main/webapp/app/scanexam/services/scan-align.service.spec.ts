import { Observable, Subject, of, throwError } from 'rxjs';
import {
  ScanAlignError,
  ScanAlignJobDto,
  ScanAlignService,
  ScanRequestPayload,
  ScanStatusDto,
  countPages,
  isActiveJob,
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

function job(status: string, progress = 0, page = 0): ScanAlignJobDto {
  return { exam_id: 7, status, progress, page, pages_to_manage: '1-10', details: '', updated_at: '2026-11-12T08:00:00Z' };
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
  let jobResult: Observable<ScanAlignJobDto | null>;
  let service: ScanAlignService;

  beforeAll(() => {
    (globalThis as any).EventSource = FakeEventSource;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    source = new FakeEventSource();
    launched = 0;
    launchResult = of(undefined);
    jobResult = of(null);
    service = new ScanAlignService({} as any, {} as any);
    jest.spyOn(service, 'getJob').mockImplementation(() => jobResult);
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

  it('keeps waiting while the server still sees the job active (queued behind another job)', () => {
    let error: ScanAlignError | undefined;
    jobResult = of(job('submitted'));
    service.runJob(payload, { inactivityTimeoutMs: 60_000 }).subscribe({ error: e => (error = e) });
    source.emit({ status: 'connected' });

    jest.advanceTimersByTime(180_000);
    expect(error).toBeUndefined();

    jobResult = of(null);
    jest.advanceTimersByTime(60_000);
    expect(error?.reason).toBe('timeout');
  });

  it('fails with conflict when a job is already running for the exam', () => {
    launchResult = throwError(() => ({ status: 409 }));
    let error: ScanAlignError | undefined;
    service.runJob(payload).subscribe({ error: e => (error = e) });
    source.emit({ status: 'connected' });

    expect(error?.reason).toBe('conflict');
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

describe('ScanAlignService.followJob', () => {
  let source: FakeEventSource;
  let jobResult: Observable<ScanAlignJobDto | null>;
  let service: ScanAlignService;
  let launch: jest.SpyInstance;

  beforeAll(() => {
    (globalThis as any).EventSource = FakeEventSource;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    source = new FakeEventSource();
    jobResult = of(job('running', 30, 3));
    service = new ScanAlignService({} as any, {} as any);
    jest.spyOn(service, 'streamProgress').mockImplementation(() => source as unknown as EventSource);
    jest.spyOn(service, 'getJob').mockImplementation(() => jobResult);
    launch = jest.spyOn(service, 'launch');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('emits the current progress once connected, then the live statuses, and never submits', () => {
    const received: number[] = [];
    let completed = false;
    service.followJob(7).subscribe({ next: s => received.push(s.progress), complete: () => (completed = true) });

    source.emit({ status: 'connected' });
    source.emit({ page: 4, progress: 40 });
    source.emit({ status: 'finished', progress: 100 });

    expect(received).toEqual([30, 40, 100]);
    expect(completed).toBe(true);
    expect(launch).not.toHaveBeenCalled();
    expect(source.closed).toBe(true);
  });

  it('completes at once when the job ended between the detection and the subscription', () => {
    jobResult = of(job('finished', 100));
    let completed = false;
    service.followJob(7).subscribe({ complete: () => (completed = true) });
    source.emit({ status: 'connected' });

    expect(completed).toBe(true);
  });

  it('fails with the worker message when the job ended in error meanwhile', () => {
    jobResult = of({ ...job('error'), details: 'bucket unreachable' });
    let error: ScanAlignError | undefined;
    service.followJob(7).subscribe({ error: e => (error = e) });
    source.emit({ status: 'connected' });

    expect(error?.reason).toBe('worker');
    expect(error?.message).toBe('bucket unreachable');
  });

  it('emits nothing for a queued job and waits for the worker', () => {
    jobResult = of(job('submitted'));
    const received: ScanStatusDto[] = [];
    service.followJob(7).subscribe(s => received.push(s));
    source.emit({ status: 'connected' });
    expect(received).toEqual([]);

    source.emit({ page: 1, progress: 10 });
    expect(received.map(s => s.progress)).toEqual([10]);
  });

  it('fails with lost when the server no longer knows the job', () => {
    jobResult = of(null);
    let error: ScanAlignError | undefined;
    service.followJob(7).subscribe({ error: e => (error = e) });
    source.emit({ status: 'connected' });

    expect(error?.reason).toBe('lost');
  });
});

describe('scan-align helpers', () => {
  it('counts the pages of a page list', () => {
    expect(countPages('1-3; 5')).toBe(4);
    expect(countPages(pagesToManage([1, 2, 3, 7, 9, 10]))).toBe(6);
    expect(countPages('all')).toBe(0);
    expect(countPages(null)).toBe(0);
    expect(countPages('5-2')).toBe(0);
  });

  it('tells active jobs apart', () => {
    expect(isActiveJob(job('submitted'))).toBe(true);
    expect(isActiveJob(job('running'))).toBe(true);
    expect(isActiveJob(job('finished'))).toBe(false);
    expect(isActiveJob(job('error'))).toBe(false);
    expect(isActiveJob(null)).toBe(false);
  });

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
