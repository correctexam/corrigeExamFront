import { Injectable, NgZone } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICourseGroup, CourseGroup } from '../course-group.model';
import { CourseGroupService } from '../service/course-group.service';

@Injectable({ providedIn: 'root' })
export class CourseGroupRoutingResolveService implements Resolve<ICourseGroup> {
  constructor(protected service: CourseGroupService, protected router: Router, private zone: NgZone) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICourseGroup> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((courseGroup: HttpResponse<CourseGroup>) => {
          if (courseGroup.body) {
            return of(courseGroup.body);
          } else {
            this.zone.run(() => {
              this.router.navigate(['404']);
            });
            return EMPTY;
          }
        })
      );
    }
    return of(new CourseGroup());
  }
}
