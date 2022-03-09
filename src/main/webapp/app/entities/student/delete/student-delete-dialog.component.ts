import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStudent } from '../student.model';
import { StudentService } from '../service/student.service';

@Component({
  templateUrl: './student-delete-dialog.component.html',
})
export class StudentDeleteDialogComponent {
  student?: IStudent;

  constructor(protected studentService: StudentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.studentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
