import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { IExamSheet, ExamSheet } from '../exam-sheet.model';
import { ExamSheetService } from '../service/exam-sheet.service';

import { ExamSheetRoutingResolveService } from './exam-sheet-routing-resolve.service';

describe('ExamSheet routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ExamSheetRoutingResolveService;
  let service: ExamSheetService;
  let resultExamSheet: IExamSheet | undefined;

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
    routingResolveService = TestBed.inject(ExamSheetRoutingResolveService);
    service = TestBed.inject(ExamSheetService);
    resultExamSheet = undefined;
  });

  describe('resolve', () => {
    it('should return IExamSheet returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExamSheet = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExamSheet).toEqual({ id: 123 });
    });

    it('should return new IExamSheet if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExamSheet = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultExamSheet).toEqual(new ExamSheet());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ExamSheet })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExamSheet = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultExamSheet).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
