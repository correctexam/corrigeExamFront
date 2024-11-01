import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PredictionService } from '../service/prediction.service';
import { IPrediction } from '../prediction.model';

@Injectable({ providedIn: 'root' })
export class PredictionRoutingResolveService implements Resolve<IPrediction | null> {
  constructor(private service: PredictionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPrediction | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        map(response => response.body), // Extract the body from the HttpResponse
      );
    }
    return of(null);
  }
}
