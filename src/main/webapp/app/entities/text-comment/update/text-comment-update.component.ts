import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITextComment, TextComment } from '../text-comment.model';
import { TextCommentService } from '../service/text-comment.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor } from '@angular/common';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  selector: 'jhi-text-comment-update',
  templateUrl: './text-comment-update.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertErrorComponent, NgFor, FaIconComponent],
})
export class TextCommentUpdateComponent implements OnInit {
  isSaving = false;

  questions: IQuestion[] = [];

  editForm: UntypedFormGroup;

  constructor(
    protected textCommentService: TextCommentService,
    protected questionService: QuestionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
  ) {
    this.editForm = this.fb.group({
      id: [],
      text: [],
      description: [],
      zonegeneratedid: [],
      questionId: [],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ textComment }) => {
      this.updateForm(textComment);
      this.questionService.query().subscribe((res: HttpResponse<IQuestion[]>) => (this.questions = res.body || []));
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const textComment = this.createFromForm();
    if (textComment.id !== undefined) {
      this.subscribeToSaveResponse(this.textCommentService.update(textComment));
    } else {
      this.subscribeToSaveResponse(this.textCommentService.create(textComment));
    }
  }

  trackById(index: number, item: IQuestion): any {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITextComment>>): void {
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

  protected updateForm(textComment: ITextComment): void {
    this.editForm.patchValue({
      id: textComment.id,
      text: textComment.text,
      description: textComment.description,
      zonegeneratedid: textComment.zonegeneratedid,
      questionId: textComment.questionId,
    });
  }

  protected createFromForm(): ITextComment {
    return {
      ...new TextComment(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      description: this.editForm.get(['description'])!.value,
      zonegeneratedid: this.editForm.get(['zonegeneratedid'])!.value,
      questionId: this.editForm.get(['questionId'])!.value,
    };
  }
}
