import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQuestionType, getQuestionTypeIdentifier } from '../question-type.model';

export type EntityResponseType = HttpResponse<IQuestionType>;
export type EntityArrayResponseType = HttpResponse<IQuestionType[]>;

@Injectable({ providedIn: 'root' })
export class QuestionTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/question-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(questionType: IQuestionType): Observable<EntityResponseType> {
    return this.http.post<IQuestionType>(this.resourceUrl, questionType, { observe: 'response' });
  }

  update(questionType: IQuestionType): Observable<EntityResponseType> {
    return this.http.put<IQuestionType>(`${this.resourceUrl}`, questionType, {
      observe: 'response',
    });
  }

  partialUpdate(questionType: IQuestionType): Observable<EntityResponseType> {
    return this.http.patch<IQuestionType>(`${this.resourceUrl}/${getQuestionTypeIdentifier(questionType) as number}`, questionType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuestionType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQuestionType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addQuestionTypeToCollectionIfMissing(
    questionTypeCollection: IQuestionType[],
    ...questionTypesToCheck: (IQuestionType | null | undefined)[]
  ): IQuestionType[] {
    const questionTypes: IQuestionType[] = questionTypesToCheck.filter(isPresent);
    if (questionTypes.length > 0) {
      const questionTypeCollectionIdentifiers = questionTypeCollection.map(
        questionTypeItem => getQuestionTypeIdentifier(questionTypeItem)!
      );
      const questionTypesToAdd = questionTypes.filter(questionTypeItem => {
        const questionTypeIdentifier = getQuestionTypeIdentifier(questionTypeItem);
        if (questionTypeIdentifier == null || questionTypeCollectionIdentifiers.includes(questionTypeIdentifier)) {
          return false;
        }
        questionTypeCollectionIdentifiers.push(questionTypeIdentifier);
        return true;
      });
      return [...questionTypesToAdd, ...questionTypeCollection];
    }
    return questionTypeCollection;
  }
}
