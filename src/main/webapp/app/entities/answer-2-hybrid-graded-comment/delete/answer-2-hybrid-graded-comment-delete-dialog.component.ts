import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';
import { Answer2HybridGradedCommentService } from '../service/answer-2-hybrid-graded-comment.service';
import { ITEM_DELETED_EVENT } from 'app/entities/hybrid-graded-comment/list/hybrid-graded-comment.component';
import { AlertErrorComponent } from 'app/shared/alert/alert-error.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './answer-2-hybrid-graded-comment-delete-dialog.component.html',
  standalone: true,
  imports: [AlertErrorComponent, FaIconComponent, TranslateDirective],
})
export class Answer2HybridGradedCommentDeleteDialogComponent {
  answer2HybridGradedComment?: IAnswer2HybridGradedComment;

  constructor(
    protected answer2HybridGradedCommentService: Answer2HybridGradedCommentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.answer2HybridGradedCommentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
