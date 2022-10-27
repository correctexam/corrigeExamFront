import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScanService } from '../service/scan.service';
import { IScan, Scan } from '../scan.model';

import { ScanUpdateComponent } from './scan-update.component';

describe('Scan Management Update Component', () => {
  let comp: ScanUpdateComponent;
  let fixture: ComponentFixture<ScanUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scanService: ScanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ScanUpdateComponent],
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
      .overrideTemplate(ScanUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScanUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scanService = TestBed.inject(ScanService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const scan: IScan = { id: 456 };

      activatedRoute.data = of({ scan });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(scan));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Scan>>();
      const scan = { id: 123 };
      jest.spyOn(scanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scan }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(scanService.update).toHaveBeenCalledWith(scan);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Scan>>();
      const scan = new Scan();
      jest.spyOn(scanService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scan }));
      saveSubject.complete();

      // THEN
      expect(scanService.create).toHaveBeenCalledWith(scan);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Scan>>();
      const scan = { id: 123 };
      jest.spyOn(scanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scanService.update).toHaveBeenCalledWith(scan);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
