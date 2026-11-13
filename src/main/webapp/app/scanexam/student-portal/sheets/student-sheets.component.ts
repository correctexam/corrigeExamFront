import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { StudentAccess } from 'app/entities/enumerations/student-access.model';
import { IStudentSheetSummary } from '../student-portal.model';
import { StudentPortalService } from '../student-portal.service';
import { StudentSessionService } from '../student-session.service';

/** Page /my/sheets: every sheet of the student whose exam is published. */
@Component({
  selector: 'jhi-student-sheets',
  templateUrl: './student-sheets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RouterLink, TranslateDirective, TranslatePipe, ButtonModule, MessageModule, TableModule, TagModule],
})
export class StudentSheetsComponent implements OnInit {
  readonly sheets = signal<IStudentSheetSummary[] | undefined>(undefined);
  readonly failed = signal(false);
  readonly loading = computed(() => this.sheets() === undefined && !this.failed());
  readonly graded = StudentAccess.GRADED;

  protected readonly session = inject(StudentSessionService);
  private readonly portal = inject(StudentPortalService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.portal.sheets().subscribe({
      next: sheets => this.sheets.set(sheets),
      error: (e: unknown) => this.onError(e),
    });
  }

  logout(): void {
    this.session.close();
    this.router.navigate(['/my']);
  }

  private onError(e: unknown): void {
    if (e instanceof HttpErrorResponse && e.status === 401) {
      this.session.close();
      this.router.navigate(['/my'], { queryParams: { expired: true } });
      return;
    }
    this.failed.set(true);
  }
}
