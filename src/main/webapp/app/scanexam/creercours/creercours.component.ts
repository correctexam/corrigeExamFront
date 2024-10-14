/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Course, ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { finalize, Observable } from 'rxjs';
import { AccountService } from '../../core/auth/account.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { AlertErrorComponent } from '../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../shared/language/translate.directive';

@Component({
  selector: 'jhi-creercours',
  templateUrl: './creercours.component.html',
  styleUrls: ['./creercours.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateDirective, AlertErrorComponent, NgIf, FaIconComponent],
})
export class CreercoursComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  login: string | undefined;
  editForm: any;

  constructor(
    protected courseService: CourseService,
    protected userService: UserService,
    protected accountService: AccountService,

    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
  ) {
    this.editForm = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.createFromForm();
    this.accountService.getAuthenticationState().subscribe(e => {
      this.login = e?.login;
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const course = this.createFromForm();
    this.subscribeToSaveResponse(this.courseService.create(course));
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
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

  protected createFromForm(): ICourse {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...new Course(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
