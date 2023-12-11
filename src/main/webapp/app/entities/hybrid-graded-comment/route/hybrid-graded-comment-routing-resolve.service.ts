import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHybridGradedComment } from '../hybrid-graded-comment.model';
import { HybridGradedCommentService } from '../service/hybrid-graded-comment.service';

@Injectable({ providedIn: 'root' })
export class HybridGradedCommentRoutingResolveService implements Resolve<IHybridGradedComment | null> {
  constructor(
    protected service: HybridGradedCommentService,
    protected router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHybridGradedComment | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((hybridGradedComment: HttpResponse<IHybridGradedComment>) => {
          if (hybridGradedComment.body) {
            return of(hybridGradedComment.body);
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
