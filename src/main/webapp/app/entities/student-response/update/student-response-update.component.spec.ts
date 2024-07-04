import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { StudentResponseService } from '../service/student-response.service';
import { StudentResponse } from '../student-response.model';

import { StudentResponseUpdateComponent } from './student-response-update.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('StudentResponse Management Update Component', () => {
  let comp: StudentResponseUpdateComponent;
  let fixture: ComponentFixture<StudentResponseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentResponseService: StudentResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, StudentResponseUpdateComponent],
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
      .overrideTemplate(StudentResponseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentResponseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentResponseService = TestBed.inject(StudentResponseService);

    comp = fixture.componentInstance;
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
});
