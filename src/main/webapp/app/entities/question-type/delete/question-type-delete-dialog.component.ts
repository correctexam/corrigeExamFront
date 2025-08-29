import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestionType } from '../question-type.model';
import { QuestionTypeService } from '../service/question-type.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './question-type-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class QuestionTypeDeleteDialogComponent {
  questionType?: IQuestionType;

  constructor(
    protected questionTypeService: QuestionTypeService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.questionTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
