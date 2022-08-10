/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
/* eslint-disable no-empty */
/* eslint-disable curly */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionTypeService } from './question-type.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionTypeInteractionService {
  constructor(private http: HttpClient, private questionTypeService: QuestionTypeService) {}

  public getQuestEndPoint(q: IQuestion): Promise<string | undefined> {
    return new Promise<string | undefined>(res => {
      if (q.typeId === undefined) {
        res(undefined);
        return;
      } else {
        this.questionTypeService.find(q.typeId).forEach(repQtype => {
          this.questionTypeService.query(repQtype.url).subscribe(reqQuestionTypeList => {
            if (reqQuestionTypeList.body === null) {
              res(undefined);
              return;
            } else {
              reqQuestionTypeList.body.forEach(qtype => {
                if (qtype.id === q.typeId && qtype.endpoint !== undefined && qtype.endpoint !== null && qtype.endpoint.length > 0) {
                  res(qtype.endpoint);
                  return;
                }
              });
              res(undefined);
            }
          });
        });
      }
    });
  }
}
