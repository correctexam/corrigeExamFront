import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITextComment, getTextCommentIdentifier } from '../text-comment.model';

export type EntityResponseType = HttpResponse<ITextComment>;
export type EntityArrayResponseType = HttpResponse<ITextComment[]>;

@Injectable({ providedIn: 'root' })
export class TextCommentService {
  protected resourceUrl: string;

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/text-comments');
  }

  create(textComment: ITextComment): Observable<EntityResponseType> {
    return this.http.post<ITextComment>(this.resourceUrl, textComment, { observe: 'response' });
  }

  update(textComment: ITextComment): Observable<EntityResponseType> {
    return this.http.put<ITextComment>(this.resourceUrl, textComment, {
      observe: 'response',
    });
  }

  partialUpdate(textComment: ITextComment): Observable<EntityResponseType> {
    return this.http.patch<ITextComment>(`${this.resourceUrl}/${getTextCommentIdentifier(textComment) as number}`, textComment, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITextComment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITextComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  countHowManyUse(id: number): Observable<number> {
    return this.http.get<number>(`${this.resourceUrl}/countHowManyUse/${id}`);
  }

  addTextCommentToCollectionIfMissing(
    textCommentCollection: ITextComment[],
    ...textCommentsToCheck: (ITextComment | null | undefined)[]
  ): ITextComment[] {
    const textComments: ITextComment[] = textCommentsToCheck.filter(isPresent);
    if (textComments.length > 0) {
      const textCommentCollectionIdentifiers = textCommentCollection.map(textCommentItem => getTextCommentIdentifier(textCommentItem)!);
      const textCommentsToAdd = textComments.filter(textCommentItem => {
        const textCommentIdentifier = getTextCommentIdentifier(textCommentItem);
        if (textCommentIdentifier == null || textCommentCollectionIdentifiers.includes(textCommentIdentifier)) {
          return false;
        }
        textCommentCollectionIdentifiers.push(textCommentIdentifier);
        return true;
      });
      return [...textCommentsToAdd, ...textCommentCollection];
    }
    return textCommentCollection;
  }
}
