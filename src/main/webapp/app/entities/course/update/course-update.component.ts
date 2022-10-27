/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/member-ordering */

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICourse, Course } from '../course.model';
import { CourseService } from '../service/course.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
})
export class CourseUpdateComponent implements OnInit {
  isSaving = false;
  users: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    profs: [null, Validators.required],
  });

  constructor(
    protected courseService: CourseService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.updateForm(course);

      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => {
        this.users = res.body || [];
        // eslint-disable-next-line no-console
      });
    });
  }

  updateForm(course: ICourse): void {
    this.editForm.patchValue({
      id: course.id,
      name: course.name,
      profs: course.profs,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const course = this.createFromForm();
    if (course.id !== undefined) {
      this.subscribeToSaveResponse(this.courseService.update(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(course));
    }
  }

  private createFromForm(): ICourse {
    return {
      ...new Course(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      profs: this.editForm.get(['profs'])!.value,
    };
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IUser): any {
    return item.id;
  }
  getSelectedUser(option: IUser, selectedVals?: IUser[]): IUser {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }
}
