import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITemplate, Template } from '../template.model';
import { TemplateService } from '../service/template.service';

@Injectable({ providedIn: 'root' })
export class TemplateRoutingResolveService implements Resolve<ITemplate> {
  constructor(protected service: TemplateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITemplate> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((template: HttpResponse<Template>) => {
          if (template.body) {
            return of(template.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Template());
  }
}
