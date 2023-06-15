import { Injectable, NgZone } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQuestionType, QuestionType } from '../question-type.model';
import { QuestionTypeService } from '../service/question-type.service';

@Injectable({ providedIn: 'root' })
export class QuestionTypeRoutingResolveService implements Resolve<IQuestionType> {
  constructor(protected service: QuestionTypeService, protected router: Router, private zone: NgZone) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuestionType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((questionType: HttpResponse<QuestionType>) => {
          if (questionType.body) {
            return of(questionType.body);
          } else {
            this.zone.run(() => {
              this.router.navigate(['404']);
            });
            return EMPTY;
          }
        })
      );
    }
    return of(new QuestionType());
  }
}
