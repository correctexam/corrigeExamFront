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
import { Observable, Subscriber } from 'rxjs';
import { worker1 } from '../services/workerimport';
import { PreferenceService } from '../preference-page/preference.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PartialAlignModalComponent } from './partial-align-modal/partial-align-modal.component';
// import { db as dbsqlite } from '../db/dbsqlite';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { QuestionService } from '../../entities/question/service/question.service';
import { ZoneService } from '../../entities/zone/service/zone.service';

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
  alignementOptions = [
    { label: 'Off', value: 'off' },
    { label: 'with Marker', value: 'marker' },
    { label: 'without Marker', value: 'nomarker' },
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
    this.allowPartialAlign = p > 0; // && p1 > 0 && p === p1;
  }

  initPool(): void {
    this.observable = new Observable(observer => {
      this.observer = observer;
    });
    fromWorkerPool<IImageAlignementInput, IImageAlignement>(worker1, this.observable, {
      selectTransferables: input => [input.imageA, input.imageB],
    }).subscribe(
      (e: IImageAlignement) => {
        const apage = {
          image: e.imageAligned,
          page: e.pageNumber,
          width: e.imageAlignedWidth!,
          height: e.imageAlignedHeight,
        };

        const im = new ImageData(new Uint8ClampedArray(apage.image!), apage.width, apage.height);
        if (e.imagesDebugTracesWidth !== undefined) {
          const debugpage = {
            image: e.imagesDebugTraces,
            page: e.pageNumber,
            width: e.imagesDebugTracesWidth!,
            height: e.imagesDebugTracesHeight,
          };
          const dim = new ImageData(new Uint8ClampedArray(debugpage.image!), debugpage.width, debugpage.height);
          this.images.push({
            src: this.fgetBase64Image(dim, e.pageNumber!),
            alt: 'Description for Image 2',
            title: 'Exam',
          });
        }

        this.saveEligneImage(apage.page!, im).then(() => {
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

  public async pdfloaded(): Promise<void> {
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
    this.initPool();
    this.pdfloaded();
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
    await this.loadTemplatePage();
    this.exportAsImage();
  }
  async loadTemplatePage(): Promise<void> {
    return new Promise(resolve => {
      for (let i = 1; i <= this.nbreFeuilleParCopie; i++) {
        this.db.getFirstTemplate(+this.examId!, i).then(dataURL => {
          const image = JSON.parse(dataURL!.value, this.reviver);

          this.loadImage(image.pages, i, (_image: ImageData, _page: number, _width: number, _height: number) => {
            this.templatePages.set(_page, {
              image: _image.data.buffer,
              page: _page,
              width: _width,
              height: _height,
            });
            if (_page === this.nbreFeuilleParCopie) {
              resolve();
            }
          });
        });
      }
    });
  }

  private async saveData(): Promise<any> {
    this.translateService.get('scanexam.savetemplateencours').subscribe(res => (this.message = '' + res));

    // Change if partial update
    if (!this.partialAlign) {
      const templatePages64: Map<number, string> = new Map();
      this.templatePages.forEach((e, k) => {
        const pixels = new ImageData(new Uint8ClampedArray(e.image!), e.width!, e.height!);
        templatePages64.set(k, this.fgetBase64Image(pixels, k));
      });

      await this.db.addExam(+this.examId);
    }

    this.translateService.get('scanexam.exportcacheencours').subscribe(res => (this.message = '' + res));
    this.db.countNonAlignImage(+this.examId).then(value => {
      this.cacheUploadService.exportCache(+this.examId, this.translateService, this.messageService, value, this).then(() => {
        this.blocked = false;
        /* if (!this.partialAlign) {
          setTimeout(() => {
            this._showVignette =true;

          }, 1000);
        } else { */
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
        // }
      });
    });
  }

  async saveEligneImage(pageN: number, imageD: ImageData): Promise<void> {
    const imageString = this.fgetBase64Image(imageD, pageN);

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

  async saveEligneImageBase64(pageN: number, imageD: any): Promise<void> {
    await this.db.addAligneImage({
      examId: +this.examId,
      pageNumber: pageN,
      value: JSON.stringify(
        {
          pages: imageD!,
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
      this.currentPageAlign < this.startPage + (navigator.hardwareConcurrency - 1) * 2 &&
      this.currentPageAlign < this.numberPagesInScan + 1
    ) {
      this.observerPage!.next(this.currentPageAlign);
      this.currentPageAlign = this.currentPageAlign + 1;
    }
  }

  public async alignPage(page: number): Promise<number> {
    const dataURL = await this.db.getFirstNonAlignImage(+this.examId, page);
    if (dataURL !== undefined) {
      if (this.alignement === 'off') {
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
        const image = JSON.parse(dataURL!.value, this.reviver);

        const p = await this.aligneImages(image.pages, page);
        return p! + 1;
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('scanexam.npagealign'),
        detail: this.translateService.instant('scanexam.npagealigndetails') + page,
      });
      return page;
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

  async aligneImages(file: any, pagen: number): Promise<number> {
    // await this.saveNonAligneImage(pagen, file);
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        const editedImage = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const inputimage1 = ctx!.getImageData(0, 0, i.width, i.height);

        let paget = pagen % this.nbreFeuilleParCopie;
        if (paget === 0) {
          paget = this.nbreFeuilleParCopie;
        }

        if (this.alignement !== 'off') {
          const pref = this.preferenceService.getPreference();

          this.observer!.next({
            imageA: this.templatePages.get(paget)!.image!.slice(0),
            imageB: inputimage1.data.buffer!,
            widthA: this.templatePages.get(paget)!.width,
            heightA: this.templatePages.get(paget)!.height,
            widthB: i.width!,
            heightB: i.height!,
            marker: this.alignement === 'marker',
            pageNumber: pagen,
            preference: pref,
            debug: this.showMapping,
          });

          resolve(pagen);
        }
      };
      i.src = file;
    });
  }

  private fgetBase64Image(img: ImageData, pageN: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx?.putImageData(img, 0, 0);
    let compression = 1;
    let exportImageType = 'image/webp';
    let paget = pageN % this.nbreFeuilleParCopie;
    if (paget === 0) {
      paget = this.nbreFeuilleParCopie;
    }

    /*    if (
      this.preferenceService.getPreference().exportImageCompression !== undefined &&
      this.preferenceService.getPreference().exportImageCompression > 0 &&
      this.preferenceService.getPreference().exportImageCompression <= 1
    ) {
      compression = this.preferenceService.getPreference().exportImageCompression;
    }
    let paget = pageN % this.nbreFeuilleParCopie;
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
    }*/
    const dataURL = canvas.toDataURL(exportImageType, compression);
    return dataURL;
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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
}
