import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    const retrieve = jest.fn((key: string) => (key === 'authenticationToken' ? 'teacher-jwt' : null));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: LocalStorageService, useValue: { retrieve } },
        { provide: SessionStorageService, useValue: { retrieve: () => null } },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('adds the token of the instructor', () => {
    http.get('api/exams').subscribe();
    expect(controller.expectOne('api/exams').request.headers.get('Authorization')).toBe('Bearer teacher-jwt');
  });

  it('keeps the credentials a request already carries (student portal)', () => {
    http.get('api/student/me/sheets', { headers: new HttpHeaders({ Authorization: 'Bearer student-jwt' }) }).subscribe();
    expect(controller.expectOne('api/student/me/sheets').request.headers.get('Authorization')).toBe('Bearer student-jwt');
  });
});
