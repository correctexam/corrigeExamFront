import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ITextComment, TextComment } from '../text-comment.model';
import { TextCommentService } from '../service/text-comment.service';

import { TextCommentRoutingResolveService } from './text-comment-routing-resolve.service';

describe('TextComment routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TextCommentRoutingResolveService;
  let service: TextCommentService;
  let resultTextComment: ITextComment | undefined;

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
    routingResolveService = TestBed.inject(TextCommentRoutingResolveService);
    service = TestBed.inject(TextCommentService);
    resultTextComment = undefined;
  });

  describe('resolve', () => {
    it('should return ITextComment returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTextComment = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultTextComment).toEqual({ id: 123 });
    });

    it('should return new ITextComment if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTextComment = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultTextComment).toEqual(new TextComment());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TextComment })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTextComment = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultTextComment).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
