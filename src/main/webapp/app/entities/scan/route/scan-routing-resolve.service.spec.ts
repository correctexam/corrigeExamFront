import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { IScan, Scan } from '../scan.model';
import { ScanService } from '../service/scan.service';

import { ScanRoutingResolveService } from './scan-routing-resolve.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Scan routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ScanRoutingResolveService;
  let service: ScanService;
  let resultScan: IScan | undefined;

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
    routingResolveService = TestBed.inject(ScanRoutingResolveService);
    service = TestBed.inject(ScanService);
    resultScan = undefined;
  });

  describe('resolve', () => {
    it('should return IScan returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultScan = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultScan).toEqual({ id: 123 });
    });

    it('should return new IScan if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultScan = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultScan).toEqual(new Scan());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Scan })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultScan = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultScan).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
