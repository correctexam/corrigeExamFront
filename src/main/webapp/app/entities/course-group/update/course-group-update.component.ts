/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICourseGroup, CourseGroup } from '../course-group.model';
import { CourseGroupService } from '../service/course-group.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

type SelectableEntity = IStudent | ICourse;

@Component({
  selector: 'jhi-course-group-update',
  templateUrl: './course-group-update.component.html',
})
export class CourseGroupUpdateComponent implements OnInit {
  isSaving = false;
  students: IStudent[] = [];
  courses: ICourse[] = [];

  editForm = this.fb.group({
    id: [],
    groupName: [null, [Validators.required]],
    students: [],
    courseId: [],
  });

  constructor(
    protected courseGroupService: CourseGroupService,
    protected studentService: StudentService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courseGroup }) => {
      this.updateForm(courseGroup);

      this.studentService.query().subscribe((res: HttpResponse<IStudent[]>) => (this.students = res.body || []));

      this.courseService.query().subscribe((res: HttpResponse<ICourse[]>) => (this.courses = res.body || []));
    });
  }

  updateForm(courseGroup: ICourseGroup): void {
    this.editForm.patchValue({
      id: courseGroup.id,
      groupName: courseGroup.groupName,
      students: courseGroup.students,
      courseId: courseGroup.courseId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const courseGroup = this.createFromForm();
    if (courseGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.courseGroupService.update(courseGroup));
    } else {
      this.subscribeToSaveResponse(this.courseGroupService.create(courseGroup));
    }
  }

  private createFromForm(): ICourseGroup {
    return {
      ...new CourseGroup(),
      id: this.editForm.get(['id'])!.value,
      groupName: this.editForm.get(['groupName'])!.value,
      students: this.editForm.get(['students'])!.value,
      courseId: this.editForm.get(['courseId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourseGroup>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: IStudent[], option: IStudent): IStudent {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
