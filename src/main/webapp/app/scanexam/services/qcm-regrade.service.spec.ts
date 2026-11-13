import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { InvalidQcmDslError } from '../grading/qcm-option';
import { QcmRegradeService } from './qcm-regrade.service';

describe('QcmRegradeService', () => {
  let service: QcmRegradeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(QcmRegradeService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /** Lets the awaited requests of the service be sent before flushing them. */
  const tick = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

  it('values the options again then updates the notes that changed', async () => {
    const question = { id: 7, typeAlgoName: 'QCM', point: 2, step: 0, validExpression: 'a&b=100; a=50; *=-25; min=-100' };
    const done = service.regrade(question);

    await tick();
    http
      .expectOne(r => r.url.endsWith('api/graded-comments') && r.params.get('questionId') === '7')
      .flush([
        { id: 1, text: 'a&b', description: 'correct 2pt', grade: 2 },
        { id: 2, text: 'a', description: 'incorrect 0 pt', grade: 0 },
        { id: 3, text: 'c', description: 'incorrect (-25 %)', grade: -25 },
      ]);

    await tick();
    const update1 = http.expectOne(r => r.method === 'PUT' && r.url.endsWith('api/graded-comments'));
    expect(update1.request.body).toMatchObject({ id: 1, description: 'correct (100 %)', grade: 100 });
    update1.flush(update1.request.body);
    await tick();
    const update2 = http.expectOne(r => r.method === 'PUT' && r.url.endsWith('api/graded-comments'));
    expect(update2.request.body).toMatchObject({ id: 2, description: 'partiel (50 %)', grade: 50 });
    update2.flush(update2.request.body);

    await tick();
    http
      .expectOne(r => r.url.endsWith('api/student-responses') && r.params.get('questionId') === '7' && r.params.get('page') === '0')
      .flush([
        { id: 10, note: 0, gradedcomments: [{ id: 2, grade: 0 }] },
        { id: 11, note: -50, gradedcomments: [{ id: 3, grade: -25 }] },
      ]);

    await tick();
    const patch = http.expectOne(r => r.method === 'PATCH');
    expect(patch.request.url).toMatch(/api\/student-responses\/10$/);
    // 50 % of 2 points, stored in hundredths of a point
    expect(patch.request.body).toEqual({ currentNote: 100 });
    patch.flush({ id: 10, note: 100 });

    expect(await done).toEqual({ options: 2, responses: 1 });
  });

  it('changes nothing when the options already have the right values', async () => {
    const done = service.regrade({ id: 7, typeAlgoName: 'QCM', point: 2, validExpression: 'a=100' });
    await tick();
    http.expectOne(r => r.url.endsWith('api/graded-comments')).flush([{ id: 1, text: 'a', description: 'correct (100 %)', grade: 100 }]);
    expect(await done).toEqual({ options: 0, responses: 0 });
  });

  it('changes nothing when the DSL is invalid', async () => {
    const done = service.regrade({ id: 7, typeAlgoName: 'QCM', point: 2, validExpression: 'a=1; c-25' });
    await tick();
    http.expectOne(r => r.url.endsWith('api/graded-comments')).flush([{ id: 1, text: 'a', description: 'x', grade: 0 }]);
    await expect(done).rejects.toBeInstanceOf(InvalidQcmDslError);
  });
});
