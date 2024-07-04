import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Answer2HybridGradedCommentFormService, Answer2HybridGradedCommentFormGroup } from './answer-2-hybrid-graded-comment-form.service';
import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';
import { Answer2HybridGradedCommentService } from '../service/answer-2-hybrid-graded-comment.service';
import { IHybridGradedComment } from 'app/entities/hybrid-graded-comment/hybrid-graded-comment.model';
import { HybridGradedCommentService } from 'app/entities/hybrid-graded-comment/service/hybrid-graded-comment.service';
import { IStudentResponse } from 'app/entities/student-response/student-response.model';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';

@Component({
  selector: 'jhi-answer-2-hybrid-graded-comment-update',
  templateUrl: './answer-2-hybrid-graded-comment-update.component.html',
  standalone: true,
})
export class Answer2HybridGradedCommentUpdateComponent implements OnInit {
  isSaving = false;
  answer2HybridGradedComment: IAnswer2HybridGradedComment | null = null;

  hybridGradedCommentsSharedCollection: IHybridGradedComment[] = [];
  studentResponsesSharedCollection: IStudentResponse[] = [];

  editForm: Answer2HybridGradedCommentFormGroup;

  constructor(
    protected answer2HybridGradedCommentService: Answer2HybridGradedCommentService,
    protected answer2HybridGradedCommentFormService: Answer2HybridGradedCommentFormService,
    protected hybridGradedCommentService: HybridGradedCommentService,
    protected studentResponseService: StudentResponseService,
    protected activatedRoute: ActivatedRoute,
  ) {
    this.editForm = this.answer2HybridGradedCommentFormService.createAnswer2HybridGradedCommentFormGroup();
  }

  compareHybridGradedComment = (o1: IHybridGradedComment | null, o2: IHybridGradedComment | null): boolean =>
    this.hybridGradedCommentService.compareHybridGradedComment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answer2HybridGradedComment }) => {
      this.answer2HybridGradedComment = answer2HybridGradedComment;
      if (answer2HybridGradedComment) {
        this.updateForm(answer2HybridGradedComment);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const answer2HybridGradedComment = this.answer2HybridGradedCommentFormService.getAnswer2HybridGradedComment(this.editForm);
    if (answer2HybridGradedComment.id !== null) {
      this.subscribeToSaveResponse(this.answer2HybridGradedCommentService.update(answer2HybridGradedComment));
    } else {
      this.subscribeToSaveResponse(this.answer2HybridGradedCommentService.create(answer2HybridGradedComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnswer2HybridGradedComment>>): void {
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

  protected updateForm(answer2HybridGradedComment: IAnswer2HybridGradedComment): void {
    this.answer2HybridGradedComment = answer2HybridGradedComment;
    this.answer2HybridGradedCommentFormService.resetForm(this.editForm, answer2HybridGradedComment);
  }
}
