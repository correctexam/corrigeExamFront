import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IQuestionType, QuestionType } from '../question-type.model';
import { QuestionTypeService } from '../service/question-type.service';

@Component({
  selector: 'jhi-question-type-update',
  templateUrl: './question-type-update.component.html',
})
export class QuestionTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    algoName: [null, [Validators.required]],
    endpoint: [],
    jsFunction: [],
  });

  constructor(protected questionTypeService: QuestionTypeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionType }) => {
      this.updateForm(questionType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const questionType = this.createFromForm();
    if (questionType.id !== undefined) {
      this.subscribeToSaveResponse(this.questionTypeService.update(questionType));
    } else {
      this.subscribeToSaveResponse(this.questionTypeService.create(questionType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionType>>): void {
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

  protected updateForm(questionType: IQuestionType): void {
    this.editForm.patchValue({
      id: questionType.id,
      algoName: questionType.algoName,
      endpoint: questionType.endpoint,
      jsFunction: questionType.jsFunction,
    });
  }

  protected createFromForm(): IQuestionType {
    return {
      ...new QuestionType(),
      id: this.editForm.get(['id'])!.value,
      algoName: this.editForm.get(['algoName'])!.value,
      endpoint: this.editForm.get(['endpoint'])!.value,
      jsFunction: this.editForm.get(['jsFunction'])!.value,
    };
  }
}
