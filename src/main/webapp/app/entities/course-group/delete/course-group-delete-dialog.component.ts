import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourseGroup } from '../course-group.model';
import { CourseGroupService } from '../service/course-group.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './course-group-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class CourseGroupDeleteDialogComponent {
  courseGroup?: ICourseGroup;

  constructor(
    protected courseGroupService: CourseGroupService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.courseGroupService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
