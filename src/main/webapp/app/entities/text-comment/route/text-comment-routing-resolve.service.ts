import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITextComment, TextComment } from '../text-comment.model';
import { TextCommentService } from '../service/text-comment.service';

@Injectable({ providedIn: 'root' })
export class TextCommentRoutingResolveService implements Resolve<ITextComment> {
  constructor(protected service: TextCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITextComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((textComment: HttpResponse<TextComment>) => {
          if (textComment.body) {
            return of(textComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TextComment());
  }
}
