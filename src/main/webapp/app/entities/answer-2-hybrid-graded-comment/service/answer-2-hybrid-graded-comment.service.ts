import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnswer2HybridGradedComment, NewAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';

export type PartialUpdateAnswer2HybridGradedComment = Partial<IAnswer2HybridGradedComment> & Pick<IAnswer2HybridGradedComment, 'id'>;

export type EntityResponseType = HttpResponse<IAnswer2HybridGradedComment>;
export type EntityArrayResponseType = HttpResponse<IAnswer2HybridGradedComment[]>;

@Injectable({ providedIn: 'root' })
export class Answer2HybridGradedCommentService {
  protected resourceUrl = '';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/answer-2-hybrid-graded-comments');
  }

  create(answer2HybridGradedComment: NewAnswer2HybridGradedComment): Observable<EntityResponseType> {
    return this.http.post<IAnswer2HybridGradedComment>(this.resourceUrl, answer2HybridGradedComment, { observe: 'response' });
  }

  update(answer2HybridGradedComment: IAnswer2HybridGradedComment): Observable<EntityResponseType> {
    return this.http.put<IAnswer2HybridGradedComment>(
      `${this.resourceUrl}/${this.getAnswer2HybridGradedCommentIdentifier(answer2HybridGradedComment)}`,
      answer2HybridGradedComment,
      { observe: 'response' },
    );
  }

  updateAnswer2Hybrid(responseId: number | undefined, hybridCommentId: number): Observable<EntityResponseType> {
    return this.http.put<IAnswer2HybridGradedComment>(
      `${this.applicationConfigService.getEndpointFor('api/update-2-hybrid-graded-comments')}/${responseId}/${hybridCommentId}`,
      {},
      { observe: 'response' },
    );
  }

  updateAnswer2HybridWithStepValue(
    responseId: number | undefined,
    hybridCommentId: number,
    stepValue: number,
  ): Observable<EntityResponseType> {
    return this.http.put<IAnswer2HybridGradedComment>(
      `${this.applicationConfigService.getEndpointFor(
        'api/update-2-hybrid-graded-comments-with-stepvalue',
      )}/${responseId}/${hybridCommentId}/${stepValue}`,
      {},
      { observe: 'response' },
    );
  }

  partialUpdate(answer2HybridGradedComment: PartialUpdateAnswer2HybridGradedComment): Observable<EntityResponseType> {
    return this.http.patch<IAnswer2HybridGradedComment>(
      `${this.resourceUrl}/${this.getAnswer2HybridGradedCommentIdentifier(answer2HybridGradedComment)}`,
      answer2HybridGradedComment,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnswer2HybridGradedComment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnswer2HybridGradedComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAnswer2HybridGradedCommentIdentifier(answer2HybridGradedComment: Pick<IAnswer2HybridGradedComment, 'id'>): number {
    return answer2HybridGradedComment.id;
  }

  compareAnswer2HybridGradedComment(
    o1: Pick<IAnswer2HybridGradedComment, 'id'> | null,
    o2: Pick<IAnswer2HybridGradedComment, 'id'> | null,
  ): boolean {
    return o1 && o2 ? this.getAnswer2HybridGradedCommentIdentifier(o1) === this.getAnswer2HybridGradedCommentIdentifier(o2) : o1 === o2;
  }

  addAnswer2HybridGradedCommentToCollectionIfMissing<Type extends Pick<IAnswer2HybridGradedComment, 'id'>>(
    answer2HybridGradedCommentCollection: Type[],
    ...answer2HybridGradedCommentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const answer2HybridGradedComments: Type[] = answer2HybridGradedCommentsToCheck.filter(isPresent);
    if (answer2HybridGradedComments.length > 0) {
      const answer2HybridGradedCommentCollectionIdentifiers = answer2HybridGradedCommentCollection.map(answer2HybridGradedCommentItem =>
        this.getAnswer2HybridGradedCommentIdentifier(answer2HybridGradedCommentItem),
      );
      const answer2HybridGradedCommentsToAdd = answer2HybridGradedComments.filter(answer2HybridGradedCommentItem => {
        const answer2HybridGradedCommentIdentifier = this.getAnswer2HybridGradedCommentIdentifier(answer2HybridGradedCommentItem);
        if (answer2HybridGradedCommentCollectionIdentifiers.includes(answer2HybridGradedCommentIdentifier)) {
          return false;
        }
        answer2HybridGradedCommentCollectionIdentifiers.push(answer2HybridGradedCommentIdentifier);
        return true;
      });
      return [...answer2HybridGradedCommentsToAdd, ...answer2HybridGradedCommentCollection];
    }
    return answer2HybridGradedCommentCollection;
  }
}
