import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IComments } from '../comments.model';
import { CommentsService } from '../service/comments.service';

@Component({
  templateUrl: './comments-delete-dialog.component.html',
})
export class CommentsDeleteDialogComponent {
  comments?: IComments;

  constructor(protected commentsService: CommentsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commentsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
