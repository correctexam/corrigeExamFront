import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Answer2HybridGradedCommentService } from '../service/answer-2-hybrid-graded-comment.service';

import { Answer2HybridGradedCommentComponent } from './answer-2-hybrid-graded-comment.component';
import SpyInstance = jest.SpyInstance;

describe('Answer2HybridGradedComment Management Component', () => {
  let comp: Answer2HybridGradedCommentComponent;
  let fixture: ComponentFixture<Answer2HybridGradedCommentComponent>;
  let service: Answer2HybridGradedCommentService;
  let routerNavigateSpy: SpyInstance<Promise<boolean>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Answer2HybridGradedCommentComponent],
      declarations: [],
      providers: [
        provideRouter([{ path: 'answer-2-hybrid-graded-comment', component: Answer2HybridGradedCommentComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(Answer2HybridGradedCommentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Answer2HybridGradedCommentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(Answer2HybridGradedCommentService);
    routerNavigateSpy = jest.spyOn(comp.router, 'navigate');

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.answer2HybridGradedComments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to answer2HybridGradedCommentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAnswer2HybridGradedCommentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAnswer2HybridGradedCommentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });

  it('should load a page', () => {
    // WHEN
    comp.navigateToPage(1);

    // THEN
    expect(routerNavigateSpy).toHaveBeenCalled();
  });

  it('should calculate the sort attribute for an id', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenLastCalledWith(expect.objectContaining({ sort: ['id,desc'] }));
  });

  it('should calculate the sort attribute for a non-id attribute', () => {
    // GIVEN
    comp.predicate = 'name';

    // WHEN
    comp.navigateToWithComponentValues();

    // THEN
    expect(routerNavigateSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        queryParams: expect.objectContaining({
          sort: ['name,asc'],
        }),
      }),
    );
  });
});
