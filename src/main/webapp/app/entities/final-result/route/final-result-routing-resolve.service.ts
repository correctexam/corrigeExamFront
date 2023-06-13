import { Injectable, NgZone } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFinalResult, FinalResult } from '../final-result.model';
import { FinalResultService } from '../service/final-result.service';

@Injectable({ providedIn: 'root' })
export class FinalResultRoutingResolveService implements Resolve<IFinalResult> {
  constructor(protected service: FinalResultService, protected router: Router, private zone: NgZone) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinalResult> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((finalResult: HttpResponse<FinalResult>) => {
          if (finalResult.body) {
            return of(finalResult.body);
          } else {
            this.zone.run(() => {
              this.router.navigate(['404']);
            });
            return EMPTY;
          }
        })
      );
    }
    return of(new FinalResult());
  }
}
