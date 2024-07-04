/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IGradedComment, GradedComment } from '../graded-comment.model';
import { GradedCommentService } from '../service/graded-comment.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor } from '@angular/common';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-graded-comment-update',
  templateUrl: './graded-comment-update.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateDirective, AlertErrorComponent, NgFor, FaIconComponent],
})
export class GradedCommentUpdateComponent implements OnInit {
  isSaving = false;

  questions: IQuestion[] = [];

  editForm: UntypedFormGroup;

  constructor(
    protected gradedCommentService: GradedCommentService,
    protected questionService: QuestionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
  ) {
    this.editForm = this.fb.group({
      id: [],
      zonegeneratedid: [],
      text: [],
      description: [],
      grade: [],
      questionId: [],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gradedComment }) => {
      this.updateForm(gradedComment);
      this.questionService.query().subscribe((res: HttpResponse<IQuestion[]>) => (this.questions = res.body || []));
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gradedComment = this.createFromForm();
    if (gradedComment.id !== undefined) {
      this.subscribeToSaveResponse(this.gradedCommentService.update(gradedComment));
    } else {
      this.subscribeToSaveResponse(this.gradedCommentService.create(gradedComment));
    }
  }

  trackQuestionById(index: number, item: IQuestion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGradedComment>>): void {
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

  protected updateForm(gradedComment: IGradedComment): void {
    this.editForm.patchValue({
      id: gradedComment.id,
      zonegeneratedid: gradedComment.zonegeneratedid,
      text: gradedComment.text,
      description: gradedComment.description,
      grade: gradedComment.grade,
      questionId: gradedComment.questionId,
    });
  }

  protected createFromForm(): IGradedComment {
    return {
      ...new GradedComment(),
      id: this.editForm.get(['id'])!.value,
      zonegeneratedid: this.editForm.get(['zonegeneratedid'])!.value,
      text: this.editForm.get(['text'])!.value,
      description: this.editForm.get(['description'])!.value,
      grade: this.editForm.get(['grade'])!.value,
      questionId: this.editForm.get(['questionId'])!.value,
    };
  }

  trackById(index: number, item: IQuestion): any {
    return item.id;
  }
}
