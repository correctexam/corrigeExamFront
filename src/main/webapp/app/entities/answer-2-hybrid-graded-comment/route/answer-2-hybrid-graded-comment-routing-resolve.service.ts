import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';
import { Answer2HybridGradedCommentService } from '../service/answer-2-hybrid-graded-comment.service';

@Injectable({ providedIn: 'root' })
export class Answer2HybridGradedCommentRoutingResolveService implements Resolve<IAnswer2HybridGradedComment | null> {
  constructor(
    protected service: Answer2HybridGradedCommentService,
    protected router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnswer2HybridGradedComment | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((answer2HybridGradedComment: HttpResponse<IAnswer2HybridGradedComment>) => {
          if (answer2HybridGradedComment.body) {
            return of(answer2HybridGradedComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        }),
      );
    }
    return of(null);
  }
}
