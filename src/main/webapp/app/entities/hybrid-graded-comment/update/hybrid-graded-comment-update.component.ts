import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HybridGradedCommentFormService, HybridGradedCommentFormGroup } from './hybrid-graded-comment-form.service';
import { IHybridGradedComment } from '../hybrid-graded-comment.model';
import { HybridGradedCommentService } from '../service/hybrid-graded-comment.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgFor, NgIf } from '@angular/common';
import { AlertErrorComponent } from 'app/shared/alert/alert-error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FontAwesomeModule, NgFor, AlertErrorComponent, NgIf, FormsModule, ReactiveFormsModule],
  selector: 'jhi-hybrid-graded-comment-update',
  templateUrl: './hybrid-graded-comment-update.component.html',
})
export class HybridGradedCommentUpdateComponent implements OnInit {
  isSaving = false;
  hybridGradedComment: IHybridGradedComment | null = null;

  questionsSharedCollection: IQuestion[] = [];

  editForm: HybridGradedCommentFormGroup;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected hybridGradedCommentService: HybridGradedCommentService,
    protected hybridGradedCommentFormService: HybridGradedCommentFormService,
    protected questionService: QuestionService,
    protected activatedRoute: ActivatedRoute,
  ) {
    this.editForm = this.hybridGradedCommentFormService.createHybridGradedCommentFormGroup();
  }

  //  compareQuestion = (o1: IQuestion | null, o2: IQuestion | null): boolean => this.questionService.compareQuestion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hybridGradedComment }) => {
      this.hybridGradedComment = hybridGradedComment;
      if (hybridGradedComment) {
        this.updateForm(hybridGradedComment);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('gradeScopeIsticApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const hybridGradedComment = this.hybridGradedCommentFormService.getHybridGradedComment(this.editForm);
    if (hybridGradedComment.id !== null) {
      this.subscribeToSaveResponse(this.hybridGradedCommentService.update(hybridGradedComment));
    } else {
      this.subscribeToSaveResponse(this.hybridGradedCommentService.create(hybridGradedComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHybridGradedComment>>): void {
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

  protected updateForm(hybridGradedComment: IHybridGradedComment): void {
    this.hybridGradedComment = hybridGradedComment;
    this.hybridGradedCommentFormService.resetForm(this.editForm, hybridGradedComment);

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing(this.questionsSharedCollection, {
      id: hybridGradedComment.questionId,
    } as IQuestion);
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing(questions, { id: this.hybridGradedComment?.questionId } as IQuestion),
        ),
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));
  }
}
