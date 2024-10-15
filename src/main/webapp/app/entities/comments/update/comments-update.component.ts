/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IComments, Comments } from '../comments.model';
import { CommentsService } from '../service/comments.service';
import { IStudentResponse } from 'app/entities/student-response/student-response.model';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor } from '@angular/common';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-comments-update',
  templateUrl: './comments-update.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateDirective, AlertErrorComponent, NgFor, FaIconComponent],
})
export class CommentsUpdateComponent implements OnInit {
  isSaving = false;
  studentresponses: IStudentResponse[] = [];

  editForm: UntypedFormGroup;

  constructor(
    protected commentsService: CommentsService,
    protected studentResponseService: StudentResponseService,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
  ) {
    this.editForm = this.fb.group({
      id: [],
      zonegeneratedid: [],
      jsonData: [],
      studentResponseId: [],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comments }) => {
      this.updateForm(comments);

      this.studentResponseService.query().subscribe((res: HttpResponse<IStudentResponse[]>) => (this.studentresponses = res.body || []));
    });
  }

  updateForm(comments: IComments): void {
    this.editForm.patchValue({
      id: comments.id,
      zonegeneratedid: comments.zonegeneratedid,
      jsonData: comments.jsonData,
      studentResponseId: comments.studentResponseId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comments = this.createFromForm();
    if (comments.id !== undefined) {
      this.subscribeToSaveResponse(this.commentsService.update(comments));
    } else {
      this.subscribeToSaveResponse(this.commentsService.create(comments));
    }
  }

  private createFromForm(): IComments {
    return {
      ...new Comments(),
      id: this.editForm.get(['id'])!.value,
      zonegeneratedid: this.editForm.get(['zonegeneratedid'])!.value,
      jsonData: this.editForm.get(['jsonData'])!.value,
      studentResponseId: this.editForm.get(['studentResponseId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComments>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IStudentResponse): any {
    return item.id;
  }
}
