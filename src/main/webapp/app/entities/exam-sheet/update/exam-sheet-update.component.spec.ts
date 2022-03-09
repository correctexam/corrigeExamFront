import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExamSheetService } from '../service/exam-sheet.service';
import { IExamSheet, ExamSheet } from '../exam-sheet.model';
import { IScan } from 'app/entities/scan/scan.model';
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

  describe('ngOnInit', () => {
    it('Should call Scan query and add missing value', () => {
      const examSheet: IExamSheet = { id: 456 };
      const scan: IScan = { id: 59367 };
      examSheet.scan = scan;

      const scanCollection: IScan[] = [{ id: 52831 }];
      jest.spyOn(scanService, 'query').mockReturnValue(of(new HttpResponse({ body: scanCollection })));
      const additionalScans = [scan];
      const expectedCollection: IScan[] = [...additionalScans, ...scanCollection];
      jest.spyOn(scanService, 'addScanToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ examSheet });
      comp.ngOnInit();

      expect(scanService.query).toHaveBeenCalled();
      expect(scanService.addScanToCollectionIfMissing).toHaveBeenCalledWith(scanCollection, ...additionalScans);
      expect(comp.scansSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const examSheet: IExamSheet = { id: 456 };
      const scan: IScan = { id: 98551 };
      examSheet.scan = scan;

      activatedRoute.data = of({ examSheet });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(examSheet));
      expect(comp.scansSharedCollection).toContain(scan);
    });
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

  describe('Tracking relationships identifiers', () => {
    describe('trackScanById', () => {
      it('Should return tracked Scan primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackScanById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
