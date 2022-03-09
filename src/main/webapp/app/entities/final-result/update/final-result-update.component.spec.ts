import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FinalResultService } from '../service/final-result.service';
import { IFinalResult, FinalResult } from '../final-result.model';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';

import { FinalResultUpdateComponent } from './final-result-update.component';

describe('FinalResult Management Update Component', () => {
  let comp: FinalResultUpdateComponent;
  let fixture: ComponentFixture<FinalResultUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let finalResultService: FinalResultService;
  let studentService: StudentService;
  let examService: ExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FinalResultUpdateComponent],
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
      .overrideTemplate(FinalResultUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinalResultUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    finalResultService = TestBed.inject(FinalResultService);
    studentService = TestBed.inject(StudentService);
    examService = TestBed.inject(ExamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const finalResult: IFinalResult = { id: 456 };
      const student: IStudent = { id: 42194 };
      finalResult.student = student;

      const studentCollection: IStudent[] = [{ id: 74458 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ finalResult });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(studentCollection, ...additionalStudents);
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Exam query and add missing value', () => {
      const finalResult: IFinalResult = { id: 456 };
      const exam: IExam = { id: 77020 };
      finalResult.exam = exam;

      const examCollection: IExam[] = [{ id: 44196 }];
      jest.spyOn(examService, 'query').mockReturnValue(of(new HttpResponse({ body: examCollection })));
      const additionalExams = [exam];
      const expectedCollection: IExam[] = [...additionalExams, ...examCollection];
      jest.spyOn(examService, 'addExamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ finalResult });
      comp.ngOnInit();

      expect(examService.query).toHaveBeenCalled();
      expect(examService.addExamToCollectionIfMissing).toHaveBeenCalledWith(examCollection, ...additionalExams);
      expect(comp.examsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const finalResult: IFinalResult = { id: 456 };
      const student: IStudent = { id: 35363 };
      finalResult.student = student;
      const exam: IExam = { id: 51875 };
      finalResult.exam = exam;

      activatedRoute.data = of({ finalResult });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(finalResult));
      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.examsSharedCollection).toContain(exam);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FinalResult>>();
      const finalResult = { id: 123 };
      jest.spyOn(finalResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: finalResult }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(finalResultService.update).toHaveBeenCalledWith(finalResult);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FinalResult>>();
      const finalResult = new FinalResult();
      jest.spyOn(finalResultService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: finalResult }));
      saveSubject.complete();

      // THEN
      expect(finalResultService.create).toHaveBeenCalledWith(finalResult);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FinalResult>>();
      const finalResult = { id: 123 };
      jest.spyOn(finalResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(finalResultService.update).toHaveBeenCalledWith(finalResult);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackStudentById', () => {
      it('Should return tracked Student primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStudentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackExamById', () => {
      it('Should return tracked Exam primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackExamById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
