import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { StudentPortalRequestComponent } from './student-portal-request.component';
import { StudentPortalService } from '../student-portal.service';

jest.mock('../altcha-solver', () => ({
  solveAltcha: jest.fn(() => Promise.resolve('payload')),
}));

describe('StudentPortalRequestComponent', () => {
  let fixture: ComponentFixture<StudentPortalRequestComponent>;
  let component: StudentPortalRequestComponent;
  const portal = {
    challenge: jest.fn(() => of({ algorithm: 'SHA-256', challenge: 'c', maxnumber: 10, salt: 's', signature: 'x' })),
    requestLink: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [StudentPortalRequestComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: StudentPortalService, useValue: portal }],
    }).compileComponents();
    fixture = TestBed.createComponent(StudentPortalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('solves the challenge and sends the normalized address', async () => {
    portal.requestLink.mockReturnValue(of(undefined));
    component.email.set('  Alice@Example.ORG ');

    await component.submit();

    expect(portal.requestLink).toHaveBeenCalledWith('alice@example.org', 'payload', expect.any(String));
    expect(component.state()).toBe('sent');
  });

  it('does not call the server for a malformed address', async () => {
    component.email.set('alice');
    await component.submit();
    expect(portal.challenge).not.toHaveBeenCalled();
    expect(component.state()).toBe('invalidEmail');
  });

  it.each([
    [new HttpErrorResponse({ status: 429, error: { error: 'tooManyRequests' } }), 'tooManyRequests'],
    [new HttpErrorResponse({ status: 400, error: { error: 'invalidCaptcha' } }), 'invalidCaptcha'],
    [new HttpErrorResponse({ status: 404 }), 'disabled'],
    [new HttpErrorResponse({ status: 500 }), 'error'],
  ])('shows why the link was not sent (%s)', async (error, state) => {
    portal.requestLink.mockReturnValue(throwError(() => error));
    component.email.set('alice@example.org');
    await component.submit();
    expect(component.state()).toBe(state);
  });
});
