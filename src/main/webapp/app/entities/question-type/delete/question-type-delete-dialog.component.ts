import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestionType } from '../question-type.model';
import { QuestionTypeService } from '../service/question-type.service';

@Component({
  templateUrl: './question-type-delete-dialog.component.html',
})
export class QuestionTypeDeleteDialogComponent {
  questionType?: IQuestionType;

  constructor(protected questionTypeService: QuestionTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.questionTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
