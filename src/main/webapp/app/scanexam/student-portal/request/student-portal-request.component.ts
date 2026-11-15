import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom, map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';

import { isValidStudentEmail, normalizeStudentEmail } from '../../import-student/student-email-check';
import { solveAltcha } from '../altcha-solver';
import { StudentPortalService } from '../student-portal.service';
import { StudentSessionService } from '../student-session.service';

export type LinkRequestState =
  | 'idle'
  | 'solving'
  | 'sending'
  | 'sent'
  | 'invalidEmail'
  | 'invalidCaptcha'
  | 'tooManyRequests'
  | 'disabled'
  | 'error';

/** Page /my: the student asks for a link to their sheets, sent to their address (ADR 0003). */
@Component({
  selector: 'jhi-student-portal-request',
  templateUrl: './student-portal-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, TranslateDirective, TranslatePipe, ButtonModule, InputTextModule, MessageModule, ProgressBarModule],
})
export class StudentPortalRequestComponent {
  readonly email = signal('');
  readonly state = signal<LinkRequestState>('idle');
  /** Share of the proof of work already done (0 to 100). */
  readonly progress = signal(0);
  readonly expired = toSignal(inject(ActivatedRoute).queryParamMap.pipe(map(p => p.get('expired') === 'true')), { initialValue: false });
  readonly busy = computed(() => this.state() === 'solving' || this.state() === 'sending');
  readonly emailValid = computed(() => isValidStudentEmail(normalizeStudentEmail(this.email())));

  protected readonly session = inject(StudentSessionService);
  private readonly portal = inject(StudentPortalService);
  private readonly translate = inject(TranslateService);

  async submit(): Promise<void> {
    const email = normalizeStudentEmail(this.email());
    if (this.busy()) {
      return;
    }
    if (!isValidStudentEmail(email)) {
      this.state.set('invalidEmail');
      return;
    }
    try {
      this.state.set('solving');
      this.progress.set(0);
      const challenge = await firstValueFrom(this.portal.challenge());
      const altcha = await solveAltcha(challenge, share => this.progress.set(Math.round(share * 100)));
      this.state.set('sending');
      await firstValueFrom(this.portal.requestLink(email, altcha, this.lang()));
      this.state.set('sent');
    } catch (e) {
      this.state.set(this.errorState(e));
    }
  }

  /** Language of the e-mail: fr, else en. */
  private lang(): string {
    return this.translate.currentLang === 'fr' ? 'fr' : 'en';
  }

  private errorState(e: unknown): LinkRequestState {
    if (!(e instanceof HttpErrorResponse)) {
      return 'error';
    }
    if (e.status === 404) {
      return 'disabled';
    }
    if (e.status === 429) {
      return 'tooManyRequests';
    }
    const code = (e.error as { error?: string } | null)?.error;
    if (e.status === 400 && (code === 'invalidEmail' || code === 'invalidCaptcha')) {
      return code;
    }
    return 'error';
  }
}
