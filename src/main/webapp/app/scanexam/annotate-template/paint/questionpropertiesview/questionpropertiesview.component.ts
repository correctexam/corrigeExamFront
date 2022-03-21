/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IQuestionType } from 'app/entities/question-type/question-type.model';
import { QuestionTypeService } from 'app/entities/question-type/service/question-type.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { Observable } from 'rxjs';
import { IQuestion } from '../../../../entities/question/question.model';
import { EventHandlerService } from '../event-handler.service';
import { ZoneService } from '../../../../entities/zone/service/zone.service';

type SelectableEntity = IQuestionType;

@Component({
  selector: 'jhi-questionpropertiesview',
  templateUrl: './questionpropertiesview.component.html',
  styleUrls: ['./questionpropertiesview.component.scss'],
})
export class QuestionpropertiesviewComponent implements OnInit {
  question: IQuestion | undefined;

  isSaving = false;
  questiontypes: IQuestionType[] = [];

  editForm = this.fb.group({
    id: [],
    numero: [null, [Validators.required]],
    point: [],
    zoneId: [],
    typeId: [],
    examId: [],
  });

  constructor(
    protected questionService: QuestionService,
    protected zoneService: ZoneService,
    protected questionTypeService: QuestionTypeService,
    private fb: FormBuilder,
    private eventHandler: EventHandlerService
  ) {}

  ngOnInit(): void {
    // this.updateForm(this.question);

    this.questionTypeService.query().subscribe((res: HttpResponse<IQuestionType[]>) => (this.questiontypes = res.body || []));
    this.eventHandler.registerQuestionCallBack(zid => {
      if (zid !== undefined) {
        this.questionService.query({ zoneId: zid }).subscribe(q => {
          if (q.body !== null && q.body.length > 0) {
            this.question = q.body[0];
            this.updateForm(this.question);
          }
        });
      } else {
        this.question = undefined;
      }
    });
  }

  updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      numero: question.numero,
      point: question.point,
      typeId: question.typeId,
    });
  }

  save(): void {
    this.isSaving = true;
    const question = this.createFromForm();
    if (question.id !== undefined) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  private createFromForm(): IQuestion {
    this.question!.numero = this.editForm.get(['numero'])!.value;
    this.question!.point = this.editForm.get(['point'])!.value;
    this.question!.typeId = this.editForm.get(['typeId'])!.value;
    return this.question!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
