import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestion } from '../question.model';
import { QuestionService } from '../service/question.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './question-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class QuestionDeleteDialogComponent {
  question?: IQuestion;

  constructor(
    protected questionService: QuestionService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.questionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
