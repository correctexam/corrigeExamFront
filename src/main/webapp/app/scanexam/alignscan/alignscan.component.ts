/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { IImageAlignement, IImageAlignementInput } from '../services/align-images.service';
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { faObjectUngroup } from '@fortawesome/free-solid-svg-icons';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CacheUploadService, CacheUploadNotification } from '../exam-detail/cacheUpload.service';
import { TranslateService } from '@ngx-translate/core';
import { fromWorkerPool } from 'observable-webworker';
import { Observable, Subscriber, firstValueFrom } from 'rxjs';
import { worker1 } from '../services/workerimport';
import { PreferenceService } from '../preference-page/preference.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PartialAlignModalComponent } from './partial-align-modal/partial-align-modal.component';
// import { db as dbsqlite } from '../db/dbsqlite';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { QuestionService } from '../../entities/question/service/question.service';
import { ZoneService } from '../../entities/zone/service/zone.service';
import { TemplateService } from 'app/entities/template/service/template.service';
import { ScanService } from 'app/entities/scan/service/scan.service';

export interface IPage {
  image?: ArrayBuffer;
  page?: number;
  width?: number;
  height?: number;
}

@Component({
  selector: 'jhi-align-scan',
  templateUrl: './alignscan.component.html',
  styleUrls: ['./alignscan.component.scss'],
  providers: [MessageService, DialogService],
})
export class AlignScanComponent implements OnInit, CacheUploadNotification {
  faObjectGroup = faObjectGroup as IconProp;
  faObjectUngroup = faObjectUngroup as IconProp;
  examId = '';
  exam!: IExam;
  // cvState!: string;
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
  loaded = false;
  alignement = 'marker';
  alignementOptions: any = [
    { label: 'scanexam.off', value: 'off', tooltip: 'scanexam.offtooltip' },
    { label: 'scanexam.withmarker', value: 'marker', tooltip: 'scanexam.withmarkertooltip' },
    { label: 'scanexam.withoutmarker', value: 'nomarker', tooltip: 'scanexam.withoutmarkertooltip' },
  ];
  debugOptions = [
    { label: 'Off', value: false },
    { label: 'On', value: true },
  ];
  blocked = false;
  observable: Observable<IImageAlignementInput> | undefined;
  observer: Subscriber<IImageAlignementInput> | undefined;
  observablePage: Observable<number> | undefined;
  observerPage: Subscriber<number> | undefined;

  allowPartialAlign = false;
  message = '';
  submessage = '';
  progress = 0;
  scale = 2;
  nbPageAlignInCache = 0;
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
  _showVignette = false;
  showMapping = false;

  layoutsidebarVisible = false;
  nbreCore = navigator.hardwareConcurrency - 2;
  nbreCoreMax = navigator.hardwareConcurrency - 2;

  constructor(
    public examService: ExamService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    private cacheUploadService: CacheUploadService,
    private translateService: TranslateService,
    private messageService: MessageService,
    private preferenceService: PreferenceService,
    public dialogService: DialogService,
    public db: CacheServiceImpl,
    protected questionService: QuestionService,
    protected zoneService: ZoneService,
    protected templateService: TemplateService,
    protected scanService: ScanService,
  ) {}
  setMessage(v: string): void {
    this.message = v;
  }
  setSubMessage(v: string): void {
    this.submessage = v;
  }
  setBlocked(v: boolean): void {
    this.blocked = v;
  }
  setProgress(v: number): void {
    this.progress = v;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        if (this.preferenceService.getPreference().pdfscale !== undefined) {
          this.scale = this.preferenceService.getPreference().pdfscale;
        }
        this.examService.find(+this.examId).subscribe(data => {
          this.exam = data.body!;
          this.db.countPageTemplate(+this.examId).then(v => {
            this.nbreFeuilleParCopie = v;
            this.checkIfAlreadyAlign();
            this.loaded = true;
          });
        });
      }
    });
  }

  async checkIfAlreadyAlign(): Promise<void> {
    const p = await this.db.countNonAlignImage(+this.examId);
    // const p1 = await this.db.countAlignImage(+this.examId);
    this.nbPageAlignInCache = await this.db.countAlignImage(+this.examId);
    if (p > this.nbPageAlignInCache) {
      this.startPage = this.nbPageAlignInCache + 1;
      this.endPage = p;
    }
    this.allowPartialAlign = p > 0; // && p1 > 0 && p === p1;
  }

  initPool(): void {
    this.observable = new Observable(observer => {
      this.observer = observer;
    });

    fromWorkerPool<IImageAlignementInput, IImageAlignement>(worker1, this.observable, {
      selectTransferables: input => [input.imageA],
      workerCount: this.nbreCore,
      fallbackWorkerCount: 3,
    }).subscribe(
      (e: IImageAlignement) => {
        const im = new ImageData(new Uint8ClampedArray(e.imageAligned!), e.imageAlignedWidth!, e.imageAlignedHeight);
        e.imageAligned = undefined;
        if (e.imagesDebugTracesWidth !== undefined) {
          const dim = new ImageData(new Uint8ClampedArray(e.imagesDebugTraces!), e.imagesDebugTracesWidth!, e.imagesDebugTracesHeight);
          e.imagesDebugTraces = undefined;

          this.images.push({
            src: this.imageDataToDataURL(dim),
            alt: 'Description for Image 2',
            title: 'Exam',
          });
        }

        this.saveEligneImage(e.pageNumber!, im).then(() => {
          im.data.set([]);
          if (this.currentPageAlign < this.numberPagesInScan + 1) {
            this.observerPage?.next(this.currentPageAlign);
            this.currentPageAlign = this.currentPageAlign + 1;
          }
          if (this.currentPageAlignOver < this.numberPagesInScan) {
            this.avancement = this.currentPageAlignOver;
            this.currentPageAlignOver = this.currentPageAlignOver + 1;
          } else {
            this.avancement = this.currentPageAlignOver;
            this.currentPageAlignOver = this.currentPageAlignOver + 1;
            this.observerPage?.complete();
            this.observer?.complete();
          }
        });
      },
      err => {
        console.log(err);
      },
    );
  }

  async removeElement(examId: number): Promise<any> {
    await this.db.removePageAlignForExam(examId);
  }
  async removeElementForPages(examId: number, pageStart: number, pageEnd: number): Promise<any> {
    await this.db.removePageAlignForExamForPages(examId, pageStart, pageEnd);
  }

  public async load(): Promise<void> {
    const numberPagesInScan = await this.db.countNonAlignImage(+this.examId);

    if (numberPagesInScan !== 0) {
      // Change ipdfloadedf partial update
      if (this.partialAlign) {
        if (this.endPage < numberPagesInScan) {
          this.numberPagesInScan = this.endPage;
        } else {
          this.numberPagesInScan = numberPagesInScan;
        }
      } else {
        this.numberPagesInScan = numberPagesInScan;
      }
      this.avancementunit = ' / ' + this.numberPagesInScan;
    }
  }

  async process(debug: boolean): Promise<void> {
    this.showMapping = debug;
    this._showVignette = false;
    this.translateService.get('scanexam.alignementencours').subscribe(res => (this.message = '' + res));

    this.blocked = true;
    // Change if partial update
    if (this.partialAlign) {
      this.currentPageAlignOver = this.startPage;
      this.avancement = this.startPage;
      this.removeElementForPages(+this.examId, this.startPage, this.endPage);
    } else {
      this.removeElement(+this.examId);
      this.currentPageAlignOver = 1;
      this.avancement = 0;
    }
    await this.load();
    await this.loadTemplatePage();
    this.initPool();

    this.exportAsImage();
  }
  async loadTemplatePage(): Promise<void> {
    return new Promise(resolve => {
      const promises: Promise<void>[] = [];
      for (let i = 1; i <= this.nbreFeuilleParCopie; i++) {
        const p1 = new Promise<void>(resolve1 => {
          this.db.getFirstTemplate(+this.examId!, i).then(dataURL => {
            const image = JSON.parse(dataURL!.value, this.reviver);
            this.loadImage(image.pages, i, (_image: ImageData, _page: number, _width: number, _height: number) => {
              this.templatePages.set(_page, {
                image: _image.data.buffer,
                page: _page,
                width: _width,
                height: _height,
              });
              resolve1();
            });
          });
        });
        promises.push(p1);
      }
      Promise.all(promises).then(() => resolve());
    });
  }

  private async saveData(): Promise<any> {
    // Change if partial update
    if (!this.partialAlign) {
      await this.db.addExam(+this.examId);
    }

    this.translateService.get('scanexam.exportcacheencours').subscribe(res => (this.message = '' + res));
    this.db.countNonAlignImage(+this.examId).then(value => {
      this.cacheUploadService.exportCache(+this.examId, this.translateService, this.messageService, value, this).then(() => {
        this.blocked = false;

        if (this.showMapping) {
          this.displayBasic = true;
        } else {
          this._showVignette = true;
        }
        this.partialAlign = false;
        this.showMapping = false;
        this.startPage = 1;
        this.currentPageAlign = 1;
        this.endPage = value;
        this.numberPagesInScan = value;
        this.db.countAlignImage(+this.examId).then(e => (this.nbPageAlignInCache = e));
      });
    });
  }

  async saveEligneImage(pageN: number, imageD: ImageData): Promise<void> {
    const imageString = this.imageDataToDataURL(imageD);
    await this.db.addAligneImage({
      examId: +this.examId,
      pageNumber: pageN,
      value: JSON.stringify(
        {
          pages: imageString!,
        },
        this.replacer,
      ),
    });
  }

  gotoUE(): any {
    this.router.navigateByUrl('/exam/' + this.examId);
  }

  public exportAsImage(): void {
    this.observablePage = new Observable(observer => {
      this.observerPage = observer;
    });

    this.observablePage.subscribe(
      e => {
        this.alignPage(e);
      },
      err => console.log(err),
      () => {
        this.saveData();
      },
    );

    if (this.partialAlign) {
      this.currentPageAlign = this.startPage;
    } else {
      this.startPage = 1;
      this.currentPageAlign = 1;
    }

    while (
      this.currentPageAlign < this.startPage + Math.floor(this.nbreCore * 1.5) /* (navigator.hardwareConcurrency - 1) /* * 2 */ &&
      this.currentPageAlign < this.numberPagesInScan + 1
    ) {
      this.observerPage!.next(this.currentPageAlign);
      this.currentPageAlign = this.currentPageAlign + 1;
    }
  }

  public async alignPage(page: number): Promise<number> {
    if (this.alignement === 'off') {
      const dataURL = await this.db.getFirstNonAlignImage(+this.examId, page);
      if (dataURL !== undefined) {
        await this.db.addAligneImage({
          examId: +this.examId,
          pageNumber: page,
          value: dataURL!.value,
        });
        if (this.currentPageAlign < this.numberPagesInScan + 1) {
          this.observerPage?.next(this.currentPageAlign);
          this.currentPageAlign = this.currentPageAlign + 1;
        }
        if (this.currentPageAlignOver < this.numberPagesInScan) {
          this.avancement = this.currentPageAlignOver;
          this.currentPageAlignOver = this.currentPageAlignOver + 1;
        } else {
          this.avancement = this.currentPageAlignOver;
          this.currentPageAlignOver = this.currentPageAlignOver + 1;
          this.observerPage?.complete();
          this.observer?.complete();
        }
        return page;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('scanexam.npagealign'),
          detail: this.translateService.instant('scanexam.npagealigndetails') + page,
        });
        return page;
      }
    } else {
      const p = this.aligneImages(page);
      return p! + 1;
    }
  }

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  loadImage(file: any, page: number, cb: (image: ImageData, page: number, w: number, h: number) => void): void {
    const i = new Image();
    i.onload = () => {
      const editedImage = <HTMLCanvasElement>document.createElement('canvas');
      editedImage.width = i.width;
      editedImage.height = i.height;
      const ctx = editedImage.getContext('2d');
      ctx!.drawImage(i, 0, 0);
      const inputimage = ctx!.getImageData(0, 0, i.width, i.height);
      cb(inputimage, page, i.width, i.height);
    };
    i.src = file;
  }

  aligneImages(pagen: number): number {
    let paget = pagen % this.nbreFeuilleParCopie;
    if (paget === 0) {
      paget = this.nbreFeuilleParCopie;
    }

    if (this.alignement !== 'off') {
      const pref = this.preferenceService.getPreference();
      this.observer!.next({
        imageA: this.templatePages.get(paget)!.image!.slice(0),
        widthA: this.templatePages.get(paget)!.width,
        heightA: this.templatePages.get(paget)!.height,
        marker: this.alignement === 'marker',
        pageNumber: pagen,
        preference: pref,
        debug: this.showMapping,
        examId: +this.examId,
        indexDb: this.preferenceService.getPreference().cacheDb === 'indexdb',
      });
    }
    return pagen;
  }

  private imageDataToDataURL(img: ImageData): string {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.putImageData(img, 0, 0);
    let exportImageType = 'image/webp';
    if (
      this.preferenceService.getPreference().imageTypeExport !== undefined &&
      ['image/webp', 'image/png', 'image/jpg'].includes(this.preferenceService.getPreference().imageTypeExport)
    ) {
      exportImageType = this.preferenceService.getPreference().imageTypeExport;
    }
    return canvas.toDataURL(exportImageType);
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

  show(): void {
    const ref = this.dialogService.open(PartialAlignModalComponent, {
      header: '',
      width: '70%',
      data: {
        startPage: this.startPage,
        endPage: this.endPage,
      },
    });

    ref.onClose.subscribe((res: any) => {
      if (res) {
        this.startPage = res.startPage;
        this.endPage = res.endPage;
        this.partialAlign = true;
        this.process(res.showmapping);
      }
    });
  }

  showVignette(): void {
    this._showVignette = !this._showVignette;
  }

  async downloadTemplate(): Promise<void> {
    const e1 = (await firstValueFrom(this.templateService.getPdf(this.exam!.templateId!))) as Blob;

    // this.downLoadFile(s, "application/json")
    const filename: string = this.exam ? 'template-' + this.exam.id + '.pdf' : 'template.pdf';
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(e1);
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    this.blocked = false;
    this.message = '';
    downloadLink.click();
  }

  async downloadScan(): Promise<void> {
    const e1 = (await firstValueFrom(this.scanService.getPdf(this.exam!.scanfileId!))) as Blob;

    // this.downLoadFile(s, "application/json")
    const filename: string = this.exam ? 'scan-' + this.exam.id + '.pdf' : 'scan.pdf';
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(e1);
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    this.blocked = false;
    this.message = '';
    downloadLink.click();
  }
}
