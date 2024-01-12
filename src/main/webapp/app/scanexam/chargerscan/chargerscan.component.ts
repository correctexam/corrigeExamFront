/* eslint-disable curly */
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
import { finalize, firstValueFrom, Observable, scan } from 'rxjs';
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
import { PromisePool } from '@supercharge/promise-pool';
import { Title } from '@angular/platform-browser';

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
  pageAlreadyScan = 0;
  message = '';
  reloadScan = false;
  merge = true;
  saveTemplate = true;
  loaded = false;
  //  observablePage: Observable<number> | undefined;
  //  observerPage: Subscriber<number> | undefined;

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
  firstPageToLoad = 0;
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
    private titleService: Title,
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
          // this.exam.scanfileId;
          this.activatedRoute.data.subscribe(e => {
            this.translateService.get(e['pageTitle'], { examName: this.exam?.name, courseName: this.exam?.courseName }).subscribe(e1 => {
              this.titleService.setTitle(e1);
            });
          });
        });
      }
    });
  }
  async init(): Promise<void> {
    const p = await this.db.countNonAlignImage(+this.examid!);
    this.pageAlreadyScan = p;
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
      this.uploadScan($event.files[0]);
    }
  }
  uploadScan(file: File): void {
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
            this.pipeToSaveResponse(this.scanService.uploadScan(formData, e.body?.id!, this.merge));
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
          this.examService
            .update(this.exam)
            .subscribe(() => this.pipeToSaveResponse(this.scanService.uploadScan(formData, e.body?.id!, this.merge)));
        });
    }
  }

  protected pipeToSaveResponse(result: Observable<HttpEvent<Upload>>): void {
    //  console.log(result)
    result.pipe(scan(calculateState, initialState)).subscribe({
      next: data => {
        this.progress = data.progress;
        if (data.progress >= 100) {
          this.message = this.translate.instant('scanexam.sqlinsertfile');
        }

        if (data.state === 'DONE') {
          this.onSaveSuccess();
        }
      },
      error: () => {
        this.onSaveError();
      },
      complete: () => console.log('the end'),
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScan>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    if (this.merge) {
      this.initCacheProcessing(false);
    } else {
      this.initCacheProcessing(true);
    }
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

  public async initCacheProcessing(removeCache: boolean): Promise<void> {
    this.saveTemplate = removeCache;

    const pageCacheInTemplate = await this.db.countPageTemplate(+this.examid!);
    if (pageCacheInTemplate === 0) {
      this.saveTemplate = true;
    }
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
      if (removeCache || !this.merge) {
        await this.removeElement(+this.examid!);
      } else {
        this.firstPageToLoad = await this.db.countNonAlignImage(+this.examid!);
      }
      const e1 = await firstValueFrom(this.templateService.getPdf(this.exam.templateId));
      this.blob1 = e1;
      this.loaded = true;
    }
  }
  i = 1;
  public async pdfloaded(): Promise<void> {
    if (this.loaded && this.pdfService.numberOfPages() !== 0) {
      if (!this.phase1) {
        this.nbreFeuilleParCopie = this.pdfService.numberOfPages();
        await this.process();
      } else {
        if (this.pdfService.numberOfPages() !== 0 && this.i < 20) {
          // Change if partial update
          this.numberPagesInScan = this.pdfService.numberOfPages();
          this.avancementunit = ' / ' + this.numberPagesInScan;
          await this.process();
          this.i = this.i + 1;
        }
      }
    }
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
            } else {
              this.blob1 = await firstValueFrom(this.scanService.getPdf(this.exam.scanfileId));
            }
          }
        }
      }
    } else {
      this.startPage = 1;
      this.currentPageAlign = 1;

      const pagesnumber: number[] = [];
      for (let i = 1; i <= this.numberPagesInScan; i++) {
        pagesnumber.push(i);
      }
      await PromisePool.for(pagesnumber)
        .withConcurrency(30)
        /*        .onTaskStarted((page, pool) => {
          console.log(`Progress: ${pool.processedPercentage()}%`);
          console.log(`Active tasks: ${pool.processedItems().length}`);
          console.log(`Active tasks: ${pool.activeTasksCount()}`);
          console.log(`Finished tasks: ${pool.processedItems().length}`);
          console.log(`Finished tasks: ${pool.processedCount()}`);
        })*/
        .onTaskFinished((page, pool) => {
          this.progress = pool.processedPercentage();
          this.avancement = this.currentPageAlignOver;
          this.currentPageAlignOver = this.currentPageAlignOver + 1;
          this.submessage = '' + this.avancement + this.avancementunit;
        })
        .process(async page => {
          await this.processPage(page, false);
        });
      //        await Promise.all(this.imagesP);
      /*        if (this.images1.length>20){
          await this.db.addNonAligneImages(this.images1);
          this.images1 = [];
        }*/

      this.loaded = false;
      // this.blob = undefined;
      // this.blob1 = undefined;
      // this.phase1 = false;
      this.blocked = false;
      this.firstPageToLoad = 0;
      if (this.viewcomponent !== undefined) {
        this.viewcomponent.update();
      } else {
        this.db.countNonAlignImage(+this.examid!).then(p => {
          this.db.countPageTemplate(+this.examid!).then(p1 => {
            this.pageAlreadyScan = p;
            this.pageInTemplate = p1;
            this.showVignette = true;
          });
        });
      }

      this.progress = 0;
      this.submessage = '';
      this.message = '';
    }
    this.blocked = false;
  }

  async saveTemplateImage(pageN: number, imageD: any): Promise<void> {
    if (this.saveTemplate) {
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
  }

  images1: any[] = [];

  async saveNonAligneImage(pageN: number, imageD: any): Promise<void> {
    const im1 = {
      examId: +this.examid!,
      pageNumber: pageN + this.firstPageToLoad,
      value: JSON.stringify(
        {
          pages: imageD,
        },
        this.replacer,
      ),
    };
    await this.db.addNonAligneImage(im1);
    /* this.images1.push(im1)
    if (this.images1.length>20){
      await this.db.addNonAligneImages(this.images1);
      this.images1 = [];
    }*/
  }

  gotoUE(): any {
    this.router.navigateByUrl('/exam/' + this.examid!);
  }

  //  imagesP: Promise<void>[] = [];
  public async processPage(page: number, template: boolean): Promise<void> {
    const scale = { scale: this.scale };
    if (page < 10 && !template) console.time('processPage' + page);
    if (page < 10 && !template) console.timeLog('processPage' + page, 'before getDataURL ', page);
    const dataURL = await this.pdfService.getPageAsImage(page, scale);
    //    this.pdfService.getP
    if (page < 10 && !template) console.timeLog('processPage' + page, 'getDataURL ', page);
    await this.saveImageScan(dataURL, page, template);
    if (page < 10 && !template) console.timeLog('processPage' + page, 'saveImageScan ', page);
  }

  saveImageScan(file: any, pagen: number, template: boolean): Promise<void> {
    return new Promise(resolve => {
      if (pagen === 1 && !template) console.timeLog('processPage', 'start', pagen);

      const i = new Image();
      i.onload = async () => {
        if (pagen === 1 && !template) console.timeLog('processPage', 'image Loaded ', pagen);
        const editedImage = new OffscreenCanvas(i.width, i.height);

        // document.createElement('canvas');
        // document.createOff
        // editedImage.width = i.width;
        // editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        if (pagen === 1 && !template) console.timeLog('processPage', 'draw first canvas ', pagen);

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

        const webPImageBlob = await editedImage.convertToBlob({
          type: exportImageType,
          quality: compression,
        });
        const webPImageURL = await blobToDataURL(webPImageBlob);
        if (template) {
          await this.saveTemplateImage(pagen, webPImageURL);
          resolve();
        } else {
          if (pagen === 1 && !template) console.timeLog('processPage', 'before save ', pagen);
          await this.saveNonAligneImage(pagen, webPImageURL);
          resolve();

          if (pagen === 1 && !template) console.timeLog('processPage', 'after save ', pagen);
        }
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

function blobToDataURL(blob: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const a = new FileReader();
    a.onload = e => {
      if (e.target !== null) {
        resolve(e.target.result);
      } else {
        reject();
      }
    };
    a.readAsDataURL(blob);
  });
}
