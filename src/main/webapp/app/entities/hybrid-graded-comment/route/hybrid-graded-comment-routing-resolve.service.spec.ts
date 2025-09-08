import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { IHybridGradedComment } from '../hybrid-graded-comment.model';
import { HybridGradedCommentService } from '../service/hybrid-graded-comment.service';

import { HybridGradedCommentRoutingResolveService } from './hybrid-graded-comment-routing-resolve.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HybridGradedComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: HybridGradedCommentRoutingResolveService;
  let service: HybridGradedCommentService;
  let resultHybridGradedComment: IHybridGradedComment | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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
    routingResolveService = TestBed.inject(HybridGradedCommentRoutingResolveService);
    service = TestBed.inject(HybridGradedCommentService);
    resultHybridGradedComment = undefined;
  });

  describe('resolve', () => {
    it('should return IHybridGradedComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHybridGradedComment = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultHybridGradedComment).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHybridGradedComment = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultHybridGradedComment).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IHybridGradedComment>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHybridGradedComment = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultHybridGradedComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
