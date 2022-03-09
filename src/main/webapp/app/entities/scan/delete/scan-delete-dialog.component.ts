import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IScan } from '../scan.model';
import { ScanService } from '../service/scan.service';

@Component({
  templateUrl: './scan-delete-dialog.component.html',
})
export class ScanDeleteDialogComponent {
  scan?: IScan;

  constructor(protected scanService: ScanService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.scanService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
