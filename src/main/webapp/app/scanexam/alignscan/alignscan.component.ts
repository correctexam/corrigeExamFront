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
import { ConfirmationService, MessageService } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { ICourse } from 'app/entities/course/course.model';
import { IScan } from '../../entities/scan/scan.model';
import { ScrollModeType, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { AlignImagesService } from '../services/align-images.service';
import { TemplateService } from '../../entities/template/service/template.service';
import { ITemplate } from 'app/entities/template/template.model';
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons';

import { db } from '../db/db';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface IPage {
  image?: ImageData;
  page?: number;
  width?: number;
  height?: number;
}

@Component({
  selector: 'jhi-align-scan',
  templateUrl: './alignscan.component.html',
  styleUrls: ['./alignscan.component.scss'],
  providers: [ConfirmationService, MessageService],
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
  private editedImage: HTMLCanvasElement | undefined;
  /* @ViewChild('keypoints1')
  keypoints1: ElementRef | undefined;
  @ViewChild('keypoints2')
  keypoints2: ElementRef | undefined;
  @ViewChild('imageCompareMatches')
  imageCompareMatches: ElementRef | undefined;
  @ViewChild('imageAligned')
  imageAligned: ElementRef | undefined; */
  templatePages: Map<number, IPage> = new Map();
  // alignPages: Map<number, IPage> = new Map();
  // nonalignPages: Map<number, IPage> = new Map();
  // debug = false;
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
  constructor(
    public examService: ExamService,
    public scanService: ScanService,
    public courseService: CourseService,
    public templateService: TemplateService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private pdfService: NgxExtendedPdfViewerService,
    private alignImagesService: AlignImagesService
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

  async removeElement(examId: number): Promise<any> {
    await db.removeElementForExam(examId);
    await db.removeExam(examId);
  }

  public pdfloaded(): void {
    if (!this.phase1) {
      this.nbreFeuilleParCopie = this.pdfService.numberOfPages();
    }
    this.loaded = true;
    if (this.phase1) {
      if (this.pdfService.numberOfPages() !== 0) {
        this.numberPagesInScan = this.pdfService.numberOfPages();
        this.exportAsImage();
      }
    }
  }

  process(): void {
    this.blocked = true;
    this.removeElement(+this.examId);
    if (!this.phase1) {
      const scale = { scale: 2 };
      for (let i = 1; i <= this.nbreFeuilleParCopie; i++) {
        this.pdfService.getPageAsImage(i, scale).then(dataURL => {
          this.loadImage(dataURL, i, (_image: ImageData, _page: number, _width: number, _height: number) => {
            this.templatePages.set(_page, {
              image: _image,
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
      // Phase 2;
    }
  }

  private async saveData(): Promise<any> {
    const templatePages64: Map<number, string> = new Map();
    // const alignPages64: Map<number, string> = new Map();
    //    const nonalignPages64: Map<number, string> = new Map();
    this.templatePages.forEach((e, k) => {
      templatePages64.set(k, this.fgetBase64Image(e.image!));
    });
    /* this.alignPages.forEach((e, k) => {
      alignPages64.set(k, this.fgetBase64Image(e.image!));
    });*/
    /* this.nonalignPages.forEach((e, k) => {
      nonalignPages64.set(k, this.fgetBase64Image(e.image!));
    }); */
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

    /* for (let e of alignPages64.keys()) {
      await db.alignImages.add({
        examId: +this.examId,
        pageNumber: e,
        value: JSON.stringify(
          {
            pages: alignPages64.get(e)!,
          },
          this.replacer
        ),
      });
    } */
    /* for (let e of nonalignPages64.keys()) {
      await db.nonAlignImages.add({
        examId: +this.examId,
        pageNumber: e,
        value: JSON.stringify(
          {
            pages: nonalignPages64.get(e)!,
          },
          this.replacer
        ),
      });
    } */
    this.router.navigateByUrl('/exam/' + this.examId);
    this.blocked = false;
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

  public async exportAsImage(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    let page = 1;
    while (page < this.pdfService.numberOfPages() + 1) {
      page = await this.alignPage(page);
    }
    this.saveData();
  }

  public async alignPage(page: number): Promise<number> {
    const scale = { scale: 2 };
    const dataURL = await this.pdfService.getPageAsImage(page, scale);
    console.log('page ' + page);
    const p = await this.aligneImages(dataURL, page);
    return p.page! + 1;
  }

  loadImage(file: any, page: number, cb: (image: ImageData, page: number, w: number, h: number) => void): void {
    const i = new Image();
    i.onload = () => {
      this.editedImage = <HTMLCanvasElement>document.createElement('canvas');
      this.editedImage.width = i.width;
      this.editedImage.height = i.height;
      const ctx = this.editedImage.getContext('2d');
      ctx!.drawImage(i, 0, 0);
      const inputimage = ctx!.getImageData(0, 0, i.width, i.height);
      cb(inputimage, page, i.width, i.height);
    };
    i.src = file;
  }

  async aligneImages(file: any, pagen: number): Promise<IPage> {
    /* if (this.alignPages.has(pagen)) {
      cb(this.alignPages.get(pagen)!);
    } else { */
    return new Promise(resolve => {
      const i = new Image();
      i.onload = async () => {
        this.editedImage = <HTMLCanvasElement>document.createElement('canvas');
        this.editedImage.width = i.width;
        this.editedImage.height = i.height;
        const ctx = this.editedImage.getContext('2d');
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
          // console.log('save saveNonAligneImage ' + pagen)

          this.alignImagesService
            .imageAlignement({
              imageA: this.templatePages.get(paget)?.image,
              imageB: inputimage1,
              marker: this.alignement === 'marker',
            })
            .subscribe(e => {
              /* if (this.debug) {
                const ctx1 = this.imageCompareMatches?.nativeElement.getContext('2d');
                this.imageCompareMatches!.nativeElement.width = e.imageCompareMatchesWidth;
                this.imageCompareMatches!.nativeElement.height = e.imageCompareMatchesHeight;
                ctx1.putImageData(e.imageCompareMatches, 0, 0);
                const ctx2 = this.keypoints1?.nativeElement.getContext('2d');
                this.keypoints1!.nativeElement.width = e.keypoints1Width;
                this.keypoints1!.nativeElement.height = e.keypoints1Height;
                ctx2.putImageData(e.keypoints1, 0, 0);
                const ctx3 = this.keypoints2?.nativeElement.getContext('2d');
                this.keypoints2!.nativeElement.width = e.keypoints2Width;
                this.keypoints2!.nativeElement.height = e.keypoints2Height;
                ctx3.putImageData(e.keypoints2, 0, 0);
                const ctx4 = this.imageAligned?.nativeElement.getContext('2d');
                this.imageAligned!.nativeElement.width = e.imageAlignedWidth;
                this.imageAligned!.nativeElement.height = e.imageAlignedHeight;
                ctx4.putImageData(e.imageAligned, 0, 0);
              } */
              const apage = {
                image: e.imageAligned,
                page: pagen,
                width: i.width!,
                height: i.height,
              };
              this.saveEligneImage(pagen, this.fgetBase64Image(apage.image!)).then(() => {
                resolve(apage);
              });

              //              this.alignPages.set(pagen, apage);
              // cb(apage);
            });
        } else {
          const apage = {
            image: inputimage1,
            page: pagen,
            width: i.width,
            height: i.height,
          };
          this.saveEligneImage(pagen, this.fgetBase64Image(apage.image!)).then(() => {
            console.log('save saveAligneImage ' + pagen);

            resolve(apage);
          });

          //          this.alignPages.set(pagen, apage);
        }
      };
      i.src = file;
    });
  }

  public alignementChange(): any {
    db.alignImages.clear().then(() => {
      this.exportAsImage();
    });
    // this.alignPages.clear();
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
