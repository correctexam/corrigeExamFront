import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { IStudentPersonalData } from '../student-portal.model';
import { StudentPortalService } from '../student-portal.service';
import { StudentSessionService } from '../student-session.service';

/** Page /my/data: what CorrectExam holds about the address of the session (GDPR right of access). */
@Component({
  selector: 'jhi-student-data',
  templateUrl: './student-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslateDirective, TranslatePipe, ButtonModule, MessageModule],
})
export class StudentDataComponent implements OnInit {
  readonly data = signal<IStudentPersonalData | undefined>(undefined);
  readonly failed = signal(false);

  private readonly portal = inject(StudentPortalService);
  private readonly router = inject(Router);
  private readonly session = inject(StudentSessionService);

  ngOnInit(): void {
    this.portal.personalData().subscribe({
      next: data => this.data.set(data),
      error: (e: unknown) => {
        if (e instanceof HttpErrorResponse && e.status === 401) {
          this.session.close();
          this.router.navigate(['/my'], { queryParams: { expired: true } });
          return;
        }
        this.failed.set(true);
      },
    });
  }

  /** Downloads the data as JSON. */
  download(): void {
    const data = this.data();
    if (data === undefined) {
      return;
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'correctexam-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}
