import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICourseGroup, CourseGroup } from '../course-group.model';
import { CourseGroupService } from '../service/course-group.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

@Component({
  selector: 'jhi-course-group-update',
  templateUrl: './course-group-update.component.html',
})
export class CourseGroupUpdateComponent implements OnInit {
  isSaving = false;

  studentsSharedCollection: IStudent[] = [];
  coursesSharedCollection: ICourse[] = [];

  editForm = this.fb.group({
    id: [],
    groupName: [null, [Validators.required]],
    students: [],
    course: [],
  });

  constructor(
    protected courseGroupService: CourseGroupService,
    protected studentService: StudentService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courseGroup }) => {
      this.updateForm(courseGroup);

      this.loadRelationshipsOptions();
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

  trackStudentById(index: number, item: IStudent): number {
    return item.id!;
  }

  trackCourseById(index: number, item: ICourse): number {
    return item.id!;
  }

  getSelectedStudent(option: IStudent, selectedVals?: IStudent[]): IStudent {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourseGroup>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(courseGroup: ICourseGroup): void {
    this.editForm.patchValue({
      id: courseGroup.id,
      groupName: courseGroup.groupName,
      students: courseGroup.students,
      course: courseGroup.course,
    });

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing(
      this.studentsSharedCollection,
      ...(courseGroup.students ?? [])
    );
    this.coursesSharedCollection = this.courseService.addCourseToCollectionIfMissing(this.coursesSharedCollection, courseGroup.course);
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) =>
          this.studentService.addStudentToCollectionIfMissing(students, ...(this.editForm.get('students')!.value ?? []))
        )
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));

    this.courseService
      .query()
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing(courses, this.editForm.get('course')!.value)))
      .subscribe((courses: ICourse[]) => (this.coursesSharedCollection = courses));
  }

  protected createFromForm(): ICourseGroup {
    return {
      ...new CourseGroup(),
      id: this.editForm.get(['id'])!.value,
      groupName: this.editForm.get(['groupName'])!.value,
      students: this.editForm.get(['students'])!.value,
      course: this.editForm.get(['course'])!.value,
    };
  }
}
