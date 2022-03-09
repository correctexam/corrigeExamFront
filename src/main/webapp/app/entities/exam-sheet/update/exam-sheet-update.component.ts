import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IExamSheet, ExamSheet } from '../exam-sheet.model';
import { ExamSheetService } from '../service/exam-sheet.service';
import { IScan } from 'app/entities/scan/scan.model';
import { ScanService } from 'app/entities/scan/service/scan.service';

@Component({
  selector: 'jhi-exam-sheet-update',
  templateUrl: './exam-sheet-update.component.html',
})
export class ExamSheetUpdateComponent implements OnInit {
  isSaving = false;

  scansSharedCollection: IScan[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    pagemin: [],
    pagemax: [],
    scan: [],
  });

  constructor(
    protected examSheetService: ExamSheetService,
    protected scanService: ScanService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examSheet }) => {
      this.updateForm(examSheet);

      this.loadRelationshipsOptions();
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

  trackScanById(index: number, item: IScan): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExamSheet>>): void {
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

  protected updateForm(examSheet: IExamSheet): void {
    this.editForm.patchValue({
      id: examSheet.id,
      name: examSheet.name,
      pagemin: examSheet.pagemin,
      pagemax: examSheet.pagemax,
      scan: examSheet.scan,
    });

    this.scansSharedCollection = this.scanService.addScanToCollectionIfMissing(this.scansSharedCollection, examSheet.scan);
  }

  protected loadRelationshipsOptions(): void {
    this.scanService
      .query()
      .pipe(map((res: HttpResponse<IScan[]>) => res.body ?? []))
      .pipe(map((scans: IScan[]) => this.scanService.addScanToCollectionIfMissing(scans, this.editForm.get('scan')!.value)))
      .subscribe((scans: IScan[]) => (this.scansSharedCollection = scans));
  }

  protected createFromForm(): IExamSheet {
    return {
      ...new ExamSheet(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      pagemin: this.editForm.get(['pagemin'])!.value,
      pagemax: this.editForm.get(['pagemax'])!.value,
      scan: this.editForm.get(['scan'])!.value,
    };
  }
}
