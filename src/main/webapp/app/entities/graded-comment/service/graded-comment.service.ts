import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGradedComment, getGradedCommentIdentifier } from '../graded-comment.model';

export type EntityResponseType = HttpResponse<IGradedComment>;
export type EntityArrayResponseType = HttpResponse<IGradedComment[]>;

@Injectable({ providedIn: 'root' })
export class GradedCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/graded-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(gradedComment: IGradedComment): Observable<EntityResponseType> {
    return this.http.post<IGradedComment>(this.resourceUrl, gradedComment, { observe: 'response' });
  }

  update(gradedComment: IGradedComment): Observable<EntityResponseType> {
    return this.http.put<IGradedComment>(`${this.resourceUrl}`, gradedComment, {
      observe: 'response',
    });
  }

  partialUpdate(gradedComment: IGradedComment): Observable<EntityResponseType> {
    return this.http.patch<IGradedComment>(`${this.resourceUrl}/${getGradedCommentIdentifier(gradedComment) as number}`, gradedComment, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGradedComment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGradedComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGradedCommentToCollectionIfMissing(
    gradedCommentCollection: IGradedComment[],
    ...gradedCommentsToCheck: (IGradedComment | null | undefined)[]
  ): IGradedComment[] {
    const gradedComments: IGradedComment[] = gradedCommentsToCheck.filter(isPresent);
    if (gradedComments.length > 0) {
      const gradedCommentCollectionIdentifiers = gradedCommentCollection.map(
        gradedCommentItem => getGradedCommentIdentifier(gradedCommentItem)!
      );
      const gradedCommentsToAdd = gradedComments.filter(gradedCommentItem => {
        const gradedCommentIdentifier = getGradedCommentIdentifier(gradedCommentItem);
        if (gradedCommentIdentifier == null || gradedCommentCollectionIdentifiers.includes(gradedCommentIdentifier)) {
          return false;
        }
        gradedCommentCollectionIdentifiers.push(gradedCommentIdentifier);
        return true;
      });
      return [...gradedCommentsToAdd, ...gradedCommentCollection];
    }
    return gradedCommentCollection;
  }
}
