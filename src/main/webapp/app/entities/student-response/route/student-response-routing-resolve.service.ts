import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStudentResponse, StudentResponse } from '../student-response.model';
import { StudentResponseService } from '../service/student-response.service';

@Injectable({ providedIn: 'root' })
export class StudentResponseRoutingResolveService implements Resolve<IStudentResponse> {
  constructor(protected service: StudentResponseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStudentResponse> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((studentResponse: HttpResponse<StudentResponse>) => {
          if (studentResponse.body) {
            return of(studentResponse.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StudentResponse());
  }
}
