import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExamSubject, SubjectApiError, SubjectService } from './subject.service';

const subject: ExamSubject = {
  examId: 7,
  mainFile: 'main.typ',
  revision: 3,
  files: [],
  lock: { held: true, mine: true, lockedBy: 'alice' },
};

describe('SubjectService', () => {
  let service: SubjectService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // a document with cookies only (XSRF): the spec also runs without a DOM
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: DOCUMENT, useValue: { cookie: '' } }],
    });
    service = TestBed.inject(SubjectService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns undefined for an exam without subject', async () => {
    const found = service.find(7);
    http.expectOne('api/exams/7/subject').flush(null, { status: 404, statusText: 'Not Found' });
    await expect(found).resolves.toBeUndefined();
  });

  it('writes a file with the known revision and encodes the path', async () => {
    const written = service.writeFile(7, 'code/Main Test.java', 'class A {}', 'text/plain', 3);
    const req = http.expectOne('api/exams/7/subject/files/code/Main%20Test.java');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('If-Match')).toBe('3');
    expect(req.request.headers.get('Content-Type')).toBe('text/plain');
    expect(req.request.body).toBe('class A {}');
    req.flush({ ...subject, revision: 4 });
    await expect(written).resolves.toEqual(expect.objectContaining({ revision: 4 }));
  });

  it('reports the reason given by the server', async () => {
    const written = service.writeFile(7, 'main.typ', 'x', 'text/plain', 2);
    http
      .expectOne('api/exams/7/subject/files/main.typ')
      .flush({ error: 'REVISION_CONFLICT', message: 'revision 3, not 2' }, { status: 409, statusText: 'Conflict' });
    await expect(written).rejects.toEqual(new SubjectApiError('REVISION_CONFLICT', 409, 'revision 3, not 2'));

    const locked = service.lock(7);
    const req = http.expectOne('api/exams/7/subject/lock?force=false');
    expect(req.request.method).toBe('POST');
    req.flush({ error: 'LOCKED', message: 'bob' }, { status: 409, statusText: 'Conflict' });
    await expect(locked).rejects.toEqual(expect.objectContaining({ code: 'LOCKED' }));
  });

  it('renders a diagram then reads its SVG', async () => {
    const svg = service.renderDiagram({ kind: 'plantuml', source: 'A -> B' });
    const post = http.expectOne('api/subject-diagrams');
    expect(post.request.body).toEqual({ kind: 'plantuml', source: 'A -> B' });
    post.flush({ kind: 'plantuml', sha256: 'f'.repeat(64) });
    await Promise.resolve();
    http.expectOne(`api/subject-diagrams/plantuml/${'f'.repeat(64)}.svg`).flush('<svg/>');
    await expect(svg).resolves.toBe('<svg/>');
  });

  it('tells a wrong diagram from an unavailable renderer', async () => {
    const invalid = service.renderDiagram({ kind: 'plantuml', source: 'A ->' });
    http
      .expectOne('api/subject-diagrams')
      .flush({ error: 'INVALID_SOURCE', message: 'Syntax Error?' }, { status: 422, statusText: 'Unprocessable Entity' });
    await expect(invalid).rejects.toEqual(expect.objectContaining({ code: 'DIAGRAM_INVALID', message: 'Syntax Error?' }));

    const down = service.renderDiagram({ kind: 'd2', source: 'a' });
    http.expectOne('api/subject-diagrams').flush({ error: 'NOT_CONFIGURED', message: 'off' }, { status: 503, statusText: 'Unavailable' });
    await expect(down).rejects.toEqual(expect.objectContaining({ code: 'DIAGRAM_UNAVAILABLE' }));
  });
});
