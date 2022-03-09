import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IZone, Zone } from '../zone.model';
import { ZoneService } from '../service/zone.service';

@Injectable({ providedIn: 'root' })
export class ZoneRoutingResolveService implements Resolve<IZone> {
  constructor(protected service: ZoneService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IZone> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((zone: HttpResponse<Zone>) => {
          if (zone.body) {
            return of(zone.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Zone());
  }
}
