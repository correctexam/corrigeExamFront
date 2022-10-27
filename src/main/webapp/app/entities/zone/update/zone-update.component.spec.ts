import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ZoneService } from '../service/zone.service';
import { IZone, Zone } from '../zone.model';

import { ZoneUpdateComponent } from './zone-update.component';

describe('Zone Management Update Component', () => {
  let comp: ZoneUpdateComponent;
  let fixture: ComponentFixture<ZoneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let zoneService: ZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ZoneUpdateComponent],
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
      .overrideTemplate(ZoneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ZoneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    zoneService = TestBed.inject(ZoneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const zone: IZone = { id: 456 };

      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(zone));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Zone>>();
      const zone = { id: 123 };
      jest.spyOn(zoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: zone }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(zoneService.update).toHaveBeenCalledWith(zone);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Zone>>();
      const zone = new Zone();
      jest.spyOn(zoneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: zone }));
      saveSubject.complete();

      // THEN
      expect(zoneService.create).toHaveBeenCalledWith(zone);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Zone>>();
      const zone = { id: 123 };
      jest.spyOn(zoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(zoneService.update).toHaveBeenCalledWith(zone);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
