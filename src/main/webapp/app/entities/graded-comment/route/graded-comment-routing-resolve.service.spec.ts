import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { IGradedComment, GradedComment } from '../graded-comment.model';
import { GradedCommentService } from '../service/graded-comment.service';

import { GradedCommentRoutingResolveService } from './graded-comment-routing-resolve.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GradedComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: GradedCommentRoutingResolveService;
  let service: GradedCommentService;
  let resultGradedComment: IGradedComment | undefined;

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
    routingResolveService = TestBed.inject(GradedCommentRoutingResolveService);
    service = TestBed.inject(GradedCommentService);
    resultGradedComment = undefined;
  });

  describe('resolve', () => {
    it('should return IGradedComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGradedComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGradedComment).toEqual({ id: 123 });
    });

    it('should return new IGradedComment if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGradedComment = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultGradedComment).toEqual(new GradedComment());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as GradedComment })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGradedComment = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGradedComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
