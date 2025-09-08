import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITemplate, Template } from '../template.model';
import { TemplateService } from '../service/template.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  selector: 'jhi-template-update',
  templateUrl: './template-update.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertErrorComponent, FaIconComponent],
})
export class TemplateUpdateComponent implements OnInit {
  isSaving = false;

  editForm: UntypedFormGroup;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected templateService: TemplateService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
  ) {
    this.editForm = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
      content: [],
      contentContentType: [],
      mark: [],
      autoMapStudentCopyToList: [],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ template }) => {
      this.updateForm(template);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('gradeScopeIsticApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const template = this.createFromForm();
    if (template.id !== undefined) {
      this.subscribeToSaveResponse(this.templateService.update(template));
    } else {
      this.subscribeToSaveResponse(this.templateService.create(template));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITemplate>>): void {
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

  protected updateForm(template: ITemplate): void {
    this.editForm.patchValue({
      id: template.id,
      name: template.name,
      content: template.content,
      contentContentType: template.contentContentType,
      mark: template.mark,
      autoMapStudentCopyToList: template.autoMapStudentCopyToList,
    });
  }

  protected createFromForm(): ITemplate {
    return {
      ...new Template(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      contentContentType: this.editForm.get(['contentContentType'])!.value,
      content: this.editForm.get(['content'])!.value,
      mark: this.editForm.get(['mark'])!.value,
      autoMapStudentCopyToList: this.editForm.get(['autoMapStudentCopyToList'])!.value,
    };
  }
}
