import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PredictionService } from '../service/prediction.service';
import { PredictionRoutingResolveService } from './prediction-routing-resolve.service';
import { describe, expect } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PredictionRoutingResolveService', () => {
  let service: PredictionRoutingResolveService;
  let servicebase: PredictionService;
  let routeSnapshot: ActivatedRouteSnapshot;
  let routerStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PredictionRoutingResolveService);
    servicebase = TestBed.inject(PredictionService);
    routeSnapshot = new ActivatedRouteSnapshot();
    routerStateSnapshot = {} as RouterStateSnapshot;
  });

  it('should return an existing prediction if an ID is provided', () => {
    const prediction = { id: 123, text: 'Sample Prediction' };
    routeSnapshot.params = { id: 123 };

    jest.spyOn(servicebase, 'find');

    service.resolve(routeSnapshot, routerStateSnapshot).subscribe(result => {
      expect(result).toEqual(prediction);
      expect(servicebase.find).toHaveBeenCalled();
    });
  });

  it('should return null if no ID is provided', () => {
    routeSnapshot.params = {};

    service.resolve(routeSnapshot, routerStateSnapshot).subscribe(result => {
      expect(result).toBeNull();
    });
  });
});
