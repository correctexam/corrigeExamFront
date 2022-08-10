/* eslint-disable object-shorthand */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IQuestionType } from 'app/entities/question-type/question-type.model';
import { QuestionTypeService } from 'app/entities/question-type/service/question-type.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { Observable } from 'rxjs';
import { IQuestion } from '../../../../entities/question/question.model';
import { EventHandlerService } from '../event-handler.service';
import { ZoneService } from '../../../../entities/zone/service/zone.service';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { QuestionTypeInteractionService } from 'app/entities/question-type/service/question-type-interaction.service';
import { MessageService } from 'primeng/api';

type SelectableEntity = IQuestionType;

@Component({
  selector: 'jhi-questionpropertiesview',
  templateUrl: './questionpropertiesview.component.html',
  styleUrls: ['./questionpropertiesview.component.scss'],
  providers: [MessageService],
})
export class QuestionpropertiesviewComponent implements OnInit {
  question: IQuestion | undefined;
  gradeTypeValues = Object.keys(GradeType);

  isSaving = false;
  questiontypes: IQuestionType[] = [];

  @Output()
  updatenumero: EventEmitter<string> = new EventEmitter<string>();

  editForm = this.fb.group({
    id: [],
    numero: [null, [Validators.required]],
    point: [2],
    step: [4],
    gradeType: [GradeType.DIRECT],
    zoneId: [],
    typeId: [],
    examId: [],
  });

  constructor(
    protected questionTypeInteractionService: QuestionTypeInteractionService,
    protected questionService: QuestionService,
    protected messageService: MessageService,
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

  numeroUpdate(): any {
    //    this.updatenumero.emit(this.editForm.get(['numero'])!.value)
    // eslint-disable-next-line no-console
    //    console.log(this.editForm.get(['numero'])!.value)
  }

  updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      numero: question.numero,
      point: question.point,
      step: question.step,
      gradeType: question.gradeType,
      typeId: question.typeId,
    });
  }

  save(): void {
    this.isSaving = true;
    const question = this.createFromForm();
    // Save of the question type associated to the current question in the database
    if (question.id !== undefined) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
    this.questionTypeInteractionService.getQuestEndPoint(question).then(url => {
      console.log(url);
    });
    // call of the associated service if there is one
    /* this.questionTypeInteractionService.loadQuestionTemplate(question, this.questionTypeService).then(sendPossible => {
      if (sendPossible) {
        this.questionTypeInteractionService.sendQuestionTemplate(question).subscribe({
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'API innaccessible',
              detail: "L'API située à l'adresse " + this.questionTypeInteractionService.getCurrentURL() + " n'a pas pu être atteinte",
            });
          }, // errorHandler
          next: infotemplate => {
            // On envoie le template s'il n'a pas déjà été envoyé à l'API de la question
            const template = this.questionTypeInteractionService.getCurrentTemplate();
            if (!infotemplate['template_loadded'] && template !== undefined) {
              this.questionTypeInteractionService
                .sendTemplate(this.questionTypeInteractionService.getCurrentURL(), template)
                .subscribe(data => {
                  if (data['save'] === 'success') {
                    this.messageService.add({
                      severity: 'success',
                      summary: "Envoi du template vers l'API",
                      detail: 'Export réussi',
                    });
                  } else {
                    this.messageService.add({
                      severity: 'error',
                      summary: "Envoi du template vers l'API",
                      detail: 'Export échoué',
                    });
                  }
                });
            }
            if (infotemplate['question_loadded']) {
              this.messageService.add({
                severity: 'success',
                summary: "Envoi de la question vers l'API",
                detail: 'Export réussi',
              });
            } else {
              console.log(infotemplate);
              this.messageService.add({
                severity: 'error',
                summary: "Envoi de la question vers l'API",
                detail: 'Export échoué',
              });
            }
          }, // nextHandler
        });
      }
    });*/
  }

  /**
   *
   infotemplate => {

        }
   */

  private createFromForm(): IQuestion {
    this.question!.numero = this.editForm.get(['numero'])!.value;
    this.question!.point = this.editForm.get(['point'])!.value;
    this.question!.step = this.editForm.get(['step'])!.value;
    this.question!.gradeType = this.editForm.get(['gradeType'])!.value;

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
    // eslint-disable-next-line no-console
    this.eventHandler.setCurrentQuestionNumber(this.editForm.get(['numero'])!.value);
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
