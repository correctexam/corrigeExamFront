import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExam } from '../exam.model';
import { ExamService } from '../service/exam.service';

@Component({
  templateUrl: './exam-delete-dialog.component.html',
})
export class ExamDeleteDialogComponent {
  exam?: IExam;

  constructor(protected examService: ExamService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.examService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
