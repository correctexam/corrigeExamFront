import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourse } from '../course.model';
import { CourseService } from '../service/course.service';

@Component({
  templateUrl: './course-delete-dialog.component.html',
})
export class CourseDeleteDialogComponent {
  course?: ICourse;

  constructor(protected courseService: CourseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.courseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
