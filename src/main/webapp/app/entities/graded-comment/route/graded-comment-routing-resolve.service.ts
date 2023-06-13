import { Injectable, NgZone } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGradedComment, GradedComment } from '../graded-comment.model';
import { GradedCommentService } from '../service/graded-comment.service';

@Injectable({ providedIn: 'root' })
export class GradedCommentRoutingResolveService implements Resolve<IGradedComment> {
  constructor(protected service: GradedCommentService, protected router: Router, private zone: NgZone) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGradedComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gradedComment: HttpResponse<GradedComment>) => {
          if (gradedComment.body) {
            return of(gradedComment.body);
          } else {
            this.zone.run(() => {
              this.router.navigate(['404']);
            });
            return EMPTY;
          }
        })
      );
    }
    return of(new GradedComment());
  }
}
