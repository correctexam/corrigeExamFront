import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { IExam, Exam } from '../exam.model';
import { ExamService } from '../service/exam.service';

import { ExamRoutingResolveService } from './exam-routing-resolve.service';

describe('Exam routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ExamRoutingResolveService;
  let service: ExamService;
  let resultExam: IExam | undefined;

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
    routingResolveService = TestBed.inject(ExamRoutingResolveService);
    service = TestBed.inject(ExamService);
    resultExam = undefined;
  });

  describe('resolve', () => {
    it('should return IExam returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExam = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultExam).toEqual({ id: 123 });
    });

    it('should return new IExam if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExam = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultExam).toEqual(new Exam());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Exam })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultExam = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultExam).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
