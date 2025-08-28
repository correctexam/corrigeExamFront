import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStudentResponse } from '../student-response.model';
import { StudentResponseService } from '../service/student-response.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './student-response-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, NgIf, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class StudentResponseDeleteDialogComponent {
  studentResponse?: IStudentResponse;

  constructor(
    protected studentResponseService: StudentResponseService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.studentResponseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
