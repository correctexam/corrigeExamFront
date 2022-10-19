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
import { ScanService } from '../../entities/scan/service/scan.service';
import { CourseService } from 'app/entities/course/service/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { ICourse } from 'app/entities/course/course.model';
import { IScan } from '../../entities/scan/scan.model';
import { ScrollModeType, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { IImageAlignement, IImageAlignementInput } from '../services/align-images.service';
import { TemplateService } from '../../entities/template/service/template.service';
import { ITemplate } from 'app/entities/template/template.model';
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons';

import { db } from '../db/db';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ExportOptions } from 'dexie-export-import';
import { CacheUploadService } from '../exam-detail/cacheUpload.service';
import { TranslateService } from '@ngx-translate/core';
import { fromWorkerPool } from 'observable-webworker';
import { Observable, Subscriber } from 'rxjs';
import { worker1 } from '../services/workerimport';

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
  providers: [MessageService],
})
export class AlignScanComponent implements OnInit {
  faObjectGroup = faObjectGroup as IconProp;
  examId = '';
  exam!: IExam;
  course!: ICourse;
  scan!: IScan;
  template!: ITemplate;
  pdfcontent!: string;
  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  cvState!: string;
  currentStudent = 0;
  nbreFeuilleParCopie = 2;
  numberPagesInScan = 0;
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
  blocked = false;
  observable: Observable<IImageAlignementInput> | undefined;
  observer: Subscriber<IImageAlignementInput> | undefined;
  observablePage: Observable<number> | undefined;
  observerPage: Subscriber<number> | undefined;

  currentPageAlign = 1;
  currentPageAlignOver = 1;
  message = '';
  submessage = '';
  progress = 0;
  constructor(
    public examService: ExamService,
    public scanService: ScanService,
    public courseService: CourseService,
    public templateService: TemplateService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    private pdfService: NgxExtendedPdfViewerService,
    private cacheUploadService: CacheUploadService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        this.examService.find(+this.examId).subscribe(data => {
          this.exam = data.body!;
          this.courseService.find(this.exam.courseId!).subscribe(e => (this.course = e.body!));
          if (this.exam.templateId) {
            this.templateService.find(this.exam.templateId).subscribe(e => {
              this.template = e.body!;
              this.pdfcontent = this.template.content!;
            });
          }
        });
      }
    });
  }

  initPool(): void {
    this.observable = new Observable(observer => {
      this.observer = observer;
    });
    fromWorkerPool<IImageAlignementInput, IImageAlignement>(worker1, this.observable, {
      selectTransferables: input => [input.imageA, input.imageB],
    }).subscribe(
      e => {
        const apage = {
          image: e.imageAligned,
          page: e.pageNumber,
          width: e.imageAlignedWidth!,
          height: e.imageAlignedHeight,
        };
        const im = new ImageData(new Uint8ClampedArray(apage.image!), apage.width, apage.height);

        this.saveEligneImage(apage.page!, this.fgetBase64Image(im)).then(() => {
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
      }
    );
  }

  async removeElement(examId: number): Promise<any> {
    await db.removeElementForExam(examId);
  }

  public pdfloaded(): void {
    if (!this.phase1) {
      this.nbreFeuilleParCopie = this.pdfService.numberOfPages();
    }
    this.loaded = true;
    if (this.phase1) {
      if (this.pdfService.numberOfPages() !== 0) {
        this.numberPagesInScan = this.pdfService.numberOfPages();
        this.avancementunit = ' / ' + this.numberPagesInScan;
        this.exportAsImage();
      }
    }
  }

  process(): void {
    this.initPool();

    this.translateService.get('scanexam.alignementencours').subscribe(res => (this.message = '' + res));

    this.blocked = true;
    this.removeElement(+this.examId);
    this.currentPageAlignOver = 1;
    this.avancement = 0;

    if (!this.phase1) {
      const scale = { scale: 2 };
      for (let i = 1; i <= this.nbreFeuilleParCopie; i++) {
        this.pdfService.getPageAsImage(i, scale).then(dataURL => {
          this.loadImage(dataURL, i, (_image: ImageData, _page: number, _width: number, _height: number) => {
            this.templatePages.set(_page, {
              image: _image.data.buffer,
              page: _page,
              width: _width,
              height: _height,
            });
            if (_page === this.nbreFeuilleParCopie) {
              this.phase1 = true;
              if (this.exam.scanfileId) {
                this.scanService.find(this.exam.scanfileId).subscribe(e => {
                  this.scan = e.body!;
                  this.pdfcontent = this.scan.content!;
                });
              }
            }
          });
        });
      }
    }
  }

  private async saveData(): Promise<any> {
    this.translateService.get('scanexam.savetemplateencours').subscribe(res => (this.message = '' + res));

    const templatePages64: Map<number, string> = new Map();
    this.templatePages.forEach((e, k) => {
      const pixels = new ImageData(new Uint8ClampedArray(e.image!), e.width!, e.height!);
      templatePages64.set(k, this.fgetBase64Image(pixels));
    });
    await db.exams.add({
      id: +this.examId,
    });

    for (let e of templatePages64.keys()) {
      await db.templates.add({
        examId: +this.examId,
        pageNumber: e,
        value: JSON.stringify(
          {
            pages: templatePages64.get(e)!,
          },
          this.replacer
        ),
      });
    }

    const o: ExportOptions = {};
    o.filter = (table: string, value: any) =>
      (table === 'exams' && value.id === +this.examId) ||
      (table === 'templates' && value.examId === +this.examId) ||
      (table === 'nonAlignImages' && value.examId === +this.examId) ||
      (table === 'alignImages' && value.examId === +this.examId);

    this.translateService.get('scanexam.exportcacheencours').subscribe(res => (this.message = '' + res));

    db.export(o)
      .then((value: Blob) => {
        const file = new File([value], this.examId + 'indexdb.json');
        this.progress = 0;
        this.translateService.get('scanexam.uploadcacheencours').subscribe(res => (this.message = '' + res));
        this.translateService.get('scanexam.uploadcacheencoursdetail').subscribe(res => (this.submessage = '' + res));

        this.cacheUploadService.uploadCache(file).subscribe(
          data => {
            this.progress = data.progress;
            if (data.state === 'DONE') {
              setTimeout(() => {
                this.blocked = false;
                this.router.navigateByUrl('/exam/' + this.examId);
              }, 1500);
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('scanexam.downloadcacheok'),
                detail: this.translateService.instant('scanexam.downloadcacheokdetail'),
              });
            }
          },
          err => {
            if (err) {
              setTimeout(() => {
                this.blocked = false;
                this.router.navigateByUrl('/exam/' + this.examId);
              }, 2000);
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('scanexam.downloadcacheko'),
                detail: this.translateService.instant('scanexam.downloadcachekodetail'),
              });
            }
          }
        );
      })
      .catch(() => {
        console.log('could not export');
        setTimeout(() => {
          this.blocked = false;
          this.router.navigateByUrl('/exam/' + this.examId);
        }, 2000);
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('scanexam.downloadcacheko'),
          detail: this.translateService.instant('scanexam.downloadcachekodetail'),
        });
      });
  }

  async saveEligneImage(pageN: number, imageString: string): Promise<void> {
    await db.addAligneImage({
      examId: +this.examId,
      pageNumber: pageN,
      value: JSON.stringify(
        {
          pages: imageString!,
        },
        this.replacer
      ),
    });
  }

  async saveNonAligneImage(pageN: number, imageString: string): Promise<void> {
    await db.addNonAligneImage({
      examId: +this.examId,
      pageNumber: pageN,
      value: JSON.stringify(
        {
          pages: imageString!,
        },
        this.replacer
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
      }
    );

    this.currentPageAlign = 1;
    while (
      this.currentPageAlign < 1 + (navigator.hardwareConcurrency - 1) * 2 &&
      this.currentPageAlign < this.pdfService.numberOfPages() + 1
    ) {
      this.observerPage!.next(this.currentPageAlign);
      this.currentPageAlign = this.currentPageAlign + 1;
    }
  }

  public async alignPage(page: number): Promise<number> {
    const scale = { scale: 2 };
    const dataURL = await this.pdfService.getPageAsImage(page, scale);
    const p = await this.aligneImages(dataURL, page);
    return p.page! + 1;
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

  async aligneImages(file: any, pagen: number): Promise<IPage> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = async () => {
        const editedImage = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const inputimage1 = ctx!.getImageData(0, 0, i.width, i.height);
        const napage = {
          image: inputimage1,
          page: pagen,
          width: i.width!,
          height: i.height,
        };
        if (this.alignement !== 'off') {
          let paget = pagen % this.nbreFeuilleParCopie;
          if (paget === 0) {
            paget = this.nbreFeuilleParCopie;
          }
          await this.saveNonAligneImage(pagen, this.fgetBase64Image(napage.image!));
          this.observer!.next({
            imageA: this.templatePages.get(paget)!.image!.slice(0),
            imageB: inputimage1.data.buffer!,
            widthA: this.templatePages.get(paget)!.width,
            heightA: this.templatePages.get(paget)!.height,
            widthB: i.width!,
            heightB: i.height!,
            marker: this.alignement === 'marker',
            pageNumber: pagen,
          });
          const apage = {
            page: pagen,
            width: i.width!,
            height: i.height,
            pageNumber: pagen,
          };
          resolve(apage);
        } else {
          const apage = {
            image: inputimage1.data.buffer,
            page: pagen,
            width: i.width,
            height: i.height,
          };
          const pixels = new ImageData(new Uint8ClampedArray(apage.image), apage.width, apage.height);
          this.saveEligneImage(pagen, this.fgetBase64Image(pixels)).then(() => {
            this.saveNonAligneImage(pagen, this.fgetBase64Image(pixels)).then(() => {
              this.avancement = pagen;
              resolve(apage);
            });
          });
        }
      };
      i.src = file;
    });
  }

  private fgetBase64Image(img: ImageData): string {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx?.putImageData(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
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
}
