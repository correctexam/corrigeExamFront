/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
/* eslint-disable no-empty */
/* eslint-disable curly */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuestion } from 'app/entities/question/question.model';
import { Observable } from 'rxjs';
import { QuestionTypeService } from './question-type.service';

export interface StatusContentAPI {
  status: string;
  reason?: string;
  examId?: number;
  questnum?: number;
  exists?: boolean;
}

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

  public connectEndPointToQuestion(endpoint: string, question: IQuestion): Observable<StatusContentAPI> {
    if (question.examId === undefined || question.numero === undefined) {
      return new Observable();
    } else {
      const finalEndpoint: string = endpoint + 'status/exam/' + question.examId.toString() + '/question/' + question.numero.toString();
      return this.http.get<StatusContentAPI>(finalEndpoint);
    }
  }
}
