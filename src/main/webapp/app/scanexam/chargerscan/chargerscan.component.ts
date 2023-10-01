/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataUtils } from 'app/core/util/data-util.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { IScan, Scan } from 'app/entities/scan/scan.model';
// import { AlertError } from 'app/shared/alert/alert-error.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { finalize, firstValueFrom, Observable, scan, Subscriber } from 'rxjs';
import { ScanService } from '../../entities/scan/service/scan.service';
import { IExam } from '../../entities/exam/exam.model';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { NgxExtendedPdfViewerService, ScrollModeType } from 'ngx-extended-pdf-viewer';
import { IPage } from '../alignscan/alignscan.component';
import { TemplateService } from 'app/entities/template/service/template.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { PreferenceService } from '../preference-page/preference.service';
import { ViewandreorderpagesComponent } from '../viewandreorderpages/viewandreorderpages.component';

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
  editForm: UntypedFormGroup;
  progress = 0;
  pageInTemplate = 0;
  pageInScan = 0;
  message = '';
  reloadScan = false;

  observablePage: Observable<number> | undefined;
  observerPage: Subscriber<number> | undefined;

  @ViewChild('viewpage')
  viewcomponent!: ViewandreorderpagesComponent;

  //  course!: ICourse;
  //   scan!: IScan;
  //  template!: ITemplate;
  // pdfcontent!: string;
  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  cvState!: string;
  currentStudent = 0;
  nbreFeuilleParCopie = 2;
  numberPagesInScan = 0;
  // Change if partial update
  currentPageAlign = 1;
  // Change if partial update
  currentPageAlignOver = 1;

  partialAlign = false;
  startPage = 1;
  endPage = 1;

  avancement = 0;
  avancementunit = '';
  // private editedImage: HTMLCanvasElement | undefined;
  templatePages: Map<number, IPage> = new Map();
  phase1 = false;
  loaded = false;
  alignement = 'marker';
  alignementOptions = [
    { label: 'Off', value: 'off' },
    { label: 'with Marker', value: 'marker' },
    { label: 'without Marker', value: 'nomarker' },
  ];
  debugOptions = [
    { label: 'Off', value: false },
    { label: 'On', value: true },
  ];

  submessage = '';
  scale = 2;

  activeIndex = 1;
  responsiveOptions2: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  displayBasic = false;
  images: any[] = [];
  pageWithQCM: number[] = [];
  showVignette = true;
  constructor(
    private translate: TranslateService,
    private messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public confirmationService: ConfirmationService,
    private fb: UntypedFormBuilder,
    protected eventManager: EventManager,
    protected examService: ExamService,
    protected scanService: ScanService,
    public templateService: TemplateService,
    private pdfService: NgxExtendedPdfViewerService,
    private translateService: TranslateService,
    public db: CacheServiceImpl,
    protected questionService: QuestionService,
    protected zoneService: ZoneService,
    protected preferenceService: PreferenceService,
    protected dataUtils: DataUtils,
  ) {
    this.editForm = this.fb.group({
      content: [],
      contentContentType: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examid = params.get('examid')!;
        this.init().then(() => {});
        this.examService.find(+this.examid).subscribe(c => {
          this.exam = c.body!;
          this.exam.scanfileId;
        });
      }
    });
  }
  async init(): Promise<void> {
    const p = await this.db.countNonAlignImage(+this.examid!);
    this.pageInScan = p;
    const templatePage = await this.db.countPageTemplate(+this.examid!);
    this.pageInTemplate = templatePage;
  }

  /* byteSize(base64String: string): string {
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
  } */

  onUpload($event: any): void {
    if ($event.files && $event.files.length > 0) {
      this.uploadCache($event.files[0]);
    }
  }
  uploadCache(file: File): void {
    this.message = this.translateService.instant('scanexam.importencours');
    this.blocked = true;

    const formData: FormData = new FormData();
    formData.append('file', file);
    this.blob = file;
    this.save(formData);
  }

  save(formData: FormData): void {
    this.isSaving = true;
    this.blocked = true;
    const scan1 = this.createFromForm();
    this.progress = 0;
    /* const blob = new File([scan1.content!], scan1.id + '.pdf', {
      type: 'text/plain',
    });*/

    if (scan1.id !== undefined) {
      this.scanService
        .update({
          id: scan1.id,
          name: scan1.name,
          contentContentType: scan1.contentContentType,
        })
        .subscribe(e => {
          this.exam.scanfileId = e.body?.id;

          this.examService.update(this.exam).subscribe(() => {
            this.pipeToSaveResponse(this.scanService.uploadScan(formData, e.body?.id!));
          });
        });
    } else {
      this.scanService
        .create({
          name: scan1.name,
          contentContentType: scan1.contentContentType,
        })
        .subscribe(e => {
          this.exam.scanfileId = e.body?.id;
          this.examService.update(this.exam).subscribe(() => this.pipeToSaveResponse(this.scanService.uploadScan(formData, e.body?.id!)));
        });
    }
  }

  protected pipeToSaveResponse(result: Observable<HttpEvent<Upload>>): void {
    //  console.log(result)
    result.pipe(scan(calculateState, initialState)).subscribe(data => {
      this.progress = data.progress;
      if (data.progress >= 100) {
        this.message = this.translate.instant('scanexam.sqlinsertfile');
      }

      if (data.state === 'DONE') {
        this.onSaveSuccess();
      }
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScan>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.initCacheProcessing();
    this.reloadScan = false;
    //    this.gotoUE();
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
      contentContentType: 'application/pdf',
      //  content: this.editForm.get(['content'])!.value,
    };
  }

  async initQuestionQCM(examId: number): Promise<void> {
    const q1 = await firstValueFrom(this.questionService.query({ examId }));
    if (q1.body !== undefined && q1.body !== null) {
      const qcmq = q1.body.filter(q2 => q2.typeAlgoName === 'QCM');
      const pageWithQCM = [];
      for (const q of qcmq) {
        const _z = await firstValueFrom(this.zoneService.find(q.zoneId!));
        const z = _z.body;
        if (z?.pageNumber !== undefined && z?.pageNumber !== null) {
          pageWithQCM.push(z.pageNumber);
        }
      }
      this.pageWithQCM = [...new Set(pageWithQCM)];
    }
  }

  async removeElement(examId: number): Promise<any> {
    await this.db.removeElementForExam(examId);
  }
  async removeElementForPages(examId: number, pageStart: number, pageEnd: number): Promise<any> {
    await this.db.removeElementForExamForPages(examId, pageStart, pageEnd);
  }

  public async initCacheProcessing(): Promise<void> {
    this.translateService.get('scanexam.loadingscan').subscribe(res => (this.message = '' + res));
    this.blocked = true;

    this.showVignette = false;
    this.reloadScan = false;
    if (this.preferenceService.getPreference().pdfscale !== undefined) {
      this.scale = this.preferenceService.getPreference().pdfscale;
    }
    this.initQuestionQCM(+this.examid!);

    const data = await firstValueFrom(this.examService.find(+this.examid!));
    this.exam = data.body!;

    if (this.exam.templateId) {
      //      const e1 = await firstValueFrom(this.templateService.find(this.exam.templateId));
      // this.template = e1.body!;
      await this.removeElement(+this.examid!);
      const e1 = await firstValueFrom(this.templateService.getPdf(this.exam.templateId));
      this.blob1 = e1;
    }
  }

  public async pdfloaded(): Promise<void> {
    if (!this.phase1) {
      this.nbreFeuilleParCopie = this.pdfService.numberOfPages();
    }
    this.loaded = true;
    if (this.phase1) {
      if (this.pdfService.numberOfPages() !== 0) {
        // Change if partial update
        this.numberPagesInScan = this.pdfService.numberOfPages();
        this.avancementunit = ' / ' + this.numberPagesInScan;
      }
    }
    await this.process();
  }

  blob: any;
  blob1: any;

  async process(): Promise<void> {
    this.translateService.get('scanexam.processingencours').subscribe(res => (this.message = '' + res));

    this.blocked = true;
    this.currentPageAlignOver = 1;
    this.avancement = 0;
    if (!this.phase1) {
      for (let i = 1; i <= this.nbreFeuilleParCopie; i++) {
        await this.processPage(i, true);
        if (i === this.nbreFeuilleParCopie) {
          this.phase1 = true;
          if (this.exam.scanfileId) {
            if (this.blob !== undefined) {
              this.blob1 = this.blob;

              /*              const reader = new FileReader();
              console.error(this.blob);
              reader.readAsDataURL(this.blob);
              reader.onloadend = ()=> {
                console.error(reader.result)
                this.pdfcontent = (reader.result as string).split(',')[1];;
                this.blob = undefined
              }*/
            } else {
              // const loadedscan = (await firstValueFrom(this.scanService.find(this.exam.scanfileId))).body!;
              // this.pdfcontent = loadedscan.content!;
              const e1 = await firstValueFrom(this.scanService.getPdf(this.exam.scanfileId));
              this.blob1 = e1;
            }
          }
        }
      }
    } else {
      this.observablePage = new Observable(observer => {
        this.observerPage = observer;
      });

      this.observablePage.subscribe(
        e => {
          this.processPage(e, false);
          //          this.alignPage(e);
        },
        err => console.log(err),
        () => {
          this.phase1 = false;
          this.blob = undefined;
          this.blob1 = undefined;
          this.blocked = false;
          if (this.viewcomponent !== undefined) {
            this.viewcomponent.update();
          } else {
            this.db.countNonAlignImage(+this.examid!).then(p => {
              this.db.countPageTemplate(+this.examid!).then(p1 => {
                this.pageInScan = p;
                this.pageInTemplate = p1;
                this.showVignette = true;
              });
            });
          }

          this.progress = 0;
          this.submessage = '';
          this.message = '';
          //          this.saveData();
        },
      );

      this.startPage = 1;
      this.currentPageAlign = 1;

      while (
        this.currentPageAlign < this.startPage + ((navigator.hardwareConcurrency - 1) * 3) / 2 &&
        this.currentPageAlign < this.numberPagesInScan + 1
      ) {
        this.observerPage!.next(this.currentPageAlign);
        this.currentPageAlign = this.currentPageAlign + 1;
      }
    }
  }

  async saveTemplateImage(pageN: number, imageD: any): Promise<void> {
    await this.db.addTemplate({
      examId: +this.examid!,
      pageNumber: pageN,
      value: JSON.stringify(
        {
          pages: imageD,
        },
        this.replacer,
      ),
    });
  }

  async saveNonAligneImage(pageN: number, imageD: any): Promise<void> {
    await this.db.addNonAligneImage({
      examId: +this.examid!,
      pageNumber: pageN,
      value: JSON.stringify(
        {
          pages: imageD,
        },
        this.replacer,
      ),
    });
    if (this.currentPageAlign < this.numberPagesInScan + 1) {
      this.observerPage?.next(this.currentPageAlign);
      this.currentPageAlign = this.currentPageAlign + 1;
    }
    if (this.currentPageAlignOver < this.numberPagesInScan) {
      this.avancement = this.currentPageAlignOver;
      this.currentPageAlignOver = this.currentPageAlignOver + 1;
      this.progress = Math.floor((this.avancement * 100) / this.numberPagesInScan);
      this.submessage = '' + this.avancement + this.avancementunit;
    } else {
      this.avancement = this.currentPageAlignOver;
      this.currentPageAlignOver = this.currentPageAlignOver + 1;
      this.observerPage?.complete();
    }
  }

  gotoUE(): any {
    this.router.navigateByUrl('/exam/' + this.examid!);
  }

  public async processPage(page: number, template: boolean): Promise<number> {
    const scale = { scale: this.scale };
    const dataURL = await this.pdfService.getPageAsImage(page, scale);
    const p = await this.saveImageScan(dataURL, page, template);
    return p + 1;
  }

  async saveImageScan(file: any, pagen: number, template: boolean): Promise<number> {
    // await this.saveNonAligneImage(pagen, file);
    return new Promise(resolve => {
      const i = new Image();
      i.onload = async () => {
        const editedImage = document.createElement('canvas');
        editedImage.width = i.width;
        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        let exportImageType = 'image/webp';
        let compression = 0.65;
        if (
          this.preferenceService.getPreference().exportImageCompression !== undefined &&
          this.preferenceService.getPreference().exportImageCompression > 0 &&
          this.preferenceService.getPreference().exportImageCompression <= 1
        ) {
          compression = this.preferenceService.getPreference().exportImageCompression;
        }

        let paget = pagen % this.nbreFeuilleParCopie;
        if (paget === 0) {
          paget = this.nbreFeuilleParCopie;
        }

        if (this.pageWithQCM.includes(paget) && compression < 0.95) {
          compression = 0.95;
        }

        if (
          this.preferenceService.getPreference().imageTypeExport !== undefined &&
          ['image/webp', 'image/png', 'image/jpg'].includes(this.preferenceService.getPreference().imageTypeExport)
        ) {
          exportImageType = this.preferenceService.getPreference().imageTypeExport;
        }

        const webPImageURL = editedImage.toDataURL(exportImageType, compression);
        if (template) {
          await this.saveTemplateImage(pagen, webPImageURL);
        } else {
          await this.saveNonAligneImage(pagen, webPImageURL);
        }
        resolve(pagen);
      };
      i.src = file;
    });
  }

  replacer(key: any, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
}
