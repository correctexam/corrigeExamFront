import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExam, Exam } from '../exam.model';
import { ExamService } from '../service/exam.service';

@Injectable({ providedIn: 'root' })
export class ExamRoutingResolveService implements Resolve<IExam> {
  constructor(protected service: ExamService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExam> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exam: HttpResponse<Exam>) => {
          if (exam.body) {
            return of(exam.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Exam());
  }
}
