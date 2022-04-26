import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TextCommentService } from '../service/text-comment.service';
import { ITextComment, TextComment } from '../text-comment.model';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

import { TextCommentUpdateComponent } from './text-comment-update.component';

describe('TextComment Management Update Component', () => {
  let comp: TextCommentUpdateComponent;
  let fixture: ComponentFixture<TextCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let textCommentService: TextCommentService;
  let questionService: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TextCommentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TextCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TextCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    textCommentService = TestBed.inject(TextCommentService);
    questionService = TestBed.inject(QuestionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Question query and add missing value', () => {
      const textComment: ITextComment = { id: 456 };
      const question: IQuestion = { id: 95865 };
      textComment.question = question;

      const questionCollection: IQuestion[] = [{ id: 98656 }];
      jest.spyOn(questionService, 'query').mockReturnValue(of(new HttpResponse({ body: questionCollection })));
      const additionalQuestions = [question];
      const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
      jest.spyOn(questionService, 'addQuestionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ textComment });
      comp.ngOnInit();

      expect(questionService.query).toHaveBeenCalled();
      expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(questionCollection, ...additionalQuestions);
      expect(comp.questionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const textComment: ITextComment = { id: 456 };
      const question: IQuestion = { id: 68606 };
      textComment.question = question;

      activatedRoute.data = of({ textComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(textComment));
      expect(comp.questionsSharedCollection).toContain(question);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TextComment>>();
      const textComment = { id: 123 };
      jest.spyOn(textCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: textComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(textCommentService.update).toHaveBeenCalledWith(textComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TextComment>>();
      const textComment = new TextComment();
      jest.spyOn(textCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: textComment }));
      saveSubject.complete();

      // THEN
      expect(textCommentService.create).toHaveBeenCalledWith(textComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TextComment>>();
      const textComment = { id: 123 };
      jest.spyOn(textCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(textCommentService.update).toHaveBeenCalledWith(textComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackQuestionById', () => {
      it('Should return tracked Question primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackQuestionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
