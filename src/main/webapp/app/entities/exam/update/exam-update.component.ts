/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

type SelectableEntity = ITemplate | IZone | IScan | ICourse;

@Component({
  selector: 'jhi-exam-update',
  templateUrl: './exam-update.component.html',
})
export class ExamUpdateComponent implements OnInit {
  isSaving = false;
  templates: ITemplate[] = [];
  idzones: IZone[] = [];
  namezones: IZone[] = [];
  firstnamezones: IZone[] = [];
  notezones: IZone[] = [];
  scanfiles: IScan[] = [];
  courses: ICourse[] = [];

  editForm: UntypedFormGroup;

  constructor(
    protected examService: ExamService,
    protected templateService: TemplateService,
    protected zoneService: ZoneService,
    protected scanService: ScanService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {
    this.editForm = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
      templateId: [],
      idzoneId: [],
      namezoneId: [],
      firstnamezoneId: [],
      notezoneId: [],
      scanfileId: [],
      courseId: [],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exam }) => {
      this.updateForm(exam);

      this.templateService
        .query({ filter: 'exam-is-null' })
        .pipe(
          map((res: HttpResponse<ITemplate[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: ITemplate[]) => {
          if (!exam.templateId) {
            this.templates = resBody;
          } else {
            this.templateService
              .find(exam.templateId)
              .pipe(
                map((subRes: HttpResponse<ITemplate>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: ITemplate[]) => (this.templates = concatRes));
          }
        });

      this.zoneService
        .query({ filter: 'exam-is-null' })
        .pipe(
          map((res: HttpResponse<IZone[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IZone[]) => {
          if (!exam.idzoneId) {
            this.idzones = resBody;
          } else {
            this.zoneService
              .find(exam.idzoneId)
              .pipe(
                map((subRes: HttpResponse<IZone>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IZone[]) => (this.idzones = concatRes));
          }
        });

      this.zoneService
        .query({ filter: 'exam-is-null' })
        .pipe(
          map((res: HttpResponse<IZone[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IZone[]) => {
          if (!exam.namezoneId) {
            this.namezones = resBody;
          } else {
            this.zoneService
              .find(exam.namezoneId)
              .pipe(
                map((subRes: HttpResponse<IZone>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IZone[]) => (this.namezones = concatRes));
          }
        });

      this.zoneService
        .query({ filter: 'exam-is-null' })
        .pipe(
          map((res: HttpResponse<IZone[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IZone[]) => {
          if (!exam.firstnamezoneId) {
            this.firstnamezones = resBody;
          } else {
            this.zoneService
              .find(exam.firstnamezoneId)
              .pipe(
                map((subRes: HttpResponse<IZone>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IZone[]) => (this.firstnamezones = concatRes));
          }
        });

      this.zoneService
        .query({ filter: 'exam-is-null' })
        .pipe(
          map((res: HttpResponse<IZone[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IZone[]) => {
          if (!exam.notezoneId) {
            this.notezones = resBody;
          } else {
            this.zoneService
              .find(exam.notezoneId)
              .pipe(
                map((subRes: HttpResponse<IZone>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IZone[]) => (this.notezones = concatRes));
          }
        });

      this.scanService
        .query({ filter: 'exam-is-null' })
        .pipe(
          map((res: HttpResponse<IScan[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IScan[]) => {
          if (!exam.scanfileId) {
            this.scanfiles = resBody;
          } else {
            this.scanService
              .find(exam.scanfileId)
              .pipe(
                map((subRes: HttpResponse<IScan>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IScan[]) => (this.scanfiles = concatRes));
          }
        });

      this.courseService.query().subscribe((res: HttpResponse<ICourse[]>) => (this.courses = res.body || []));
    });
  }

  updateForm(exam: IExam): void {
    this.editForm.patchValue({
      id: exam.id,
      name: exam.name,
      templateId: exam.templateId,
      idzoneId: exam.idzoneId,
      namezoneId: exam.namezoneId,
      firstnamezoneId: exam.firstnamezoneId,
      notezoneId: exam.notezoneId,
      scanfileId: exam.scanfileId,
      courseId: exam.courseId,
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

  private createFromForm(): IExam {
    return {
      ...new Exam(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      templateId: this.editForm.get(['templateId'])!.value,
      idzoneId: this.editForm.get(['idzoneId'])!.value,
      namezoneId: this.editForm.get(['namezoneId'])!.value,
      firstnamezoneId: this.editForm.get(['firstnamezoneId'])!.value,
      notezoneId: this.editForm.get(['notezoneId'])!.value,
      scanfileId: this.editForm.get(['scanfileId'])!.value,
      courseId: this.editForm.get(['courseId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExam>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
