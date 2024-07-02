import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinalResult } from '../final-result.model';
import { FinalResultService } from '../service/final-result.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  templateUrl: './final-result-delete-dialog.component.html',
  standalone: true,
  imports: [NgIf, FormsModule, TranslateDirective, AlertErrorComponent, FaIconComponent],
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
