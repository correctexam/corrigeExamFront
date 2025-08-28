import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IComments } from '../comments.model';
import { CommentsService } from '../service/comments.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './comments-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, NgIf, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class CommentsDeleteDialogComponent {
  comments?: IComments;

  constructor(
    protected commentsService: CommentsService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commentsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
