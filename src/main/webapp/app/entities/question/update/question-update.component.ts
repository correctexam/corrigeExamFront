import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestion, Question } from '../question.model';
import { QuestionService } from '../service/question.service';
import { IZone } from 'app/entities/zone/zone.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';

@Component({
  selector: 'jhi-question-update',
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  isSaving = false;

  zonesCollection: IZone[] = [];
  examsSharedCollection: IExam[] = [];

  editForm = this.fb.group({
    id: [],
    numero: [null, [Validators.required]],
    point: [],
    zone: [],
    exam: [],
  });

  constructor(
    protected questionService: QuestionService,
    protected zoneService: ZoneService,
    protected examService: ExamService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ question }) => {
      this.updateForm(question);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const question = this.createFromForm();
    if (question.id !== undefined) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  trackZoneById(index: number, item: IZone): number {
    return item.id!;
  }

  trackExamById(index: number, item: IExam): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
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

  protected updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      id: question.id,
      numero: question.numero,
      point: question.point,
      zone: question.zone,
      exam: question.exam,
    });

    this.zonesCollection = this.zoneService.addZoneToCollectionIfMissing(this.zonesCollection, question.zone);
    this.examsSharedCollection = this.examService.addExamToCollectionIfMissing(this.examsSharedCollection, question.exam);
  }

  protected loadRelationshipsOptions(): void {
    this.zoneService
      .query({ filter: 'question-is-null' })
      .pipe(map((res: HttpResponse<IZone[]>) => res.body ?? []))
      .pipe(map((zones: IZone[]) => this.zoneService.addZoneToCollectionIfMissing(zones, this.editForm.get('zone')!.value)))
      .subscribe((zones: IZone[]) => (this.zonesCollection = zones));

    this.examService
      .query()
      .pipe(map((res: HttpResponse<IExam[]>) => res.body ?? []))
      .pipe(map((exams: IExam[]) => this.examService.addExamToCollectionIfMissing(exams, this.editForm.get('exam')!.value)))
      .subscribe((exams: IExam[]) => (this.examsSharedCollection = exams));
  }

  protected createFromForm(): IQuestion {
    return {
      ...new Question(),
      id: this.editForm.get(['id'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      point: this.editForm.get(['point'])!.value,
      zone: this.editForm.get(['zone'])!.value,
      exam: this.editForm.get(['exam'])!.value,
    };
  }
}
