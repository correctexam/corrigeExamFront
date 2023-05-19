/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { IQuestionType } from 'app/entities/question-type/question-type.model';
import { QuestionTypeService } from 'app/entities/question-type/service/question-type.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { Observable, Subject, debounceTime, switchMap, takeUntil } from 'rxjs';
import { IQuestion } from '../../../../entities/question/question.model';
import { EventHandlerService } from '../event-handler.service';
import { ZoneService } from '../../../../entities/zone/service/zone.service';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PreferenceService } from '../../../preference-page/preference.service';
import { EntityResponseType } from 'app/entities/course/service/course.service';

type SelectableEntity = IQuestionType;

@Component({
  selector: 'jhi-questionpropertiesview',
  templateUrl: './questionpropertiesview.component.html',
  styleUrls: ['./questionpropertiesview.component.scss'],
  animations: [
    trigger('errorState', [
      state(
        'hidden',
        style({
          opacity: 0,
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
        })
      ),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out')),
    ]),
  ],
})
export class QuestionpropertiesviewComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  question: IQuestion | undefined;
  gradeTypeValues = Object.keys(GradeType);

  manualid = 2;
  qcmid = 3;
  //  validexp = '';
  validexpRegex: () => RegExp = () => {
    if (this.editForm.get(['typeId'])!.value === this.qcmid) {
      return /^[a-z]{1}([&|][a-z])*$/;
    } else {
      return /[\s\S]*/;
    }
  };
  //  validexpRegex  = /[a-z]{1}[a-z&|]*[a-z]$/;

  pointmauvaiseReponeOptions = [
    { name: '- 0', value: -1 },
    { name: '- 1', value: 1 },
    { name: '- 1/2 ', value: 2 },
    { name: '- 1/3', value: 3 },
    { name: '- 1/4', value: 4 },
    { name: '- 1/5', value: 5 },
    { name: '- 1/6', value: 6 },
    { name: '- 1/8', value: 8 },
    { name: '- 1/10', value: 10 },
  ];
  pasPointResponseOptions = [
    { name: '1', value: 1 },
    { name: '0,5 pt ', value: 2 },
    { name: '0,25 pt', value: 4 },
    { name: '0, 125 pt', value: 8 },
    { name: '0,0625 pt', value: 16 },
  ];

  isSaving = false;
  questiontypes: IQuestionType[] = [];

  @Output()
  updatenumero: EventEmitter<string> = new EventEmitter<string>();

  editForm!: UntypedFormGroup;

  constructor(
    protected questionService: QuestionService,
    protected zoneService: ZoneService,
    protected questionTypeService: QuestionTypeService,
    private fb: UntypedFormBuilder,
    private eventHandler: EventHandlerService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    const pref = this.preferenceService.getPreferenceForQuestion();
    this.editForm = this.fb.group({
      id: [],
      numero: [null, [Validators.required]],
      point: [pref.point],
      step: [pref.step],
      validExpression: [''],
      gradeType: [pref.gradeType],
      zoneId: [],
      typeId: [pref.typeId],
      examId: [],
    });
    this.editForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(() => this.save()),
        takeUntil(this.unsubscribe)
        // eslint-disable-next-line no-console
      )
      .subscribe(() => this.onSaveSuccess());

    // this.updateForm(this.question);

    this.questionTypeService.query().subscribe((res: HttpResponse<IQuestionType[]>) => {
      this.questiontypes = res.body || [];
      this.questiontypes.forEach(q => {
        if (q.algoName === 'manual') {
          this.manualid = q.id!;
        } else if (q.algoName === 'QCM') {
          this.qcmid = q.id!;
        }
      });
    });
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      numero: question.numero,
      point: question.point,
      step: question.step,
      validExpression: question.validExpression,
      gradeType: question.gradeType,
      typeId: question.typeId,
    });
  }

  save(): Observable<EntityResponseType> {
    this.isSaving = true;
    const question = this.createFromForm();
    this.preferenceService.savePref4Question({
      point: question.point!,
      step: question.step!,
      gradeType: question.gradeType!,
      typeId: question.typeId!,
    });

    if (question.id !== undefined) {
      return this.questionService.update(question);
      //      this.subscribeToSaveResponse();
    } else {
      return this.questionService.create(question);
    }
  }

  private createFromForm(): IQuestion {
    this.question!.numero = this.editForm.get(['numero'])!.value;
    this.question!.point = this.editForm.get(['point'])!.value;
    this.question!.step = this.editForm.get(['step'])!.value;
    this.question!.validExpression = this.editForm.get(['validExpression'])!.value;
    this.question!.gradeType = this.editForm.get(['gradeType'])!.value;

    this.question!.typeId = this.editForm.get(['typeId'])!.value;
    return this.question!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
    result.subscribe({
      complete: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventHandler.setCurrentQuestionNumber(this.editForm.get(['numero'])!.value);
    this.updatenumero.next(this.editForm.get(['numero'])!.value);
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  pointChange($event: any): void {
    if ($event.target.value % 1 === 0) {
      this.pasPointResponseOptions = [
        { name: '1', value: 1 },
        { name: '0,5 pt ', value: 2 },
        { name: '0,25 pt', value: 4 },
        { name: '0, 125 pt', value: 8 },
        { name: '0,0625 pt', value: 16 },
      ];
    } else if ($event.target.value % 0.5 === 0) {
      this.pasPointResponseOptions = [
        { name: '0,5 pt ', value: 2 },
        { name: '0,25 pt', value: 4 },
        { name: '0, 125 pt', value: 8 },
        { name: '0,0625 pt', value: 16 },
      ];
    } else {
      this.pasPointResponseOptions = [
        { name: '0,25 pt', value: 4 },
        { name: '0, 125 pt', value: 8 },
        { name: '0,0625 pt', value: 16 },
      ];
    }
  }

  changeQCM(): any {
    if (this.editForm.get(['typeId'])!.value === this.qcmid) {
      this.editForm.controls['validExpression'].setValidators([Validators.required]);
      this.editForm.controls['validExpression'].updateValueAndValidity();
    } else {
      this.editForm.controls['validExpression'].setValidators(null);
      this.editForm.controls['validExpression'].updateValueAndValidity();
    }
  }
}
