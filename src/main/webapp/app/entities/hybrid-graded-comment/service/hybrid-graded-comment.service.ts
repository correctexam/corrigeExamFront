import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHybridGradedComment, NewHybridGradedComment } from '../hybrid-graded-comment.model';

export type PartialUpdateHybridGradedComment = Partial<IHybridGradedComment> & Pick<IHybridGradedComment, 'id'>;

export type EntityResponseType = HttpResponse<IHybridGradedComment>;
export type EntityArrayResponseType = HttpResponse<IHybridGradedComment[]>;

@Injectable({ providedIn: 'root' })
export class HybridGradedCommentService {
  protected resourceUrl = '';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/hybrid-graded-comments');
  }

  create(hybridGradedComment: NewHybridGradedComment): Observable<EntityResponseType> {
    return this.http.post<IHybridGradedComment>(this.resourceUrl, hybridGradedComment, { observe: 'response' });
  }

  update(hybridGradedComment: IHybridGradedComment): Observable<EntityResponseType> {
    return this.http.put<IHybridGradedComment>(
      `${this.resourceUrl}/${this.getHybridGradedCommentIdentifier(hybridGradedComment)}`,
      hybridGradedComment,
      { observe: 'response' },
    );
  }

  partialUpdate(hybridGradedComment: PartialUpdateHybridGradedComment): Observable<EntityResponseType> {
    return this.http.patch<IHybridGradedComment>(
      `${this.resourceUrl}/${this.getHybridGradedCommentIdentifier(hybridGradedComment)}`,
      hybridGradedComment,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHybridGradedComment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHybridGradedComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHybridGradedCommentIdentifier(hybridGradedComment: Pick<IHybridGradedComment, 'id'>): number {
    return hybridGradedComment.id;
  }

  compareHybridGradedComment(o1: Pick<IHybridGradedComment, 'id'> | null, o2: Pick<IHybridGradedComment, 'id'> | null): boolean {
    return o1 && o2 ? this.getHybridGradedCommentIdentifier(o1) === this.getHybridGradedCommentIdentifier(o2) : o1 === o2;
  }

  addHybridGradedCommentToCollectionIfMissing<Type extends Pick<IHybridGradedComment, 'id'>>(
    hybridGradedCommentCollection: Type[],
    ...hybridGradedCommentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const hybridGradedComments: Type[] = hybridGradedCommentsToCheck.filter(isPresent);
    if (hybridGradedComments.length > 0) {
      const hybridGradedCommentCollectionIdentifiers = hybridGradedCommentCollection.map(
        hybridGradedCommentItem => this.getHybridGradedCommentIdentifier(hybridGradedCommentItem)!,
      );
      const hybridGradedCommentsToAdd = hybridGradedComments.filter(hybridGradedCommentItem => {
        const hybridGradedCommentIdentifier = this.getHybridGradedCommentIdentifier(hybridGradedCommentItem);
        if (hybridGradedCommentCollectionIdentifiers.includes(hybridGradedCommentIdentifier)) {
          return false;
        }
        hybridGradedCommentCollectionIdentifiers.push(hybridGradedCommentIdentifier);
        return true;
      });
      return [...hybridGradedCommentsToAdd, ...hybridGradedCommentCollection];
    }
    return hybridGradedCommentCollection;
  }
}
