import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStudent, Student } from '../student.model';
import { StudentService } from '../service/student.service';
import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';

@Component({
  selector: 'jhi-student-update',
  templateUrl: './student-update.component.html',
})
export class StudentUpdateComponent implements OnInit {
  isSaving = false;

  examSheetsSharedCollection: IExamSheet[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    firstname: [],
    ine: [null, [Validators.required]],
    caslogin: [],
    mail: [],
    examSheets: [],
  });

  constructor(
    protected studentService: StudentService,
    protected examSheetService: ExamSheetService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.updateForm(student);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const student = this.createFromForm();
    if (student.id !== undefined) {
      this.subscribeToSaveResponse(this.studentService.update(student));
    } else {
      this.subscribeToSaveResponse(this.studentService.create(student));
    }
  }

  trackExamSheetById(index: number, item: IExamSheet): number {
    return item.id!;
  }

  getSelectedExamSheet(option: IExamSheet, selectedVals?: IExamSheet[]): IExamSheet {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudent>>): void {
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

  protected updateForm(student: IStudent): void {
    this.editForm.patchValue({
      id: student.id,
      name: student.name,
      firstname: student.firstname,
      ine: student.ine,
      caslogin: student.caslogin,
      mail: student.mail,
      examSheets: student.examSheets,
    });

    this.examSheetsSharedCollection = this.examSheetService.addExamSheetToCollectionIfMissing(
      this.examSheetsSharedCollection,
      ...(student.examSheets ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.examSheetService
      .query()
      .pipe(map((res: HttpResponse<IExamSheet[]>) => res.body ?? []))
      .pipe(
        map((examSheets: IExamSheet[]) =>
          this.examSheetService.addExamSheetToCollectionIfMissing(examSheets, ...(this.editForm.get('examSheets')!.value ?? []))
        )
      )
      .subscribe((examSheets: IExamSheet[]) => (this.examSheetsSharedCollection = examSheets));
  }

  protected createFromForm(): IStudent {
    return {
      ...new Student(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      firstname: this.editForm.get(['firstname'])!.value,
      ine: this.editForm.get(['ine'])!.value,
      caslogin: this.editForm.get(['caslogin'])!.value,
      mail: this.editForm.get(['mail'])!.value,
      examSheets: this.editForm.get(['examSheets'])!.value,
    };
  }
}
