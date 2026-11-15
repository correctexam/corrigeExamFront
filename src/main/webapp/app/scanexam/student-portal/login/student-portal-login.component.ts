import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { StudentPortalService } from '../student-portal.service';

/** Page /my/{token} of the e-mailed link: exchanges the token (single use) for a session, then shows the sheets. */
@Component({
  selector: 'jhi-student-portal-login',
  template: `
    <div class="grid justify-content-center">
      <div class="col-12 md:col-8 lg:col-6">
        @if (failed()) {
          <p-message severity="warn" [text]="'studentportal.login.invalid' | translate"></p-message>
          <p class="mt-3"><a routerLink="/my" [translate]="'studentportal.login.askagain'">Demander un nouveau lien</a></p>
        } @else {
          <p-progressSpinner></p-progressSpinner>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslateDirective, TranslatePipe, MessageModule, ProgressSpinnerModule],
})
export class StudentPortalLoginComponent implements OnInit {
  readonly failed = signal(false);

  private readonly portal = inject(StudentPortalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    this.portal.openSession(token).subscribe({
      // replaceUrl: the token (already used) leaves the history
      next: () => this.router.navigate(['/my/sheets'], { replaceUrl: true }),
      error: () => this.failed.set(true),
    });
  }
}
