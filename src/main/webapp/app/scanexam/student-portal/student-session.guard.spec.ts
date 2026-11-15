import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { studentSessionGuard } from './student-session.guard';
import { StudentSessionService } from './student-session.service';

describe('studentSessionGuard', () => {
  const run = (): boolean | UrlTree =>
    TestBed.runInInjectionContext(() => studentSessionGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as boolean | UrlTree);

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });
  afterEach(() => sessionStorage.clear());

  it('lets an open session in', () => {
    TestBed.inject(StudentSessionService).open({ idToken: 't', expiresAt: '2099-01-01T00:00:00Z', email: 'a@b.fr' });
    expect(run()).toBe(true);
  });

  it('sends back to the request form, saying when the session expired', () => {
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(run() as UrlTree)).toBe('/my');

    TestBed.inject(StudentSessionService).open({ idToken: 't', expiresAt: '2000-01-01T00:00:00Z', email: 'a@b.fr' });
    expect(router.serializeUrl(run() as UrlTree)).toBe('/my?expired=true');
    expect(TestBed.inject(StudentSessionService).session()).toBeUndefined();
  });
});
