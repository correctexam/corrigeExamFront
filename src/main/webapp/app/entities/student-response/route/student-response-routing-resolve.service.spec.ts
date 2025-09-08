import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { IStudentResponse, StudentResponse } from '../student-response.model';
import { StudentResponseService } from '../service/student-response.service';

import { StudentResponseRoutingResolveService } from './student-response-routing-resolve.service';

describe('StudentResponse routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: StudentResponseRoutingResolveService;
  let service: StudentResponseService;
  let resultStudentResponse: IStudentResponse | undefined;

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
    routingResolveService = TestBed.inject(StudentResponseRoutingResolveService);
    service = TestBed.inject(StudentResponseService);
    resultStudentResponse = undefined;
  });

  describe('resolve', () => {
    it('should return IStudentResponse returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStudentResponse = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultStudentResponse).toEqual({ id: 123 });
    });

    it('should return new IStudentResponse if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStudentResponse = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultStudentResponse).toEqual(new StudentResponse());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as StudentResponse })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultStudentResponse = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultStudentResponse).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
