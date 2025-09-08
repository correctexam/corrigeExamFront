import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IZone } from '../zone.model';
import { ZoneService } from '../service/zone.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './zone-delete-dialog.component.html',
  standalone: true,
  imports: [FormsModule, AlertErrorComponent, FaIconComponent, TranslateDirective],
})
export class ZoneDeleteDialogComponent {
  zone?: IZone;

  constructor(
    protected zoneService: ZoneService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.zoneService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
