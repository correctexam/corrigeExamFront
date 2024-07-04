import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { QuestionTypeService } from '../service/question-type.service';
import { IQuestionType, QuestionType } from '../question-type.model';

import { QuestionTypeUpdateComponent } from './question-type-update.component';

describe('QuestionType Management Update Component', () => {
  let comp: QuestionTypeUpdateComponent;
  let fixture: ComponentFixture<QuestionTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let questionTypeService: QuestionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, QuestionTypeUpdateComponent],
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
      .overrideTemplate(QuestionTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuestionTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    questionTypeService = TestBed.inject(QuestionTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const questionType: IQuestionType = { id: 456 };

      activatedRoute.data = of({ questionType });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(questionType as any));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionType>>();
      const questionType = { id: 123 };
      jest.spyOn(questionTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: questionType }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(questionTypeService.update).toHaveBeenCalledWith(questionType);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionType>>();
      const questionType = new QuestionType();
      jest.spyOn(questionTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: questionType }));
      saveSubject.complete();

      // THEN
      expect(questionTypeService.create).toHaveBeenCalledWith(questionType);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionType>>();
      const questionType = { id: 123 };
      jest.spyOn(questionTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(questionTypeService.update).toHaveBeenCalledWith(questionType);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
