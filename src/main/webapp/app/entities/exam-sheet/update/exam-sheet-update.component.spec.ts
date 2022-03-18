/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExamSheetService } from '../service/exam-sheet.service';
import { ExamSheet } from '../exam-sheet.model';
import { ScanService } from 'app/entities/scan/service/scan.service';

import { ExamSheetUpdateComponent } from './exam-sheet-update.component';

describe('ExamSheet Management Update Component', () => {
  let comp: ExamSheetUpdateComponent;
  let fixture: ComponentFixture<ExamSheetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let examSheetService: ExamSheetService;
  let scanService: ScanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExamSheetUpdateComponent],
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
      .overrideTemplate(ExamSheetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExamSheetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    examSheetService = TestBed.inject(ExamSheetService);
    scanService = TestBed.inject(ScanService);

    comp = fixture.componentInstance;
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExamSheet>>();
      const examSheet = { id: 123 };
      jest.spyOn(examSheetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examSheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: examSheet }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(examSheetService.update).toHaveBeenCalledWith(examSheet);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExamSheet>>();
      const examSheet = new ExamSheet();
      jest.spyOn(examSheetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examSheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: examSheet }));
      saveSubject.complete();

      // THEN
      expect(examSheetService.create).toHaveBeenCalledWith(examSheet);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExamSheet>>();
      const examSheet = { id: 123 };
      jest.spyOn(examSheetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examSheet });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(examSheetService.update).toHaveBeenCalledWith(examSheet);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
