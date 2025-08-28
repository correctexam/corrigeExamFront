import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExamSheet } from '../exam-sheet.model';
import { ExamSheetService } from '../service/exam-sheet.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './exam-sheet-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, NgIf, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class ExamSheetDeleteDialogComponent {
  examSheet?: IExamSheet;

  constructor(
    protected examSheetService: ExamSheetService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.examSheetService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
