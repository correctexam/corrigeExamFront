import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IComments, Comments } from '../comments.model';
import { CommentsService } from '../service/comments.service';
import { IStudentResponse } from 'app/entities/student-response/student-response.model';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';

@Component({
  selector: 'jhi-comments-update',
  templateUrl: './comments-update.component.html',
})
export class CommentsUpdateComponent implements OnInit {
  isSaving = false;

  studentResponsesSharedCollection: IStudentResponse[] = [];

  editForm = this.fb.group({
    id: [],
    jsonData: [],
    studentResponse: [],
  });

  constructor(
    protected commentsService: CommentsService,
    protected studentResponseService: StudentResponseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comments }) => {
      this.updateForm(comments);

      this.loadRelationshipsOptions();
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

  trackStudentResponseById(index: number, item: IStudentResponse): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComments>>): void {
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

  protected updateForm(comments: IComments): void {
    this.editForm.patchValue({
      id: comments.id,
      jsonData: comments.jsonData,
      studentResponse: comments.studentResponse,
    });

    this.studentResponsesSharedCollection = this.studentResponseService.addStudentResponseToCollectionIfMissing(
      this.studentResponsesSharedCollection,
      comments.studentResponse
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentResponseService
      .query()
      .pipe(map((res: HttpResponse<IStudentResponse[]>) => res.body ?? []))
      .pipe(
        map((studentResponses: IStudentResponse[]) =>
          this.studentResponseService.addStudentResponseToCollectionIfMissing(studentResponses, this.editForm.get('studentResponse')!.value)
        )
      )
      .subscribe((studentResponses: IStudentResponse[]) => (this.studentResponsesSharedCollection = studentResponses));
  }

  protected createFromForm(): IComments {
    return {
      ...new Comments(),
      id: this.editForm.get(['id'])!.value,
      jsonData: this.editForm.get(['jsonData'])!.value,
      studentResponse: this.editForm.get(['studentResponse'])!.value,
    };
  }
}
