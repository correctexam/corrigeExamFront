/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
/* eslint-disable no-empty */
/* eslint-disable curly */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExamQuestPictureServiceService } from 'app/entities/exam-sheet/service/exam-quest-picture-service.service';
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
  constructor(
    private http: HttpClient,
    private questionTypeService: QuestionTypeService,
    private examQuestPictureService: ExamQuestPictureServiceService
  ) {}

  /**
   *
   * @param q  a question
   * @returns the associated EndPoint if it exists, An undefined promise otherwise
   */
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

  // EndPoint Example : http://127.0.0.1:8000/   (don't forget the last slash)

  public connectEndPointToQuestion(endpoint: string, question: IQuestion): Observable<StatusContentAPI> {
    if (question.examId === undefined || question.numero === undefined) {
      return new Observable();
    } else {
      const finalEndpoint: string = endpoint + 'status/exam/' + question.examId.toString() + '/question/' + question.numero.toString();
      return this.http.get<StatusContentAPI>(finalEndpoint);
    }
  }

  public sendQuestionToEndPoint(examId: number, align: boolean, question: IQuestion, endpoint: string): Promise<boolean> {
    return new Promise<boolean>(res => {
      this.connectEndPointToQuestion(endpoint, question).subscribe({
        next: () => {
          this.examQuestPictureService.questionAnswPNGs(examId, align, question).then(dataQuestionStudents => {
            if (dataQuestionStudents === undefined) res(false);
            else {
              // On vient de récupérer les données des réponses aux questions des étudiants
              // On peut donc recherher le template de cette question
              this.examQuestPictureService.questionPNGsTemplate(examId, question).then(dataTemplate => {
                if (dataTemplate === undefined) res(false);
                else {
                  const picturesTemplate = dataTemplate.templateCaptures;
                  this.declareQuestionContentToEndpoint(
                    examId,
                    question.numero!,
                    endpoint,
                    picturesTemplate,
                    dataQuestionStudents.studAns
                  ).then(verdict => {
                    if (!verdict) res(false);
                    else {
                      // On a déclaré tous les fichiers qui seront envoyés à l'API
                      // On peut maintenant tous les envoyer
                    }
                  });
                }
              });
            }
          });
        },
        error: () => {
          res(false);
        },
      });
    });
  }

  private declareQuestionContentToEndpoint(
    examId: number,
    numquest: number,
    endpoint: string,
    templatepics: File[],
    studAns: { studId: number; answser: File[] }[]
  ): Promise<boolean> {
    return new Promise<boolean>(res => {
      const templateNames = this.examQuestPictureService.getAllFileNames(templatepics);
      this.http
        .post<StatusContentAPI>(endpoint + 'create/template/', {
          examid: examId,
          numquest: numquest,
          templateName: templateNames,
        })
        .subscribe(statusTemplate => {
          if (statusTemplate.status === 'success') {
            const snrs: { studid: number; source: string[] }[] = [];
            studAns.forEach(sa => {
              const studid = sa.studId;
              const source: string[] = this.examQuestPictureService.getAllFileNames(sa.answser);
              snrs.push({ studid, source });
            });
            this.http
              .post<StatusContentAPI[]>(endpoint + 'create/studresps/', {
                examid: examId,
                numquest: numquest,
                srns: snrs,
              })
              .subscribe(dataStudResp => {
                let verdict = true;
                dataStudResp.forEach(dsr => {
                  if (dsr.status !== 'success') verdict = false;
                });
                res(verdict);
              });
          } else res(false);
        });
    });
  }
}
