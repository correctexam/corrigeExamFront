import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IZone } from '../zone.model';
import { ZoneService } from '../service/zone.service';

@Component({
  templateUrl: './zone-delete-dialog.component.html',
})
export class ZoneDeleteDialogComponent {
  zone?: IZone;

  constructor(protected zoneService: ZoneService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.zoneService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
