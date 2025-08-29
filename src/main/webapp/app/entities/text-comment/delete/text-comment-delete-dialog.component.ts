import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITextComment } from '../text-comment.model';
import { TextCommentService } from '../service/text-comment.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './text-comment-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class TextCommentDeleteDialogComponent {
  textComment?: ITextComment;

  constructor(
    protected textCommentService: TextCommentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.textCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
