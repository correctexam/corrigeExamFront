import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQuestion, getQuestionIdentifier } from '../question.model';

export type EntityResponseType = HttpResponse<IQuestion>;
export type EntityArrayResponseType = HttpResponse<IQuestion[]>;

@Injectable({ providedIn: 'root' })
export class QuestionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/questions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(question: IQuestion): Observable<EntityResponseType> {
    return this.http.post<IQuestion>(this.resourceUrl, question, { observe: 'response' });
  }

  update(question: IQuestion): Observable<EntityResponseType> {
    return this.http.put<IQuestion>(`${this.resourceUrl}/${getQuestionIdentifier(question) as number}`, question, { observe: 'response' });
  }

  partialUpdate(question: IQuestion): Observable<EntityResponseType> {
    return this.http.patch<IQuestion>(`${this.resourceUrl}/${getQuestionIdentifier(question) as number}`, question, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuestion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQuestion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addQuestionToCollectionIfMissing(questionCollection: IQuestion[], ...questionsToCheck: (IQuestion | null | undefined)[]): IQuestion[] {
    const questions: IQuestion[] = questionsToCheck.filter(isPresent);
    if (questions.length > 0) {
      const questionCollectionIdentifiers = questionCollection.map(questionItem => getQuestionIdentifier(questionItem)!);
      const questionsToAdd = questions.filter(questionItem => {
        const questionIdentifier = getQuestionIdentifier(questionItem);
        if (questionIdentifier == null || questionCollectionIdentifiers.includes(questionIdentifier)) {
          return false;
        }
        questionCollectionIdentifiers.push(questionIdentifier);
        return true;
      });
      return [...questionsToAdd, ...questionCollection];
    }
    return questionCollection;
  }
}
