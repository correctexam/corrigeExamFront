import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourseGroup } from '../course-group.model';
import { CourseGroupService } from '../service/course-group.service';

@Component({
  templateUrl: './course-group-delete-dialog.component.html',
})
export class CourseGroupDeleteDialogComponent {
  courseGroup?: ICourseGroup;

  constructor(protected courseGroupService: CourseGroupService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.courseGroupService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
