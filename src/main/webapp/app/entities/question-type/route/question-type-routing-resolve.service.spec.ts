import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IQuestionType, QuestionType } from '../question-type.model';
import { QuestionTypeService } from '../service/question-type.service';

import { QuestionTypeRoutingResolveService } from './question-type-routing-resolve.service';

describe('QuestionType routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: QuestionTypeRoutingResolveService;
  let service: QuestionTypeService;
  let resultQuestionType: IQuestionType | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
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
    routingResolveService = TestBed.inject(QuestionTypeRoutingResolveService);
    service = TestBed.inject(QuestionTypeService);
    resultQuestionType = undefined;
  });

  describe('resolve', () => {
    it('should return IQuestionType returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultQuestionType).toEqual({ id: 123 });
    });

    it('should return new IQuestionType if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionType = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultQuestionType).toEqual(new QuestionType());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as QuestionType })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultQuestionType).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
