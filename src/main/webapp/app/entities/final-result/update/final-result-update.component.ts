import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFinalResult, FinalResult } from '../final-result.model';
import { FinalResultService } from '../service/final-result.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';

@Component({
  selector: 'jhi-final-result-update',
  templateUrl: './final-result-update.component.html',
})
export class FinalResultUpdateComponent implements OnInit {
  isSaving = false;

  studentsSharedCollection: IStudent[] = [];
  examsSharedCollection: IExam[] = [];

  editForm = this.fb.group({
    id: [],
    note: [],
    student: [],
    exam: [],
  });

  constructor(
    protected finalResultService: FinalResultService,
    protected studentService: StudentService,
    protected examService: ExamService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finalResult }) => {
      this.updateForm(finalResult);

      this.loadRelationshipsOptions();
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

  trackStudentById(index: number, item: IStudent): number {
    return item.id!;
  }

  trackExamById(index: number, item: IExam): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinalResult>>): void {
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

  protected updateForm(finalResult: IFinalResult): void {
    this.editForm.patchValue({
      id: finalResult.id,
      note: finalResult.note,
      student: finalResult.student,
      exam: finalResult.exam,
    });

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing(this.studentsSharedCollection, finalResult.student);
    this.examsSharedCollection = this.examService.addExamToCollectionIfMissing(this.examsSharedCollection, finalResult.exam);
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing(students, this.editForm.get('student')!.value))
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));

    this.examService
      .query()
      .pipe(map((res: HttpResponse<IExam[]>) => res.body ?? []))
      .pipe(map((exams: IExam[]) => this.examService.addExamToCollectionIfMissing(exams, this.editForm.get('exam')!.value)))
      .subscribe((exams: IExam[]) => (this.examsSharedCollection = exams));
  }

  protected createFromForm(): IFinalResult {
    return {
      ...new FinalResult(),
      id: this.editForm.get(['id'])!.value,
      note: this.editForm.get(['note'])!.value,
      student: this.editForm.get(['student'])!.value,
      exam: this.editForm.get(['exam'])!.value,
    };
  }
}
