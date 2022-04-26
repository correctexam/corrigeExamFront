import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GradedCommentService } from '../service/graded-comment.service';
import { IGradedComment, GradedComment } from '../graded-comment.model';
import { IStudentResponse } from 'app/entities/student-response/student-response.model';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';

import { GradedCommentUpdateComponent } from './graded-comment-update.component';

describe('GradedComment Management Update Component', () => {
  let comp: GradedCommentUpdateComponent;
  let fixture: ComponentFixture<GradedCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gradedCommentService: GradedCommentService;
  let studentResponseService: StudentResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GradedCommentUpdateComponent],
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
      .overrideTemplate(GradedCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GradedCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gradedCommentService = TestBed.inject(GradedCommentService);
    studentResponseService = TestBed.inject(StudentResponseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call StudentResponse query and add missing value', () => {
      const gradedComment: IGradedComment = { id: 456 };
      const studentResponse: IStudentResponse = { id: 3800 };
      gradedComment.studentResponse = studentResponse;

      const studentResponseCollection: IStudentResponse[] = [{ id: 24148 }];
      jest.spyOn(studentResponseService, 'query').mockReturnValue(of(new HttpResponse({ body: studentResponseCollection })));
      const additionalStudentResponses = [studentResponse];
      const expectedCollection: IStudentResponse[] = [...additionalStudentResponses, ...studentResponseCollection];
      jest.spyOn(studentResponseService, 'addStudentResponseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gradedComment });
      comp.ngOnInit();

      expect(studentResponseService.query).toHaveBeenCalled();
      expect(studentResponseService.addStudentResponseToCollectionIfMissing).toHaveBeenCalledWith(
        studentResponseCollection,
        ...additionalStudentResponses
      );
      expect(comp.studentResponsesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const gradedComment: IGradedComment = { id: 456 };
      const studentResponse: IStudentResponse = { id: 7591 };
      gradedComment.studentResponse = studentResponse;

      activatedRoute.data = of({ gradedComment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(gradedComment));
      expect(comp.studentResponsesSharedCollection).toContain(studentResponse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GradedComment>>();
      const gradedComment = { id: 123 };
      jest.spyOn(gradedCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradedComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gradedComment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(gradedCommentService.update).toHaveBeenCalledWith(gradedComment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GradedComment>>();
      const gradedComment = new GradedComment();
      jest.spyOn(gradedCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradedComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gradedComment }));
      saveSubject.complete();

      // THEN
      expect(gradedCommentService.create).toHaveBeenCalledWith(gradedComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GradedComment>>();
      const gradedComment = { id: 123 };
      jest.spyOn(gradedCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradedComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gradedCommentService.update).toHaveBeenCalledWith(gradedComment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackStudentResponseById', () => {
      it('Should return tracked StudentResponse primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStudentResponseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
