import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGradedComment } from '../graded-comment.model';
import { GradedCommentService } from '../service/graded-comment.service';

@Component({
  templateUrl: './graded-comment-delete-dialog.component.html',
})
export class GradedCommentDeleteDialogComponent {
  gradedComment?: IGradedComment;

  constructor(protected gradedCommentService: GradedCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gradedCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
