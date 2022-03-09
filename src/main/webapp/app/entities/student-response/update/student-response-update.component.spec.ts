import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StudentResponseService } from '../service/student-response.service';
import { IStudentResponse, StudentResponse } from '../student-response.model';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

import { StudentResponseUpdateComponent } from './student-response-update.component';

describe('StudentResponse Management Update Component', () => {
  let comp: StudentResponseUpdateComponent;
  let fixture: ComponentFixture<StudentResponseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentResponseService: StudentResponseService;
  let questionService: QuestionService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StudentResponseUpdateComponent],
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
      .overrideTemplate(StudentResponseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentResponseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentResponseService = TestBed.inject(StudentResponseService);
    questionService = TestBed.inject(QuestionService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Question query and add missing value', () => {
      const studentResponse: IStudentResponse = { id: 456 };
      const question: IQuestion = { id: 53578 };
      studentResponse.question = question;

      const questionCollection: IQuestion[] = [{ id: 72077 }];
      jest.spyOn(questionService, 'query').mockReturnValue(of(new HttpResponse({ body: questionCollection })));
      const additionalQuestions = [question];
      const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
      jest.spyOn(questionService, 'addQuestionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ studentResponse });
      comp.ngOnInit();

      expect(questionService.query).toHaveBeenCalled();
      expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(questionCollection, ...additionalQuestions);
      expect(comp.questionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Student query and add missing value', () => {
      const studentResponse: IStudentResponse = { id: 456 };
      const student: IStudent = { id: 5313 };
      studentResponse.student = student;

      const studentCollection: IStudent[] = [{ id: 21871 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ studentResponse });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(studentCollection, ...additionalStudents);
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const studentResponse: IStudentResponse = { id: 456 };
      const question: IQuestion = { id: 43086 };
      studentResponse.question = question;
      const student: IStudent = { id: 54974 };
      studentResponse.student = student;

      activatedRoute.data = of({ studentResponse });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(studentResponse));
      expect(comp.questionsSharedCollection).toContain(question);
      expect(comp.studentsSharedCollection).toContain(student);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StudentResponse>>();
      const studentResponse = { id: 123 };
      jest.spyOn(studentResponseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentResponse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studentResponse }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentResponseService.update).toHaveBeenCalledWith(studentResponse);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StudentResponse>>();
      const studentResponse = new StudentResponse();
      jest.spyOn(studentResponseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentResponse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studentResponse }));
      saveSubject.complete();

      // THEN
      expect(studentResponseService.create).toHaveBeenCalledWith(studentResponse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StudentResponse>>();
      const studentResponse = { id: 123 };
      jest.spyOn(studentResponseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentResponse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentResponseService.update).toHaveBeenCalledWith(studentResponse);
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

    describe('trackStudentById', () => {
      it('Should return tracked Student primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStudentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
