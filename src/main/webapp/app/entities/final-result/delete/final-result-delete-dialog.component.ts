import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinalResult } from '../final-result.model';
import { FinalResultService } from '../service/final-result.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './final-result-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, NgIf, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class FinalResultDeleteDialogComponent {
  finalResult?: IFinalResult;

  constructor(
    protected finalResultService: FinalResultService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.finalResultService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
