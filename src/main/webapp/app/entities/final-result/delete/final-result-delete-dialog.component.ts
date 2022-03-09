import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinalResult } from '../final-result.model';
import { FinalResultService } from '../service/final-result.service';

@Component({
  templateUrl: './final-result-delete-dialog.component.html',
})
export class FinalResultDeleteDialogComponent {
  finalResult?: IFinalResult;

  constructor(protected finalResultService: FinalResultService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.finalResultService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
