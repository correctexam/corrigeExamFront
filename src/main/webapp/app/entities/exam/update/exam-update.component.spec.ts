import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExamService } from '../service/exam.service';
import { IExam, Exam } from '../exam.model';
import { ITemplate } from 'app/entities/template/template.model';
import { TemplateService } from 'app/entities/template/service/template.service';
import { IZone } from 'app/entities/zone/zone.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { IScan } from 'app/entities/scan/scan.model';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

import { ExamUpdateComponent } from './exam-update.component';

describe('Exam Management Update Component', () => {
  let comp: ExamUpdateComponent;
  let fixture: ComponentFixture<ExamUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let examService: ExamService;
  let templateService: TemplateService;
  let zoneService: ZoneService;
  let scanService: ScanService;
  let courseService: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExamUpdateComponent],
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
      .overrideTemplate(ExamUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExamUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    examService = TestBed.inject(ExamService);
    templateService = TestBed.inject(TemplateService);
    zoneService = TestBed.inject(ZoneService);
    scanService = TestBed.inject(ScanService);
    courseService = TestBed.inject(CourseService);

    comp = fixture.componentInstance;
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Exam>>();
      const exam = { id: 123 };
      jest.spyOn(examService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exam }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(examService.update).toHaveBeenCalledWith(exam);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Exam>>();
      const exam = new Exam();
      jest.spyOn(examService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exam }));
      saveSubject.complete();

      // THEN
      expect(examService.create).toHaveBeenCalledWith(exam);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Exam>>();
      const exam = { id: 123 };
      jest.spyOn(examService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(examService.update).toHaveBeenCalledWith(exam);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
