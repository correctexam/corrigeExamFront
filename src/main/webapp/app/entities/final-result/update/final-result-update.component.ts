/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IFinalResult, FinalResult } from '../final-result.model';
import { FinalResultService } from '../service/final-result.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';

type SelectableEntity = IStudent | IExam;

@Component({
  selector: 'jhi-final-result-update',
  templateUrl: './final-result-update.component.html',
})
export class FinalResultUpdateComponent implements OnInit {
  isSaving = false;
  students: IStudent[] = [];
  exams: IExam[] = [];

  editForm = this.fb.group({
    id: [],
    note: [],
    studentId: [],
    examId: [],
  });

  constructor(
    protected finalResultService: FinalResultService,
    protected studentService: StudentService,
    protected examService: ExamService,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finalResult }) => {
      this.updateForm(finalResult);

      this.studentService.query().subscribe((res: HttpResponse<IStudent[]>) => (this.students = res.body || []));

      this.examService.query().subscribe((res: HttpResponse<IExam[]>) => (this.exams = res.body || []));
    });
  }

  updateForm(finalResult: IFinalResult): void {
    this.editForm.patchValue({
      id: finalResult.id,
      note: finalResult.note,
      studentId: finalResult.studentId,
      examId: finalResult.examId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const finalResult = this.createFromForm();
    if (finalResult.id !== undefined) {
      this.subscribeToSaveResponse(this.finalResultService.update(finalResult));
    } else {
      this.subscribeToSaveResponse(this.finalResultService.create(finalResult));
    }
  }

  private createFromForm(): IFinalResult {
    return {
      ...new FinalResult(),
      id: this.editForm.get(['id'])!.value,
      note: this.editForm.get(['note'])!.value,
      studentId: this.editForm.get(['studentId'])!.value,
      examId: this.editForm.get(['examId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinalResult>>): void {
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
