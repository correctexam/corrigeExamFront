import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TemplateService } from '../service/template.service';
import { ITemplate, Template } from '../template.model';

import { TemplateUpdateComponent } from './template-update.component';

describe('Template Management Update Component', () => {
  let comp: TemplateUpdateComponent;
  let fixture: ComponentFixture<TemplateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let templateService: TemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TemplateUpdateComponent],
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
      .overrideTemplate(TemplateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TemplateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    templateService = TestBed.inject(TemplateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const template: ITemplate = { id: 456 };

      activatedRoute.data = of({ template });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(template));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Template>>();
      const template = { id: 123 };
      jest.spyOn(templateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ template });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: template }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(templateService.update).toHaveBeenCalledWith(template);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Template>>();
      const template = new Template();
      jest.spyOn(templateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ template });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: template }));
      saveSubject.complete();

      // THEN
      expect(templateService.create).toHaveBeenCalledWith(template);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Template>>();
      const template = { id: 123 };
      jest.spyOn(templateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ template });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(templateService.update).toHaveBeenCalledWith(template);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
