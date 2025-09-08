import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';
import { Answer2HybridGradedCommentService } from '../service/answer-2-hybrid-graded-comment.service';

import { Answer2HybridGradedCommentRoutingResolveService } from './answer-2-hybrid-graded-comment-routing-resolve.service';

describe('Answer2HybridGradedComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: Answer2HybridGradedCommentRoutingResolveService;
  let service: Answer2HybridGradedCommentService;
  let resultAnswer2HybridGradedComment: IAnswer2HybridGradedComment | null | undefined;

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
    routingResolveService = TestBed.inject(Answer2HybridGradedCommentRoutingResolveService);
    service = TestBed.inject(Answer2HybridGradedCommentService);
    resultAnswer2HybridGradedComment = undefined;
  });

  describe('resolve', () => {
    it('should return IAnswer2HybridGradedComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAnswer2HybridGradedComment = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultAnswer2HybridGradedComment).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAnswer2HybridGradedComment = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultAnswer2HybridGradedComment).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IAnswer2HybridGradedComment>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAnswer2HybridGradedComment = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultAnswer2HybridGradedComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
