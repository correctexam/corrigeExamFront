import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExamSheet, ExamSheet } from '../exam-sheet.model';
import { ExamSheetService } from '../service/exam-sheet.service';

@Injectable({ providedIn: 'root' })
export class ExamSheetRoutingResolveService implements Resolve<IExamSheet> {
  constructor(protected service: ExamSheetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExamSheet> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((examSheet: HttpResponse<ExamSheet>) => {
          if (examSheet.body) {
            return of(examSheet.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ExamSheet());
  }
}
