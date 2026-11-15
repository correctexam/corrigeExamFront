import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from '@jest/globals';

import { StudentSessionService, expiryOf } from './student-session.service';

describe('StudentSessionService', () => {
  afterEach(() => sessionStorage.clear());

  const session = { idToken: 'jwt', expiresAt: '2030-01-01T10:00:00Z', email: 'alice@example.org' };

  it('keeps the session in sessionStorage, apart from the instructor token', () => {
    const service = TestBed.inject(StudentSessionService);
    service.open(session);

    expect(service.email()).toBe('alice@example.org');
    expect(service.isActive(new Date('2030-01-01T09:59:00Z'))).toBe(true);
    expect(service.isActive(new Date('2030-01-01T10:00:01Z'))).toBe(false);
    expect(service.headers().get('Authorization')).toBe('Bearer jwt');
    expect(JSON.parse(sessionStorage.getItem('correctexam.studentSession')!)).toEqual(session);
    expect(sessionStorage.getItem('jhi-authenticationToken')).toBeNull();
  });

  it('restores the session of the tab and forgets it on close', () => {
    sessionStorage.setItem('correctexam.studentSession', JSON.stringify(session));
    const service = TestBed.inject(StudentSessionService);
    expect(service.session()).toEqual(session);

    service.close();

    expect(service.session()).toBeUndefined();
    expect(service.headers().has('Authorization')).toBe(false);
    expect(sessionStorage.getItem('correctexam.studentSession')).toBeNull();
  });

  it('ignores a damaged stored session', () => {
    sessionStorage.setItem('correctexam.studentSession', '{not json');
    expect(TestBed.inject(StudentSessionService).session()).toBeUndefined();
  });

  it('reads the expiry as an ISO date or as epoch seconds', () => {
    expect(expiryOf(session)).toBe(Date.parse('2030-01-01T10:00:00Z'));
    expect(expiryOf({ ...session, expiresAt: 1_900_000_000.5 })).toBe(1_900_000_000_500);
  });
});
