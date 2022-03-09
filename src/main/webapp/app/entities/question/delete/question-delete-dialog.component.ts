import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestion } from '../question.model';
import { QuestionService } from '../service/question.service';

@Component({
  templateUrl: './question-delete-dialog.component.html',
})
export class QuestionDeleteDialogComponent {
  question?: IQuestion;

  constructor(protected questionService: QuestionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.questionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
