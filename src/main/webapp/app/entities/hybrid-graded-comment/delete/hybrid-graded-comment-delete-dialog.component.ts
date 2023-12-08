import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHybridGradedComment } from '../hybrid-graded-comment.model';
import { HybridGradedCommentService } from '../service/hybrid-graded-comment.service';

export const ITEM_DELETED_EVENT = 'deleted';

@Component({
  templateUrl: './hybrid-graded-comment-delete-dialog.component.html',
})
export class HybridGradedCommentDeleteDialogComponent {
  hybridGradedComment?: IHybridGradedComment;

  constructor(
    protected hybridGradedCommentService: HybridGradedCommentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.hybridGradedCommentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
