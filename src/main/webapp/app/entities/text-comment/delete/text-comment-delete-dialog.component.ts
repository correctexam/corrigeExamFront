import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITextComment } from '../text-comment.model';
import { TextCommentService } from '../service/text-comment.service';

@Component({
  templateUrl: './text-comment-delete-dialog.component.html',
})
export class TextCommentDeleteDialogComponent {
  textComment?: ITextComment;

  constructor(protected textCommentService: TextCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.textCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
