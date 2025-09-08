import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { IZone, Zone } from '../zone.model';
import { ZoneService } from '../service/zone.service';

import { ZoneRoutingResolveService } from './zone-routing-resolve.service';

describe('Zone routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ZoneRoutingResolveService;
  let service: ZoneService;
  let resultZone: IZone | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ZoneRoutingResolveService);
    service = TestBed.inject(ZoneService);
    resultZone = undefined;
  });

  describe('resolve', () => {
    it('should return IZone returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultZone = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultZone).toEqual({ id: 123 });
    });

    it('should return new IZone if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultZone = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultZone).toEqual(new Zone());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Zone })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultZone = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultZone).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
