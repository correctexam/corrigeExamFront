import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { convertToParamMap } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { StudentSheetSourceFactory, decodePublicBestAnswer, encodePublicBestAnswer } from './student-sheet-source';
import { StudentSessionService } from './student-session.service';

describe('StudentSheetSourceFactory', () => {
  let factory: StudentSheetSourceFactory;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    factory = TestBed.inject(StudentSheetSourceFactory);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('reads a /copie link through the public endpoints, without credentials', () => {
    const source = factory.byUuid('u-1');

    source.view().subscribe();
    source.page(2, true).subscribe();
    source.countBestAnswers(3).subscribe(count => expect(count).toBe(4));
    source.bestAnswerPage(3, 1, 2, false).subscribe();

    const view = http.expectOne('api/public/copie/u-1');
    expect(view.request.headers.has('Authorization')).toBe(false);
    view.flush({});
    const page = http.expectOne(r => r.url === 'api/public/copie/u-1/page/2');
    expect(page.request.params.get('noalign')).toBe('true');
    expect(page.request.responseType).toBe('text');
    page.flush('{}');
    http.expectOne('api/public/copie/u-1/best/3').flush({ count: 4 });
    const best = http.expectOne(r => r.url === 'api/public/copie/u-1/best/3/1/page/2');
    expect(best.request.params.has('noalign')).toBe(false);
    best.flush('{}');

    expect(source.persistentCache).toBe(true);
    expect(source.questionLink(2)).toBe('/copie/u-1/2');
    expect(source.bestAnswerLink(3, 1)).toBe('/reponse/' + encodePublicBestAnswer('u-1', 3, 1));
  });

  it('reads a sheet of the portal with the session of the student', () => {
    TestBed.inject(StudentSessionService).open({ idToken: 'student-jwt', expiresAt: '2099-01-01T00:00:00Z', email: 'a@b.fr' });
    const source = factory.bySheetId(42);

    source.view().subscribe();
    source.page(1, false).subscribe();

    expect(http.expectOne('api/student/me/sheets/42').request.headers.get('Authorization')).toBe('Bearer student-jwt');
    expect(http.expectOne('api/student/me/sheets/42/page/1').request.headers.get('Authorization')).toBe('Bearer student-jwt');
    expect(source.persistentCache).toBe(false);
    expect(source.questionLink(3)).toBe('/my/sheets/42/3');
    expect(source.bestAnswerLink(5, 0)).toBe('/my/reponse/42/5/0');
  });

  it('picks the source from the route', () => {
    expect(factory.fromRoute(convertToParamMap({ uuid: 'abc', questionno: '1' }))?.questionLink(1)).toBe('/copie/abc/1');
    expect(factory.fromRoute(convertToParamMap({ sheetId: '7', questionno: '1' }))?.questionLink(1)).toBe('/my/sheets/7/1');
    expect(factory.fromRoute(convertToParamMap({ sheetId: '7x' }))).toBeUndefined();
    expect(factory.fromRoute(convertToParamMap({}))).toBeUndefined();
  });
});

describe('links to starred answers', () => {
  it('round-trip uuid, number and index', () => {
    expect(decodePublicBestAnswer(encodePublicBestAnswer('9f0e-uuid', 12, 0))).toEqual({ uuid: '9f0e-uuid', numero: 12, index: 0 });
  });

  it('refuse the former links (UUID of another sheet, no index) and garbage', () => {
    expect(decodePublicBestAnswer(btoa('/other-uuid/3/'))).toBeUndefined();
    expect(decodePublicBestAnswer(btoa('/u/x/1'))).toBeUndefined();
    expect(decodePublicBestAnswer('%%%')).toBeUndefined();
  });
});
