import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { PredictionService } from '../service/prediction.service';
import { PredictionRoutingResolveService } from './prediction-routing-resolve.service';
import { describe, expect } from '@jest/globals';

describe('PredictionRoutingResolveService', () => {
  let service: PredictionRoutingResolveService;
  let predictionService: jasmine.SpyObj<PredictionService>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let routerStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    const predictionServiceSpy = jasmine.createSpyObj('PredictionService', ['find']);

    TestBed.configureTestingModule({
      providers: [PredictionRoutingResolveService, { provide: PredictionService, useValue: predictionServiceSpy }],
    });

    service = TestBed.inject(PredictionRoutingResolveService);
    predictionService = TestBed.inject(PredictionService) as jasmine.SpyObj<PredictionService>;
    routeSnapshot = new ActivatedRouteSnapshot();
    routerStateSnapshot = {} as RouterStateSnapshot;
  });

  it('should return an existing prediction if an ID is provided', () => {
    const prediction = { id: 123, text: 'Sample Prediction' };
    predictionService.find.and.returnValue(of(prediction));
    routeSnapshot.params = { id: 123 };

    service.resolve(routeSnapshot, routerStateSnapshot).subscribe(result => {
      expect(result).toEqual(prediction);
    });
  });

  it('should return null if no ID is provided', () => {
    routeSnapshot.params = {};

    service.resolve(routeSnapshot, routerStateSnapshot).subscribe(result => {
      expect(result).toBeNull();
    });
  });
});
