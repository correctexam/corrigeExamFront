import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IComments, Comments } from '../comments.model';
import { CommentsService } from '../service/comments.service';

@Injectable({ providedIn: 'root' })
export class CommentsRoutingResolveService implements Resolve<IComments> {
  constructor(protected service: CommentsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IComments> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((comments: HttpResponse<Comments>) => {
          if (comments.body) {
            return of(comments.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Comments());
  }
}
