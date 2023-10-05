/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { IQuestionType } from 'app/entities/question-type/question-type.model';
import { QuestionTypeService } from 'app/entities/question-type/service/question-type.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { Subscription, firstValueFrom, lastValueFrom } from 'rxjs';
import { IQuestion } from '../../../../entities/question/question.model';
import { EventHandlerService } from '../event-handler.service';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PreferenceService } from '../../../preference-page/preference.service';
import { OnDestroy } from '@angular/core';

type SelectableEntity = IQuestionType;
export type EntityResponseType = HttpResponse<IQuestion>;

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
        }),
      ),
      state(
        'visible',
        style({
          opacity: 1,
        }),
      ),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out')),
    ]),
  ],
})
export class QuestionpropertiesviewComponent implements OnInit, OnDestroy {
  /** The selected questions. This is an array since a same question can be divided into several parts.
   * The first question of the array, if not empty, is the truely selected question. An empty array means no selection. */
  public questions: Array<IQuestion> = [];
  public layoutsidebarVisible = false;
  public manualid = 2;
  public qcmid = 3;
  public isSaving = false;
  public questiontypes: IQuestionType[] = [];
  public editForm!: UntypedFormGroup;
  public readonly gradeTypeValues = Object.keys(GradeType);
  public readonly validexpRegex: () => RegExp = () => {
    if (this.editForm.get(['typeId'])!.value === this.qcmid) {
      return /^[a-z]{1}([&|][a-z])*$/;
    }
    return /[\s\S]*/;
  };
  public readonly pointmauvaiseReponeOptions = [
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
  public pasPointResponseOptions = [
    { name: '1', value: 1 },
    { name: '0,5 pt ', value: 2 },
    { name: '0,25 pt', value: 4 },
    { name: '0, 125 pt', value: 8 },
    { name: '0,0625 pt', value: 16 },
  ];

  @Output()
  public updatenumero: EventEmitter<string> = new EventEmitter<string>();

  private selectionSubscription: Subscription | undefined = undefined;

  constructor(
    private questionService: QuestionService,
    private questionTypeService: QuestionTypeService,
    private fb: UntypedFormBuilder,
    private eventHandler: EventHandlerService,
    private preferenceService: PreferenceService,
  ) {}

  public ngOnInit(): void {
    const pref = this.preferenceService.getPreferenceForQuestion();
    this.editForm = this.fb.group({
      id: [],
      numero: [null, [Validators.required]],
      point: [pref.point],
      step: [pref.step],
      validExpression: [''],
      libelle: [''],
      gradeType: [pref.gradeType],
      zoneId: [],
      typeId: [pref.typeId],
      examId: [],
    });

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

    this.selectionSubscription = this.eventHandler.getSelectedQuestion().subscribe(selectedQ => {
      if (selectedQ === undefined) {
        this.questions = [];
      } else {
        this.updateQuestions(selectedQ.id!, selectedQ.examId!, selectedQ.numero!);
      }
    });
  }

  private async updateQuestions(qid: number, examId: number, numero: number): Promise<void> {
    return firstValueFrom(this.questionService.query({ examId, numero }))
      .then(res => {
        const qs = res.body ?? [];
        const updatedQuestion = qs.find(q => q.id === qid)!;
        return [updatedQuestion, ...qs.filter(q => q.id !== qid)];
      })
      .then(res => {
        this.questions = res;
        if (this.questions.length > 0) {
          this.updateForm();
        }
      });
  }

  public ngOnDestroy(): void {
    this.selectionSubscription?.unsubscribe();
  }

  private updateForm(): void {
    const question = this.questions[0];

    this.editForm.patchValue(
      {
        numero: question.numero,
        point: question.point,
        step: question.step,
        validExpression: question.validExpression,
        libelle: question.libelle,
        gradeType: question.gradeType,
        typeId: question.typeId,
      },
      {
        emitEvent: false,
      },
    );

    // Need to update the UI of the step list
    this.updateStepList(question.point!);
  }

  private async save(): Promise<IQuestion[]> {
    this.isSaving = true;

    // No 'numero' update here
    this.questions.forEach(q => {
      q.point = this.editForm.get(['point'])!.value;
      q.step = this.editForm.get(['step'])!.value;
      q.validExpression = this.editForm.get(['validExpression'])!.value;
      q.libelle = this.editForm.get(['libelle'])!.value;
      q.gradeType = this.editForm.get(['gradeType'])!.value;
      q.typeId = this.editForm.get(['typeId'])!.value;
      console.error(q);
    });

    // Saving the current preferences
    if (this.questions.length > 0) {
      this.preferenceService.savePref4Question({
        point: this.questions[0].point!,
        step: this.questions[0].step!,
        gradeType: this.questions[0].gradeType!,
        typeId: this.questions[0].typeId!,
      });
    }

    // TODO In the back-end updating a question may update all the related questions
    // i.e. all the questions of the exam with the same 'numero'. This would avoid here
    // to update each question (with the same 'numero') through a REST query.
    return (
      Promise
        // Creating or updating the questions
        .all(this.questions.map(q => lastValueFrom(q.id === undefined ? this.questionService.create(q) : this.questionService.update(q))))
        // and then getting all the non-null resulting questions
        .then(res => res.map(r => r.body).filter((b): b is IQuestion => b !== null))
    );
  }

  private onSaveSuccess(updatedQuestions: Array<IQuestion>): void {
    this.questions = updatedQuestions;
    this.questions.forEach(q => {
      this.eventHandler.updateQuestion(q);
    });
    this.isSaving = false;
  }

  private onSaveError(): void {
    this.isSaving = false;
  }

  public trackById(_: number, item: SelectableEntity): any {
    return item.id;
  }

  /**
   * When interacting with widgets that change the content of the question (but the number)
   */
  public contentChangeCheck(): void {
    if (/^[a-z]{1}([&|][a-z])*$/.test(this.editForm.get(['validExpression'])!.value)) {
      this.contentChange();
    }
  }

  public contentChange(): void {
    this.save()
      .then(updatedQuestions => {
        this.onSaveSuccess(updatedQuestions);
      })
      .catch(() => {
        this.onSaveError();
      });
  }

  /**
   * When interacting with the number widget
   */
  public numberChange(): void {
    this.isSaving = true;
    const question = this.questions[0];
    const number = this.editForm.get(['numero'])!.value;

    question.numero = number;

    firstValueFrom(this.questionService.update(question))
      .then(() => this.updateQuestions(question.id!, question.examId!, number))
      .then(() => {
        if (this.questions.length > 1) {
          this.questions[0].gradeType = this.questions[1].gradeType;
          this.questions[0].point = this.questions[1].point;
          this.questions[0].step = this.questions[1].step;
          this.questions[0].typeId = this.questions[1].typeId;

          return firstValueFrom(this.questionService.update(this.questions[0]));
        }
        return Promise.resolve(new HttpResponse<IQuestion>());
      })
      .then(() => {
        this.eventHandler.setCurrentQuestionNumber(number);
        this.updatenumero.next(number);
        this.updateForm();
        this.isSaving = false;
      })
      .catch(() => {
        this.isSaving = false;
      });
  }

  public updateStepList(step: number): void {
    if (step % 1 === 0) {
      this.pasPointResponseOptions = [
        { name: '1', value: 1 },
        { name: '0,5 pt ', value: 2 },
        { name: '0,25 pt', value: 4 },
        { name: '0, 125 pt', value: 8 },
        { name: '0,0625 pt', value: 16 },
      ];
    } else if (step % 0.5 === 0) {
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

    const currentStep = this.editForm.get(['step'])!.value;

    // If the current step does not match the point value, we need to update the step
    if (this.pasPointResponseOptions.find(pas => pas.value === currentStep) === undefined) {
      this.editForm.patchValue({ step: this.pasPointResponseOptions[0].value }, { emitEvent: false });
    }
  }

  /**
   * When interacting with the point step widget
   */
  public pointChange(input: any): void {
    this.updateStepList(input.target.value);
    this.contentChange();
  }

  public changeQCM(): void {
    this.contentChange();

    if (this.editForm.get(['typeId'])!.value === this.qcmid) {
      this.editForm.controls['validExpression'].setValidators([Validators.required]);
      this.editForm.controls['validExpression'].updateValueAndValidity();
    } else {
      this.editForm.controls['validExpression'].setValidators(null);
      this.editForm.controls['validExpression'].updateValueAndValidity();
    }
  }
}
