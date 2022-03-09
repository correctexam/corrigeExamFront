import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStudentResponse } from '../student-response.model';
import { StudentResponseService } from '../service/student-response.service';

@Component({
  templateUrl: './student-response-delete-dialog.component.html',
})
export class StudentResponseDeleteDialogComponent {
  studentResponse?: IStudentResponse;

  constructor(protected studentResponseService: StudentResponseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.studentResponseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
