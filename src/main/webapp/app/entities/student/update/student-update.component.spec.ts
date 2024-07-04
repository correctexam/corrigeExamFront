import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { StudentService } from '../service/student.service';
import { IStudent, Student } from '../student.model';
import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';

import { StudentUpdateComponent } from './student-update.component';

describe('Student Management Update Component', () => {
  let comp: StudentUpdateComponent;
  let fixture: ComponentFixture<StudentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentService: StudentService;
  let examSheetService: ExamSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, StudentUpdateComponent],
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
      .overrideTemplate(StudentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentService = TestBed.inject(StudentService);
    examSheetService = TestBed.inject(ExamSheetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ExamSheet query and add missing value', () => {
      const student: IStudent = { id: 456 };
      const examSheets: IExamSheet[] = [{ id: 43007 }];
      student.examSheets = examSheets;

      const examSheetCollection: IExamSheet[] = [{ id: 3621 }];
      jest.spyOn(examSheetService, 'query').mockReturnValue(of(new HttpResponse({ body: examSheetCollection })));
      const additionalExamSheets = [...examSheets];
      const expectedCollection: IExamSheet[] = [...additionalExamSheets, ...examSheetCollection];
      jest.spyOn(examSheetService, 'addExamSheetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(examSheetService.query).toHaveBeenCalled();
      expect(examSheetService.addExamSheetToCollectionIfMissing).toHaveBeenCalledWith(examSheetCollection, ...additionalExamSheets);
      expect(comp.examSheetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const student: IStudent = { id: 456 };
      const examSheets: IExamSheet = { id: 79679 };
      student.examSheets = [examSheets];

      activatedRoute.data = of({ student });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(student as any));
      expect(comp.examSheetsSharedCollection).toContain(examSheets);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Student>>();
      const student = { id: 123 };
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentService.update).toHaveBeenCalledWith(student);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Student>>();
      const student = new Student();
      jest.spyOn(studentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: student }));
      saveSubject.complete();

      // THEN
      expect(studentService.create).toHaveBeenCalledWith(student);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Student>>();
      const student = { id: 123 };
      jest.spyOn(studentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ student });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentService.update).toHaveBeenCalledWith(student);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackExamSheetById', () => {
      it('Should return tracked ExamSheet primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackExamSheetById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedExamSheet', () => {
      it('Should return option if no ExamSheet is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedExamSheet(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected ExamSheet for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedExamSheet(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this ExamSheet is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedExamSheet(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
