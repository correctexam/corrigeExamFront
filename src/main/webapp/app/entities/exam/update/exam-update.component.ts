import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IExam, Exam } from '../exam.model';
import { ExamService } from '../service/exam.service';
import { ITemplate } from 'app/entities/template/template.model';
import { TemplateService } from 'app/entities/template/service/template.service';
import { IZone } from 'app/entities/zone/zone.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { IScan } from 'app/entities/scan/scan.model';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

@Component({
  selector: 'jhi-exam-update',
  templateUrl: './exam-update.component.html',
})
export class ExamUpdateComponent implements OnInit {
  isSaving = false;

  templatesCollection: ITemplate[] = [];
  idzonesCollection: IZone[] = [];
  namezonesCollection: IZone[] = [];
  firstnamezonesCollection: IZone[] = [];
  notezonesCollection: IZone[] = [];
  scanfilesCollection: IScan[] = [];
  coursesSharedCollection: ICourse[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    template: [],
    idzone: [],
    namezone: [],
    firstnamezone: [],
    notezone: [],
    scanfile: [],
    course: [],
  });

  constructor(
    protected examService: ExamService,
    protected templateService: TemplateService,
    protected zoneService: ZoneService,
    protected scanService: ScanService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exam }) => {
      this.updateForm(exam);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exam = this.createFromForm();
    if (exam.id !== undefined) {
      this.subscribeToSaveResponse(this.examService.update(exam));
    } else {
      this.subscribeToSaveResponse(this.examService.create(exam));
    }
  }

  trackTemplateById(index: number, item: ITemplate): number {
    return item.id!;
  }

  trackZoneById(index: number, item: IZone): number {
    return item.id!;
  }

  trackScanById(index: number, item: IScan): number {
    return item.id!;
  }

  trackCourseById(index: number, item: ICourse): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExam>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(exam: IExam): void {
    this.editForm.patchValue({
      id: exam.id,
      name: exam.name,
      template: exam.template,
      idzone: exam.idzone,
      namezone: exam.namezone,
      firstnamezone: exam.firstnamezone,
      notezone: exam.notezone,
      scanfile: exam.scanfile,
      course: exam.course,
    });

    this.templatesCollection = this.templateService.addTemplateToCollectionIfMissing(this.templatesCollection, exam.template);
    this.idzonesCollection = this.zoneService.addZoneToCollectionIfMissing(this.idzonesCollection, exam.idzone);
    this.namezonesCollection = this.zoneService.addZoneToCollectionIfMissing(this.namezonesCollection, exam.namezone);
    this.firstnamezonesCollection = this.zoneService.addZoneToCollectionIfMissing(this.firstnamezonesCollection, exam.firstnamezone);
    this.notezonesCollection = this.zoneService.addZoneToCollectionIfMissing(this.notezonesCollection, exam.notezone);
    this.scanfilesCollection = this.scanService.addScanToCollectionIfMissing(this.scanfilesCollection, exam.scanfile);
    this.coursesSharedCollection = this.courseService.addCourseToCollectionIfMissing(this.coursesSharedCollection, exam.course);
  }

  protected loadRelationshipsOptions(): void {
    this.templateService
      .query({ filter: 'exam-is-null' })
      .pipe(map((res: HttpResponse<ITemplate[]>) => res.body ?? []))
      .pipe(
        map((templates: ITemplate[]) =>
          this.templateService.addTemplateToCollectionIfMissing(templates, this.editForm.get('template')!.value)
        )
      )
      .subscribe((templates: ITemplate[]) => (this.templatesCollection = templates));

    this.zoneService
      .query({ filter: 'exam-is-null' })
      .pipe(map((res: HttpResponse<IZone[]>) => res.body ?? []))
      .pipe(map((zones: IZone[]) => this.zoneService.addZoneToCollectionIfMissing(zones, this.editForm.get('idzone')!.value)))
      .subscribe((zones: IZone[]) => (this.idzonesCollection = zones));

    this.zoneService
      .query({ filter: 'exam-is-null' })
      .pipe(map((res: HttpResponse<IZone[]>) => res.body ?? []))
      .pipe(map((zones: IZone[]) => this.zoneService.addZoneToCollectionIfMissing(zones, this.editForm.get('namezone')!.value)))
      .subscribe((zones: IZone[]) => (this.namezonesCollection = zones));

    this.zoneService
      .query({ filter: 'exam-is-null' })
      .pipe(map((res: HttpResponse<IZone[]>) => res.body ?? []))
      .pipe(map((zones: IZone[]) => this.zoneService.addZoneToCollectionIfMissing(zones, this.editForm.get('firstnamezone')!.value)))
      .subscribe((zones: IZone[]) => (this.firstnamezonesCollection = zones));

    this.zoneService
      .query({ filter: 'exam-is-null' })
      .pipe(map((res: HttpResponse<IZone[]>) => res.body ?? []))
      .pipe(map((zones: IZone[]) => this.zoneService.addZoneToCollectionIfMissing(zones, this.editForm.get('notezone')!.value)))
      .subscribe((zones: IZone[]) => (this.notezonesCollection = zones));

    this.scanService
      .query({ filter: 'exam-is-null' })
      .pipe(map((res: HttpResponse<IScan[]>) => res.body ?? []))
      .pipe(map((scans: IScan[]) => this.scanService.addScanToCollectionIfMissing(scans, this.editForm.get('scanfile')!.value)))
      .subscribe((scans: IScan[]) => (this.scanfilesCollection = scans));

    this.courseService
      .query()
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing(courses, this.editForm.get('course')!.value)))
      .subscribe((courses: ICourse[]) => (this.coursesSharedCollection = courses));
  }

  protected createFromForm(): IExam {
    return {
      ...new Exam(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      template: this.editForm.get(['template'])!.value,
      idzone: this.editForm.get(['idzone'])!.value,
      namezone: this.editForm.get(['namezone'])!.value,
      firstnamezone: this.editForm.get(['firstnamezone'])!.value,
      notezone: this.editForm.get(['notezone'])!.value,
      scanfile: this.editForm.get(['scanfile'])!.value,
      course: this.editForm.get(['course'])!.value,
    };
  }
}
