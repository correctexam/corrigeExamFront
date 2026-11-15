/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, computed, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { IStudentSession } from './student-portal.model';

const KEY = 'correctexam.studentSession';

/**
 * Session of the student portal (ADR 0003): kept in sessionStorage (the tab only), apart from the instructor token,
 * and sent explicitly to /api/student/me (the auth interceptor keeps an explicit Authorization header).
 */
@Injectable({ providedIn: 'root' })
export class StudentSessionService {
  private readonly current = signal<IStudentSession | undefined>(this.read());

  readonly session = this.current.asReadonly();
  readonly email = computed(() => this.current()?.email);

  /** True while a session exists and has not expired. */
  isActive(now: Date = new Date()): boolean {
    const s = this.current();
    return s !== undefined && expiryOf(s) > now.getTime();
  }

  open(session: IStudentSession): void {
    this.current.set(session);
    try {
      sessionStorage.setItem(KEY, JSON.stringify(session));
    } catch {
      // Storage refused (private mode...): the session lasts as long as the page
    }
  }

  close(): void {
    this.current.set(undefined);
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // nothing stored
    }
  }

  headers(): HttpHeaders {
    const s = this.current();
    return s ? new HttpHeaders({ Authorization: `Bearer ${s.idToken}` }) : new HttpHeaders();
  }

  private read(): IStudentSession | undefined {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw === null) {
        return undefined;
      }
      const s = JSON.parse(raw) as IStudentSession;
      return typeof s.idToken === 'string' && !isNaN(expiryOf(s)) ? s : undefined;
    } catch {
      return undefined;
    }
  }
}

/** Expiry in ms: an ISO date, or epoch seconds if dates are serialised as timestamps. */
export function expiryOf(session: IStudentSession): number {
  return typeof session.expiresAt === 'number' ? session.expiresAt * 1000 : new Date(session.expiresAt).getTime();
}
