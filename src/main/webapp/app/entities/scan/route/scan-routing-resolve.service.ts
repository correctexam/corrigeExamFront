import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScan, Scan } from '../scan.model';
import { ScanService } from '../service/scan.service';

@Injectable({ providedIn: 'root' })
export class ScanRoutingResolveService implements Resolve<IScan> {
  constructor(protected service: ScanService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IScan> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((scan: HttpResponse<Scan>) => {
          if (scan.body) {
            return of(scan.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Scan());
  }
}
