/* eslint-disable @typescript-eslint/member-ordering */

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { IHybridGradedComment } from 'app/entities/hybrid-graded-comment/hybrid-graded-comment.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { KeyFilterModule } from 'primeng/keyfilter';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateDirective } from '../../../../shared/language/translate.directive';
import { AlertErrorComponent } from '../../../../shared/alert/alert-error.component';
import { NgIf, NgFor } from '@angular/common';
import { CreateCommentsComponent } from '../../create-comments/create-comments.component';
import { DrawerModule } from 'primeng/drawer';

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
  standalone: true,
  imports: [
    DrawerModule,
    CreateCommentsComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    AlertErrorComponent,
    TranslateDirective,
    TooltipModule,
    InputTextModule,
    NgFor,
    ListboxModule,
    KnobModule,
    KeyFilterModule,
    MessageModule,
    CheckboxModule,
    ToggleSwitchModule,
    Button,
    TranslateModule,
  ],
})
export class QuestionpropertiesviewComponent implements OnInit, OnDestroy {
  /** The selected questions. This is an array since a same question can be divided into several parts.
   * The first question of the array, if not empty, is the truely selected question. An empty array means no selection. */
  public questions: Array<IQuestion> = [];

  @Input()
  public alreadyInASideBar = false;

  @Input()
  public questionsInput: Array<IQuestion> = [];

  @Input()
  public canUpdateNumero = true;

  public layoutsidebarVisible = false;
  public manualid = 2;
  public qcmid = 3;
  public manuscritid = 4;
  readonly hybrid = GradeType.HYBRID;

  public disableGradeType: boolean | null = false;
  public disableNumero: boolean | null = false;
  public disablePoint: boolean | null = false;
  public disableStep: boolean | null = false;
  public disableCanExceed: boolean = false;
  public disableMin0: boolean = false;
  public disableIgnoreBareme: boolean = false;

  public forceEdit: boolean = false;

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

  @Output()
  public updatedQuestions: EventEmitter<Array<IQuestion>> = new EventEmitter<Array<IQuestion>>();

  @Output()
  addTextComment: EventEmitter<ITextComment> = new EventEmitter<ITextComment>();
  @Output()
  addGradedComment: EventEmitter<IGradedComment> = new EventEmitter<IGradedComment>();
  @Output()
  addHybridGradedComment: EventEmitter<IHybridGradedComment> = new EventEmitter<IHybridGradedComment>();

  @Output()
  updateTextComment: EventEmitter<ITextComment> = new EventEmitter<ITextComment>();
  @Output()
  updateGradedComment: EventEmitter<IGradedComment> = new EventEmitter<IGradedComment>();
  @Output()
  updateHybridGradedComment: EventEmitter<IHybridGradedComment> = new EventEmitter<IHybridGradedComment>();

  @Input()
  couldDelete = true;

  addTextCommentM($event: ITextComment): void {
    this.addTextComment.emit($event);
  }
  updateTextCommentM($event: ITextComment): void {
    this.updateTextComment.emit($event);
  }
  addGradedCommentM($event: IGradedComment): void {
    this.addGradedComment.emit($event);
  }
  updateGradedCommentM($event: IGradedComment): void {
    this.updateGradedComment.emit($event);
  }
  addHybridGradedCommentM($event: IHybridGradedComment): void {
    this.addHybridGradedComment.emit($event);
  }
  updateHybridGradedCommentM($event: IHybridGradedComment): void {
    this.updateHybridGradedComment.emit($event);
  }

  private selectionSubscription: Subscription | undefined = undefined;

  @Input()
  eventHandler?: EventHandlerService;

  constructor(
    private questionService: QuestionService,
    private questionTypeService: QuestionTypeService,
    private fb: UntypedFormBuilder,
    //    private eventHandler: EventHandlerService,
    private preferenceService: PreferenceService,
    private zoneService: ZoneService,
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
      defaultpoint: [pref.defaultpoint],
      randomHorizontalCorrection: [false],
      canBeNegative: [false],
      canExceedTheMax: [false],
      mustBeIgnoreInGlobalScale: [false],
    });

    this.questionTypeService.query().subscribe((res: HttpResponse<IQuestionType[]>) => {
      this.questiontypes = res.body || [];
      console.log('Question Types:', this.questiontypes);
      this.questiontypes.forEach(q => {
        console.log('Algo Name: ', q.algoName);
        if (q.algoName === 'manual') {
          console.log('I chose manual');
          this.manualid = q.id!;
        } else if (q.algoName === 'QCM') {
          console.log('I chose QCM');
          this.qcmid = q.id!;
        } else if (q.algoName === 'manuscrit') {
          console.log('I chose manuscrit');
          this.manuscritid = q.id!;
        }
      });
    });

    this.selectionSubscription = this.eventHandler?.getSelectedQuestion().subscribe(selectedQ => {
      this.disableGradeType = null;
      this.disableNumero = null;
      this.disablePoint = null;
      this.disableStep = null;
      this.disableCanExceed = false;
      this.disableMin0 = false;
      this.disableIgnoreBareme = false;

      this.forceEdit = false;

      if (selectedQ === undefined) {
        this.questions = [];
      } else {
        this.updateQuestions(selectedQ.id!, selectedQ.examId!, selectedQ.numero!);
      }
    });

    if (this.questionsInput.length > 0) {
      this.questions = this.questionsInput;
      this.updateForm();
    }
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
    if (question.zoneId !== undefined) {
      firstValueFrom(this.zoneService.countStudentResponseForZone(question.zoneId)).then(count => {
        if (count.body! > 0 && !this.forceEdit) {
          this.disableGradeType = true;
          this.disableNumero = true;

          if (question.typeId !== this.qcmid) {
            this.disableStep = true;

            if (question.gradeType === GradeType.DIRECT) {
              this.disablePoint = true;
            } else if (question.gradeType === GradeType.HYBRID) {
              this.disablePoint = true;
              this.disableCanExceed = true;
              this.disableMin0 = true;
              this.disableIgnoreBareme = true;
            } else {
              this.disablePoint = true;
            }
          } else {
            this.disableStep = false;
          }
        } else {
          this.disableGradeType = false;
          this.disableNumero = false;
          this.disableStep = false;
          this.disablePoint = false;
          this.disableCanExceed = false;
          this.disableMin0 = false;
          this.disableIgnoreBareme = false;
        }
      });
    }

    this.editForm.patchValue(
      {
        numero: question.numero,
        point: question.point,
        step: question.step,
        validExpression: question.validExpression,
        libelle: question.libelle,
        gradeType: question.gradeType,
        typeId: question.typeId,
        defaultpoint: question.defaultpoint,
        randomHorizontalCorrection: question.randomHorizontalCorrection,
        canExceedTheMax: question.canExceedTheMax ? question.canExceedTheMax : false,
        canBeNegative: question.canBeNegative ? question.canBeNegative : false,
        mustBeIgnoreInGlobalScale: question.mustBeIgnoreInGlobalScale ? question.mustBeIgnoreInGlobalScale : false,
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
      q.defaultpoint = this.editForm.get(['defaultpoint'])?.value;
      q.randomHorizontalCorrection = this.editForm.get(['randomHorizontalCorrection'])?.value;
      q.canExceedTheMax = this.editForm.get(['canExceedTheMax'])?.value;
      q.canBeNegative = this.editForm.get(['canBeNegative'])?.value;
      q.mustBeIgnoreInGlobalScale = this.editForm.get(['mustBeIgnoreInGlobalScale'])?.value;
    });

    // Saving the current preferences
    if (this.questions.length > 0) {
      this.preferenceService.savePref4Question({
        point: this.questions[0].point!,
        step: this.questions[0].step!,
        gradeType: this.questions[0].gradeType!,
        typeId: this.questions[0].typeId!,
        defaultpoint: this.questions[0].defaultpoint!,
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
      this.eventHandler?.updateQuestion(q);
    });
    this.isSaving = false;
    this.updatedQuestions.emit(updatedQuestions);
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
  public randomContentChange(): void {
    if (this.questions.length > 0 && this.questions[0]?.examId) {
      const question = this.questions[0];
      this.preferenceService.cleanRandomOrderForQuestion(question.examId!);
    }
    this.contentChange();
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
    if (this.questions.length > 0 && this.questions[0]?.examId) {
      const question = this.questions[0];
      this.preferenceService.cleanRandomOrderForQuestion(question.examId!);
    }

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
          this.questions[0].libelle = this.questions[1].libelle;
          this.questions[0].defaultpoint = this.questions[1].defaultpoint!;
          this.questions[0].randomHorizontalCorrection = this.questions[1].randomHorizontalCorrection!;
          this.questions[0].canBeNegative = this.questions[1].canBeNegative!;
          this.questions[0].canExceedTheMax = this.questions[1].canExceedTheMax!;
          this.questions[0].mustBeIgnoreInGlobalScale = this.questions[1].mustBeIgnoreInGlobalScale!;

          return firstValueFrom(this.questionService.update(this.questions[0]));
        }
        return Promise.resolve(new HttpResponse<IQuestion>());
      })
      .then(() => {
        this.eventHandler?.setCurrentQuestionNumber(number);
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
    if (this.editForm.get(['typeId'])!.value !== this.qcmid) {
      if (this.pasPointResponseOptions.find(pas => pas.value === currentStep) === undefined) {
        this.editForm.patchValue({ step: this.pasPointResponseOptions[0].value }, { emitEvent: false });
      }
    }
  }

  /**
   * When interacting with the point step widget
   */
  public pointChange(input: any): void {
    this.updateStepList(input.target.value);
    this.contentChange();
  }

  /**
   * When interacting with the point step widget
   */
  public defaultpointChange(): void {
    // this.updateStepList(input.target.value);
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

  changeForceEdit(): void {
    if (this.forceEdit) {
      this.disableGradeType = false;
      this.disableNumero = false;
      this.disablePoint = false;
      this.disableStep = false;
      this.disableCanExceed = false;
      this.disableMin0 = false;
      this.disableIgnoreBareme = false;
    } else {
      this.updateForm();
    }
  }

  editComment($event: MouseEvent): void {
    $event.preventDefault();
    this.layoutsidebarVisible = true;
  }
}
