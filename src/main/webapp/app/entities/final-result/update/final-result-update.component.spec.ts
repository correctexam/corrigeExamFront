/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
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
