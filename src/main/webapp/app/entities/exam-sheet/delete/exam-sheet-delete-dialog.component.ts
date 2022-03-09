import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExamSheet } from '../exam-sheet.model';
import { ExamSheetService } from '../service/exam-sheet.service';

@Component({
  templateUrl: './exam-sheet-delete-dialog.component.html',
})
export class ExamSheetDeleteDialogComponent {
  examSheet?: IExamSheet;

  constructor(protected examSheetService: ExamSheetService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.examSheetService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
