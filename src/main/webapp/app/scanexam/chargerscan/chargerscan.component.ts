/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { IScan, Scan } from 'app/entities/scan/scan.model';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { finalize, Observable } from 'rxjs';
import { ScanService } from '../../entities/scan/service/scan.service';
import { IExam } from '../../entities/exam/exam.model';

@Component({
  selector: 'jhi-chargerscan',
  templateUrl: './chargerscan.component.html',
  styleUrls: ['./chargerscan.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ChargerscanComponent implements OnInit {
  blocked = false;
  examid: string | undefined = undefined;
  isSaving = false;
  exam: IExam = {};
  editForm = this.fb.group({
    content: [],
    contentContentType: [null, [Validators.required]],
  });

  constructor(
    private translate: TranslateService,
    private messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public confirmationService: ConfirmationService,
    private fb: FormBuilder,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected examService: ExamService,
    protected scanService: ScanService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examid = params.get('examid')!;
        this.examService.find(+this.examid).subscribe(c => {
          this.exam = c.body!;
        });
      }
    });
  }

  gotoUE(): void {
    this.router.navigateByUrl('/exam/' + this.examid);
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

  save(): void {
    this.isSaving = true;
    this.blocked = true;
    const scan = this.createFromForm();

    if (scan.id !== undefined) {
      this.subscribeToSaveResponse(this.scanService.update(scan));
    } else {
      this.subscribeToSaveResponse(this.scanService.create(scan));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScan>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: e => this.onSaveSuccess(e.body),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(s: IScan | null): void {
    this.exam.scanfileId = s?.id;
    this.examService.update(this.exam).subscribe(
      () => {
        this.blocked = false;

        this.gotoUE();
      },
      () => this.onSaveError()
    );
  }

  protected onSaveError(): void {
    this.blocked = false;
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(scan: IScan): void {
    this.editForm.patchValue({
      name: scan.name,
      content: scan.content,
      contentContentType: scan.contentContentType,
    });
  }

  protected createFromForm(): IScan {
    return {
      ...new Scan(),
      id: this.exam.scanfileId,
      name: this.exam.name + 'StudentSheets.pdf',
      contentContentType: this.editForm.get(['contentContentType'])!.value,
      content: this.editForm.get(['content'])!.value,
    };
  }
}
