import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAltchaChallenge, IStudentPersonalData, IStudentSession, IStudentSheetSummary } from './student-portal.model';
import { StudentSessionService } from './student-session.service';

/** Calls of the student portal (/api/public/my, /api/student/me). */
@Injectable({ providedIn: 'root' })
export class StudentPortalService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApplicationConfigService);
  private readonly session = inject(StudentSessionService);

  challenge(): Observable<IAltchaChallenge> {
    return this.http.get<IAltchaChallenge>(this.config.getEndpointFor('api/public/my/challenge'));
  }

  /**
   * Asks for a link by e-mail. The answer (202) is the same whether a student has this address or not.
   * Errors: 400 {error: invalidEmail | invalidCaptcha}, 429 {error: tooManyRequests}, 404 portal disabled.
   */
  requestLink(email: string, altcha: string, lang: string): Observable<void> {
    return this.http.post<void>(this.config.getEndpointFor('api/public/my/link'), { email, altcha, lang });
  }

  /** Exchanges the token of the link (single use) for a session, kept by StudentSessionService. */
  openSession(token: string): Observable<IStudentSession> {
    return this.http
      .post<IStudentSession>(this.config.getEndpointFor('api/public/my/session'), { token })
      .pipe(tap(s => this.session.open(s)));
  }

  sheets(): Observable<IStudentSheetSummary[]> {
    return this.http.get<IStudentSheetSummary[]>(this.config.getEndpointFor('api/student/me/sheets'), {
      headers: this.session.headers(),
    });
  }

  personalData(): Observable<IStudentPersonalData> {
    return this.http.get<IStudentPersonalData>(this.config.getEndpointFor('api/student/me/data'), {
      headers: this.session.headers(),
    });
  }
}
