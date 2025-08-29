import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourse } from '../course.model';
import { CourseService } from '../service/course.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FormsModule } from '@angular/forms';

import { TranslateDirective } from '@ngx-translate/core';

@Component({
  templateUrl: './course-delete-dialog.component.html',
  standalone: true,
  imports: [TranslateDirective, FormsModule, AlertErrorComponent, FaIconComponent],
})
export class CourseDeleteDialogComponent {
  course?: ICourse;

  constructor(
    protected courseService: CourseService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.courseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
