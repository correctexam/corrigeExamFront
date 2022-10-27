import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IZone, Zone } from '../zone.model';
import { ZoneService } from '../service/zone.service';

@Component({
  selector: 'jhi-zone-update',
  templateUrl: './zone-update.component.html',
})
export class ZoneUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    pageNumber: [],
    xInit: [],
    yInit: [],
    width: [],
    height: [],
  });

  constructor(protected zoneService: ZoneService, protected activatedRoute: ActivatedRoute, protected fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ zone }) => {
      this.updateForm(zone);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const zone = this.createFromForm();
    if (zone.id !== undefined) {
      this.subscribeToSaveResponse(this.zoneService.update(zone));
    } else {
      this.subscribeToSaveResponse(this.zoneService.create(zone));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IZone>>): void {
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

  protected updateForm(zone: IZone): void {
    this.editForm.patchValue({
      id: zone.id,
      pageNumber: zone.pageNumber,
      xInit: zone.xInit,
      yInit: zone.yInit,
      width: zone.width,
      height: zone.height,
    });
  }

  protected createFromForm(): IZone {
    return {
      ...new Zone(),
      id: this.editForm.get(['id'])!.value,
      pageNumber: this.editForm.get(['pageNumber'])!.value,
      xInit: this.editForm.get(['xInit'])!.value,
      yInit: this.editForm.get(['yInit'])!.value,
      width: this.editForm.get(['width'])!.value,
      height: this.editForm.get(['height'])!.value,
    };
  }
}
