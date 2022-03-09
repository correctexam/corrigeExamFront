import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITemplate } from '../template.model';
import { TemplateService } from '../service/template.service';

@Component({
  templateUrl: './template-delete-dialog.component.html',
})
export class TemplateDeleteDialogComponent {
  template?: ITemplate;

  constructor(protected templateService: TemplateService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.templateService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
