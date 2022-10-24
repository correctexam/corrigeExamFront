/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
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
import { finalize, Observable, scan } from 'rxjs';
import { ScanService } from '../../entities/scan/service/scan.service';
import { IExam } from '../../entities/exam/exam.model';

interface Upload {
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  body?: IScan;
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress;
}

const initialState: Upload = { state: 'PENDING', progress: 0 };
const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
  if (isHttpProgressEvent(event)) {
    return {
      progress: event.total ? Math.round((100 * event.loaded) / event.total) : upload.progress,
      state: 'IN_PROGRESS',
    };
  }
  if (isHttpResponse(event)) {
    // eslint-disable-next-line no-console
    return {
      body: event.body as IScan,
      progress: 100,
      state: 'DONE',
    };
  }
  return upload;
};

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
  progress = 0;
  message = '';
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
    const scan1 = this.createFromForm();
    this.progress = 0;
    if (scan1.id !== undefined) {
      // this.scanService.updateWithProgress(scan1).subscribe(e=> console.log(e))
      this.pipeToSaveResponse(this.scanService.updateWithProgress(scan1));
    } else {
      this.pipeToSaveResponse(this.scanService.createWithProgress(scan1));
    }
  }

  protected pipeToSaveResponse(result: Observable<HttpEvent<IScan>>): void {
    //  console.log(result)
    result.pipe(scan(calculateState, initialState)).subscribe(data => {
      this.progress = data.progress;
      if (this.progress >= 100) {
        this.message = this.translate.instant('scanexam.sqlinsertfile');
      }

      if (data.state === 'DONE') {
        this.onSaveSuccess(data.body!);
      }
    });
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

  protected updateForm(scan1: IScan): void {
    this.editForm.patchValue({
      name: scan1.name,
      content: scan1.content,
      contentContentType: scan1.contentContentType,
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
