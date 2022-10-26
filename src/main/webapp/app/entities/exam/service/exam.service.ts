import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExam, getExamIdentifier } from '../exam.model';

export type EntityResponseType = HttpResponse<IExam>;
export type EntityArrayResponseType = HttpResponse<IExam[]>;

@Injectable({ providedIn: 'root' })
export class ExamService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(exam: IExam): Observable<EntityResponseType> {
    return this.http.post<IExam>(this.resourceUrl, exam, { observe: 'response' });
  }

  update(exam: IExam): Observable<EntityResponseType> {
    return this.http.put<IExam>(`${this.resourceUrl}`, exam, { observe: 'response' });
  }

  partialUpdate(exam: IExam): Observable<EntityResponseType> {
    return this.http.patch<IExam>(`${this.resourceUrl}/${getExamIdentifier(exam) as number}`, exam, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExam>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    // eslint-disable-next-line no-console
    return this.http.get<IExam[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  deleteAllExamSheets(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}` + '/cleanAllStudentSheet' + `/${id}`, { observe: 'response' });
  }

  deleteAllAnswerAndComment(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(this.applicationConfigService.getEndpointFor('api') + '/deleteAllAnswerAndComment' + `/${id}`, {
      observe: 'response',
    });
  }

  addExamToCollectionIfMissing(examCollection: IExam[], ...examsToCheck: (IExam | null | undefined)[]): IExam[] {
    const exams: IExam[] = examsToCheck.filter(isPresent);
    if (exams.length > 0) {
      const examCollectionIdentifiers = examCollection.map(examItem => getExamIdentifier(examItem)!);
      const examsToAdd = exams.filter(examItem => {
        const examIdentifier = getExamIdentifier(examItem);
        if (examIdentifier == null || examCollectionIdentifiers.includes(examIdentifier)) {
          return false;
        }
        examCollectionIdentifiers.push(examIdentifier);
        return true;
      });
      return [...examsToAdd, ...examCollection];
    }
    return examCollection;
  }
}
