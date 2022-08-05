/* eslint-disable curly */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuestion } from '../../question/question.model';
import { QuestionService } from '../../question/service/question.service';
import { Observable } from 'rxjs';
import { QuestionTypeService } from './question-type.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionTypeInteractionService {
  // Attention, il peut y avoir un problème d'erreur CORS
  // Il doivent être réglés depuis l'API (et non depuis le navigateur)

  constructor(private http: HttpClient, private questionService: QuestionService, private questionTypeService: QuestionTypeService) {}

  private currentTemplate: string | undefined;
  private currentUrlEndPoint = '';
  private currentExamId = -1;
  private currentExamName = '';

  getCurrentURL(): string {
    return this.currentUrlEndPoint;
  }
  getCurrentTemplate(): string | undefined {
    return this.currentTemplate;
  }

  // Fonction de test, permet de vérifier que la connection avec l'API se fait bien
  greetings(urlQuestionType: string): Observable<any> {
    return this.http.get(urlQuestionType + 'greetings/');
  }
  greetingsPost(urlQuestionType: string): Observable<any> {
    return this.http.post(urlQuestionType + 'greetings/', {});
  }

  sendQuestionTemplate(question: IQuestion): Observable<any> {
    return this.http.post(this.currentUrlEndPoint + 'questiontemplate/', question);
  }

  /**
   *
   * @param question
   * @returns Promise with a value that indicates if the question has been well loaded
   */
  loadQuestionTemplate(question: IQuestion, questionTypeService: QuestionTypeService): Promise<boolean> {
    this.questionTypeService = questionTypeService;
    return new Promise<boolean>(res => {
      if (question.typeId === undefined) {
        res(false);
      } else {
        this.questionTypeService.find(question.typeId).subscribe(rep => {
          //  recuperation of the endpoint associated to this type of question
          this.questionTypeService.query(rep.url).subscribe(questionsTypeList => {
            questionsTypeList.body?.forEach(questtype => {
              if (questtype.id === question.typeId) {
                const urlEndPoint = questtype.endpoint;
                if (urlEndPoint !== null && urlEndPoint !== undefined && urlEndPoint.length > 0) {
                  this.currentUrlEndPoint = urlEndPoint;
                  if (question.examId !== undefined) this.currentExamId = question.examId;
                  if (question.examName !== undefined) this.currentExamName = question.examName;
                  res(true);
                }
              }
            });
            res(false);
          });
        });
      }
    });
  }

  loadTemplate(base64String: string): void {
    this.currentTemplate = base64String;
  }

  sendTemplate(urlQuestionType: string, template64: string): Observable<any> {
    const templateBlob = this.b64toBlob(template64, 'application/pdf');
    const templateFile = new File([templateBlob], 'template-' + this.currentExamId.toString() + '.pdf', { type: templateBlob.type });
    const formData = new FormData();
    formData.append('clientfile', templateFile);
    return this.http.post(urlQuestionType + 'uploadpdf/', formData);
  }

  private b64toBlob(b64Data: string, contentType: string): Blob {
    const byteCharacters = window.atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    return blob;
  }
}
