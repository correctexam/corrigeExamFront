import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { HybridGradedCommentFormService } from './hybrid-graded-comment-form.service';
import { HybridGradedCommentService } from '../service/hybrid-graded-comment.service';
import { IHybridGradedComment } from '../hybrid-graded-comment.model';

import { HybridGradedCommentUpdateComponent } from './hybrid-graded-comment-update.component';

describe('HybridGradedComment Management Update Component', () => {
  let comp: HybridGradedCommentUpdateComponent;
  let fixture: ComponentFixture<HybridGradedCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let hybridGradedCommentFormService: HybridGradedCommentFormService;
  let hybridGradedCommentService: HybridGradedCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HybridGradedCommentUpdateComponent],
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(HybridGradedCommentUpdateComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HybridGradedCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    hybridGradedCommentFormService = TestBed.inject(HybridGradedCommentFormService);
    hybridGradedCommentService = TestBed.inject(HybridGradedCommentService);

    comp = fixture.componentInstance;
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHybridGradedComment>>();
      const hybridGradedComment = { id: 123 };
      jest.spyOn(hybridGradedCommentFormService, 'getHybridGradedComment').mockReturnValue(hybridGradedComment);
      jest.spyOn(hybridGradedCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hybridGradedComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hybridGradedComment }));
      saveSubject.complete();

      // THEN
      expect(hybridGradedCommentFormService.getHybridGradedComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(hybridGradedCommentService.update).toHaveBeenCalledWith(expect.objectContaining(hybridGradedComment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHybridGradedComment>>();
      const hybridGradedComment = { id: 123 };
      jest.spyOn(hybridGradedCommentFormService, 'getHybridGradedComment').mockReturnValue({ id: null });
      jest.spyOn(hybridGradedCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hybridGradedComment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hybridGradedComment }));
      saveSubject.complete();

      // THEN
      expect(hybridGradedCommentFormService.getHybridGradedComment).toHaveBeenCalled();
      expect(hybridGradedCommentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHybridGradedComment>>();
      const hybridGradedComment = { id: 123 };
      jest.spyOn(hybridGradedCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hybridGradedComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(hybridGradedCommentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
