import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComments, getCommentsIdentifier } from '../comments.model';

export type EntityResponseType = HttpResponse<IComments>;
export type EntityArrayResponseType = HttpResponse<IComments[]>;

@Injectable({ providedIn: 'root' })
export class CommentsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(comments: IComments): Observable<EntityResponseType> {
    return this.http.post<IComments>(this.resourceUrl, comments, { observe: 'response' });
  }

  update(comments: IComments): Observable<EntityResponseType> {
    return this.http.put<IComments>(`${this.resourceUrl}/${getCommentsIdentifier(comments) as number}`, comments, { observe: 'response' });
  }

  partialUpdate(comments: IComments): Observable<EntityResponseType> {
    return this.http.patch<IComments>(`${this.resourceUrl}/${getCommentsIdentifier(comments) as number}`, comments, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IComments>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IComments[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCommentsToCollectionIfMissing(commentsCollection: IComments[], ...commentsToCheck: (IComments | null | undefined)[]): IComments[] {
    const comments: IComments[] = commentsToCheck.filter(isPresent);
    if (comments.length > 0) {
      const commentsCollectionIdentifiers = commentsCollection.map(commentsItem => getCommentsIdentifier(commentsItem)!);
      const commentsToAdd = comments.filter(commentsItem => {
        const commentsIdentifier = getCommentsIdentifier(commentsItem);
        if (commentsIdentifier == null || commentsCollectionIdentifiers.includes(commentsIdentifier)) {
          return false;
        }
        commentsCollectionIdentifiers.push(commentsIdentifier);
        return true;
      });
      return [...commentsToAdd, ...commentsCollection];
    }
    return commentsCollection;
  }
}
