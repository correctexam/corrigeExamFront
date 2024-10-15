/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IExamSheet, ExamSheet } from '../exam-sheet.model';
import { ExamSheetService } from '../service/exam-sheet.service';
import { IScan } from 'app/entities/scan/scan.model';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf, NgFor } from '@angular/common';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-exam-sheet-update',
  templateUrl: './exam-sheet-update.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateDirective, AlertErrorComponent, NgIf, NgFor, FaIconComponent],
})
export class ExamSheetUpdateComponent implements OnInit {
  isSaving = false;
  scans: IScan[] = [];

  editForm: UntypedFormGroup;

  constructor(
    protected examSheetService: ExamSheetService,
    protected scanService: ScanService,
    protected activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
  ) {
    this.editForm = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
      pagemin: [],
      pagemax: [],
      scanId: [],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examSheet }) => {
      this.updateForm(examSheet);

      this.scanService.query().subscribe((res: HttpResponse<IScan[]>) => (this.scans = res.body || []));
    });
  }

  updateForm(examSheet: IExamSheet): void {
    this.editForm.patchValue({
      id: examSheet.id,
      name: examSheet.name,
      pagemin: examSheet.pagemin,
      pagemax: examSheet.pagemax,
      scanId: examSheet.scanId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const examSheet = this.createFromForm();
    if (examSheet.id !== undefined) {
      this.subscribeToSaveResponse(this.examSheetService.update(examSheet));
    } else {
      this.subscribeToSaveResponse(this.examSheetService.create(examSheet));
    }
  }

  private createFromForm(): IExamSheet {
    return {
      ...new ExamSheet(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      pagemin: this.editForm.get(['pagemin'])!.value,
      pagemax: this.editForm.get(['pagemax'])!.value,
      scanId: this.editForm.get(['scanId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExamSheet>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IScan): any {
    return item.id;
  }
}
