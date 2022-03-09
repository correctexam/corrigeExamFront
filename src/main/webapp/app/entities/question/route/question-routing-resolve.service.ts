import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQuestion, Question } from '../question.model';
import { QuestionService } from '../service/question.service';

@Injectable({ providedIn: 'root' })
export class QuestionRoutingResolveService implements Resolve<IQuestion> {
  constructor(protected service: QuestionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuestion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((question: HttpResponse<Question>) => {
          if (question.body) {
            return of(question.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Question());
  }
}
