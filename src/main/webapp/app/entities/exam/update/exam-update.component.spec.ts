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

  describe('ngOnInit', () => {
    it('Should call template query and add missing value', () => {
      const exam: IExam = { id: 456 };
      const template: ITemplate = { id: 61861 };
      exam.template = template;

      const templateCollection: ITemplate[] = [{ id: 76014 }];
      jest.spyOn(templateService, 'query').mockReturnValue(of(new HttpResponse({ body: templateCollection })));
      const expectedCollection: ITemplate[] = [template, ...templateCollection];
      jest.spyOn(templateService, 'addTemplateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(templateService.query).toHaveBeenCalled();
      expect(templateService.addTemplateToCollectionIfMissing).toHaveBeenCalledWith(templateCollection, template);
      expect(comp.templatesCollection).toEqual(expectedCollection);
    });

    it('Should call idzone query and add missing value', () => {
      const exam: IExam = { id: 456 };
      const idzone: IZone = { id: 95481 };
      exam.idzone = idzone;

      const idzoneCollection: IZone[] = [{ id: 75791 }];
      jest.spyOn(zoneService, 'query').mockReturnValue(of(new HttpResponse({ body: idzoneCollection })));
      const expectedCollection: IZone[] = [idzone, ...idzoneCollection];
      jest.spyOn(zoneService, 'addZoneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(zoneService.query).toHaveBeenCalled();
      expect(zoneService.addZoneToCollectionIfMissing).toHaveBeenCalledWith(idzoneCollection, idzone);
      expect(comp.idzonesCollection).toEqual(expectedCollection);
    });

    it('Should call namezone query and add missing value', () => {
      const exam: IExam = { id: 456 };
      const namezone: IZone = { id: 85055 };
      exam.namezone = namezone;

      const namezoneCollection: IZone[] = [{ id: 68766 }];
      jest.spyOn(zoneService, 'query').mockReturnValue(of(new HttpResponse({ body: namezoneCollection })));
      const expectedCollection: IZone[] = [namezone, ...namezoneCollection];
      jest.spyOn(zoneService, 'addZoneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(zoneService.query).toHaveBeenCalled();
      expect(zoneService.addZoneToCollectionIfMissing).toHaveBeenCalledWith(namezoneCollection, namezone);
      expect(comp.namezonesCollection).toEqual(expectedCollection);
    });

    it('Should call firstnamezone query and add missing value', () => {
      const exam: IExam = { id: 456 };
      const firstnamezone: IZone = { id: 97847 };
      exam.firstnamezone = firstnamezone;

      const firstnamezoneCollection: IZone[] = [{ id: 90464 }];
      jest.spyOn(zoneService, 'query').mockReturnValue(of(new HttpResponse({ body: firstnamezoneCollection })));
      const expectedCollection: IZone[] = [firstnamezone, ...firstnamezoneCollection];
      jest.spyOn(zoneService, 'addZoneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(zoneService.query).toHaveBeenCalled();
      expect(zoneService.addZoneToCollectionIfMissing).toHaveBeenCalledWith(firstnamezoneCollection, firstnamezone);
      expect(comp.firstnamezonesCollection).toEqual(expectedCollection);
    });

    it('Should call notezone query and add missing value', () => {
      const exam: IExam = { id: 456 };
      const notezone: IZone = { id: 56070 };
      exam.notezone = notezone;

      const notezoneCollection: IZone[] = [{ id: 76888 }];
      jest.spyOn(zoneService, 'query').mockReturnValue(of(new HttpResponse({ body: notezoneCollection })));
      const expectedCollection: IZone[] = [notezone, ...notezoneCollection];
      jest.spyOn(zoneService, 'addZoneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(zoneService.query).toHaveBeenCalled();
      expect(zoneService.addZoneToCollectionIfMissing).toHaveBeenCalledWith(notezoneCollection, notezone);
      expect(comp.notezonesCollection).toEqual(expectedCollection);
    });

    it('Should call scanfile query and add missing value', () => {
      const exam: IExam = { id: 456 };
      const scanfile: IScan = { id: 57536 };
      exam.scanfile = scanfile;

      const scanfileCollection: IScan[] = [{ id: 24704 }];
      jest.spyOn(scanService, 'query').mockReturnValue(of(new HttpResponse({ body: scanfileCollection })));
      const expectedCollection: IScan[] = [scanfile, ...scanfileCollection];
      jest.spyOn(scanService, 'addScanToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(scanService.query).toHaveBeenCalled();
      expect(scanService.addScanToCollectionIfMissing).toHaveBeenCalledWith(scanfileCollection, scanfile);
      expect(comp.scanfilesCollection).toEqual(expectedCollection);
    });

    it('Should call Course query and add missing value', () => {
      const exam: IExam = { id: 456 };
      const course: ICourse = { id: 97041 };
      exam.course = course;

      const courseCollection: ICourse[] = [{ id: 41501 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [course];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(courseCollection, ...additionalCourses);
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const exam: IExam = { id: 456 };
      const template: ITemplate = { id: 25422 };
      exam.template = template;
      const idzone: IZone = { id: 78670 };
      exam.idzone = idzone;
      const namezone: IZone = { id: 41368 };
      exam.namezone = namezone;
      const firstnamezone: IZone = { id: 32906 };
      exam.firstnamezone = firstnamezone;
      const notezone: IZone = { id: 44735 };
      exam.notezone = notezone;
      const scanfile: IScan = { id: 79839 };
      exam.scanfile = scanfile;
      const course: ICourse = { id: 78027 };
      exam.course = course;

      activatedRoute.data = of({ exam });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(exam));
      expect(comp.templatesCollection).toContain(template);
      expect(comp.idzonesCollection).toContain(idzone);
      expect(comp.namezonesCollection).toContain(namezone);
      expect(comp.firstnamezonesCollection).toContain(firstnamezone);
      expect(comp.notezonesCollection).toContain(notezone);
      expect(comp.scanfilesCollection).toContain(scanfile);
      expect(comp.coursesSharedCollection).toContain(course);
    });
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

  describe('Tracking relationships identifiers', () => {
    describe('trackTemplateById', () => {
      it('Should return tracked Template primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTemplateById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackZoneById', () => {
      it('Should return tracked Zone primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackZoneById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackScanById', () => {
      it('Should return tracked Scan primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackScanById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCourseById', () => {
      it('Should return tracked Course primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCourseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
