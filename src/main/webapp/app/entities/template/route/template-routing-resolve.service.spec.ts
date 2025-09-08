import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ITemplate, Template } from '../template.model';
import { TemplateService } from '../service/template.service';

import { TemplateRoutingResolveService } from './template-routing-resolve.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Template routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TemplateRoutingResolveService;
  let service: TemplateService;
  let resultTemplate: ITemplate | undefined;

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
    routingResolveService = TestBed.inject(TemplateRoutingResolveService);
    service = TestBed.inject(TemplateService);
    resultTemplate = undefined;
  });

  describe('resolve', () => {
    it('should return ITemplate returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTemplate = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultTemplate).toEqual({ id: 123 });
    });

    it('should return new ITemplate if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTemplate = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultTemplate).toEqual(new Template());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Template })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTemplate = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultTemplate).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
