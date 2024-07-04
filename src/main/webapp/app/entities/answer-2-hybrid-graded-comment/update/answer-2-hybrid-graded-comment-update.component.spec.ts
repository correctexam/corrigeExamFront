import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { Answer2HybridGradedCommentFormService } from './answer-2-hybrid-graded-comment-form.service';
import { Answer2HybridGradedCommentService } from '../service/answer-2-hybrid-graded-comment.service';
import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';
import { HybridGradedCommentService } from 'app/entities/hybrid-graded-comment/service/hybrid-graded-comment.service';

import { Answer2HybridGradedCommentUpdateComponent } from './answer-2-hybrid-graded-comment-update.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Answer2HybridGradedComment Management Update Component', () => {
  let comp: Answer2HybridGradedCommentUpdateComponent;
  let fixture: ComponentFixture<Answer2HybridGradedCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let answer2HybridGradedCommentFormService: Answer2HybridGradedCommentFormService;
  let answer2HybridGradedCommentService: Answer2HybridGradedCommentService;
  let hybridGradedCommentService: HybridGradedCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Answer2HybridGradedCommentUpdateComponent],
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
      .overrideTemplate(Answer2HybridGradedCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Answer2HybridGradedCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    answer2HybridGradedCommentFormService = TestBed.inject(Answer2HybridGradedCommentFormService);
    answer2HybridGradedCommentService = TestBed.inject(Answer2HybridGradedCommentService);
    hybridGradedCommentService = TestBed.inject(HybridGradedCommentService);

    comp = fixture.componentInstance;
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnswer2HybridGradedComment>>();
      const answer2HybridGradedComment = { id: 123 };
      jest.spyOn(answer2HybridGradedCommentFormService, 'getAnswer2HybridGradedComment').mockReturnValue(answer2HybridGradedComment);
      jest.spyOn(answer2HybridGradedCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ answer2HybridGradedComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: answer2HybridGradedComment }));
      saveSubject.complete();

      // THEN
      expect(answer2HybridGradedCommentFormService.getAnswer2HybridGradedComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(answer2HybridGradedCommentService.update).toHaveBeenCalledWith(expect.objectContaining(answer2HybridGradedComment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnswer2HybridGradedComment>>();
      const answer2HybridGradedComment = { id: 123 };
      jest.spyOn(answer2HybridGradedCommentFormService, 'getAnswer2HybridGradedComment').mockReturnValue({ id: null });
      jest.spyOn(answer2HybridGradedCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ answer2HybridGradedComment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: answer2HybridGradedComment }));
      saveSubject.complete();

      // THEN
      expect(answer2HybridGradedCommentFormService.getAnswer2HybridGradedComment).toHaveBeenCalled();
      expect(answer2HybridGradedCommentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnswer2HybridGradedComment>>();
      const answer2HybridGradedComment = { id: 123 };
      jest.spyOn(answer2HybridGradedCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ answer2HybridGradedComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(answer2HybridGradedCommentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareHybridGradedComment', () => {
      it('Should forward to hybridGradedCommentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(hybridGradedCommentService, 'compareHybridGradedComment');
        comp.compareHybridGradedComment(entity, entity2);
        expect(hybridGradedCommentService.compareHybridGradedComment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
