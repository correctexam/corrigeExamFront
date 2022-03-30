/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ZoneService } from '../../entities/zone/service/zone.service';
import { CourseService } from 'app/entities/course/service/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { ICourse } from 'app/entities/course/course.model';
import { IScan } from '../../entities/scan/scan.model';
import { IZone } from 'app/entities/zone/zone.model';
import { ScrollModeType, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { AlignImagesService } from '../services/align-images.service';
import { ITemplate } from 'app/entities/template/template.model';
import { db } from '../db/db';

export interface IPage {
  image?: ImageData;
  page?: number;
  width?: number;
  height?: number;
}

@Component({
  selector: 'jhi-associer-copies-etudiants',
  templateUrl: './associer-copies-etudiants.component.html',
  styleUrls: ['./associer-copies-etudiants.component.scss'],
  providers: [ConfirmationService],
})
export class AssocierCopiesEtudiantsComponent implements OnInit {
  examId = '';
  exam!: IExam;
  course!: ICourse;
  scan!: IScan;
  template!: ITemplate;
  pdfcontent!: string;
  zonenom!: IZone;
  zoneprenom!: IZone;
  zoneine!: IZone;
  nomDataURL: any;
  prenomDataURL: any;
  ineDataURL: any;
  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  widthnom = 0;
  heightnom = 0;
  widthprenom = 0;
  heightprenom = 0;
  widthine = 0;
  heightine = 0;
  cvState!: string;
  currentStudent = 0;
  nbreFeuilleParCopie = 0;
  numberPagesInScan = 0;
  private editedImage: HTMLCanvasElement | undefined;
  showNomImage = false;
  @ViewChild('nomImage')
  nomImage: ElementRef | undefined;
  showPrenomImage = false;
  @ViewChild('prenomImage')
  prenomImage: ElementRef | undefined;
  showINEImage = false;
  @ViewChild('ineImage')
  ineImage: ElementRef | undefined;
  @ViewChild('keypoints1')
  keypoints1: ElementRef | undefined;
  @ViewChild('keypoints2')
  keypoints2: ElementRef | undefined;
  @ViewChild('imageCompareMatches')
  imageCompareMatches: ElementRef | undefined;
  @ViewChild('imageAligned')
  imageAligned: ElementRef | undefined;
  templatePages: Map<number, IPage> = new Map();
  alignPages: Map<number, IPage> = new Map();
  nomPages: Map<number, IPage> = new Map();
  prenomPages: Map<number, IPage> = new Map();
  inePages: Map<number, IPage> = new Map();
  debug = false;
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

  constructor(
    private pdfService: NgxExtendedPdfViewerService,
    public examService: ExamService,
    public zoneService: ZoneService,
    public courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private alignImagesService: AlignImagesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        db.templates
          .where('examId')
          .equals(+this.examId)
          .count()
          .then(e => {
            this.nbreFeuilleParCopie = e;
          });
        db.alignImages
          .where('examId')
          .equals(+this.examId)
          .count()
          .then(e => {
            this.numberPagesInScan = e;
          });

        this.examService.find(+this.examId).subscribe(data => {
          this.exam = data.body!;
          this.courseService.find(this.exam.courseId!).subscribe(e => (this.course = e.body!));
          if (this.exam.namezoneId) {
            this.zoneService.find(this.exam.namezoneId).subscribe(e => {
              this.zonenom = e.body!;
              this.displayImageNom(this.currentStudent! * this.nbreFeuilleParCopie! + this.zonenom.page!);
            });
          }
          if (this.exam.firstnamezoneId) {
            this.zoneService.find(this.exam.firstnamezoneId).subscribe(e => {
              this.zoneprenom = e.body!;
              this.displayImagePrenom(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneprenom.page!);
            });
          }
          if (this.exam.idzoneId) {
            this.zoneService.find(this.exam.idzoneId).subscribe(e => {
              this.zoneine = e.body!;
              this.displayImageINE(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneine.page!);
            });
          }
        });
      }
    });
  }

  displayImageNom(pageInscan: number): any {
    db.alignImages
      .where('examId')
      .equals(+this.examId)
      .and(e1 => e1!.id === pageInscan)
      .first()
      .then(e2 => {
        const image = JSON.parse(e2!.value, this.reviver);
        this.loadImage(image.pages, pageInscan, (image1: ImageData, page: number, w: number, h: number) => {
          this.alignImagesService
            .imageCrop({
              image: image1,
              x: (this.zonenom.xInit! * w!) / 100000,
              y: (this.zonenom.yInit! * h!) / 100000,
              width: (this.zonenom.width! * w!) / 100000,
              height: (this.zonenom.height! * h!) / 100000,
            })
            .subscribe(res => {
              const ctx1 = this.nomImage?.nativeElement.getContext('2d');
              ctx1.putImageData(res, 0, 0);
              this.showNomImage = true;
            });
        });
      });
  }
  displayImagePrenom(pageInscan: number): any {
    db.alignImages
      .where('examId')
      .equals(+this.examId)
      .and(e1 => e1!.id === pageInscan)
      .first()
      .then(e2 => {
        const image = JSON.parse(e2!.value, this.reviver);
        this.loadImage(image.pages, pageInscan, (image1: ImageData, page: number, w: number, h: number) => {
          this.alignImagesService
            .imageCrop({
              image: image1,
              x: (this.zoneprenom.xInit! * w!) / 100000,
              y: (this.zoneprenom.yInit! * h!) / 100000,
              width: (this.zoneprenom.width! * w!) / 100000,
              height: (this.zoneprenom.height! * h!) / 100000,
            })
            .subscribe(res => {
              const ctx1 = this.prenomImage?.nativeElement.getContext('2d');
              ctx1.putImageData(res, 0, 0);
              this.showPrenomImage = true;
            });
        });
      });
  }

  displayImageINE(pageInscan: number): any {
    db.alignImages
      .where('examId')
      .equals(+this.examId)
      .and(e1 => e1!.id === pageInscan)
      .first()
      .then(e2 => {
        const image = JSON.parse(e2!.value, this.reviver);
        this.loadImage(image.pages, pageInscan, (image1: ImageData, page: number, w: number, h: number) => {
          this.alignImagesService
            .imageCrop({
              image: image1,
              x: (this.zoneine.xInit! * w!) / 100000,
              y: (this.zoneine.yInit! * h!) / 100000,
              width: (this.zoneine.width! * w!) / 100000,
              height: (this.zoneine.height! * h!) / 100000,
            })
            .subscribe(res => {
              const ctx1 = this.ineImage?.nativeElement.getContext('2d');
              ctx1.putImageData(res, 0, 0);
              this.showINEImage = true;
            });
        });
      });
  }

  nextStudent(): void {
    this.currentStudent = this.currentStudent + 1;
    this.displayImageNom(this.currentStudent! * this.nbreFeuilleParCopie! + this.zonenom.page!);
    this.displayImagePrenom(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneprenom.page!);
    this.displayImageINE(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneine.page!);
  }

  previousStudent(): void {
    this.currentStudent = this.currentStudent - 1;
    this.displayImageNom(this.currentStudent! * this.nbreFeuilleParCopie! + this.zonenom.page!);
    this.displayImagePrenom(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneprenom.page!);
    this.displayImageINE(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneine.page!);
  }

  goToStudent(i: number): void {
    if (i < this.numberPagesInScan) {
      this.currentStudent = i;
      this.displayImageNom(this.currentStudent! * this.nbreFeuilleParCopie! + this.zonenom.page!);
      this.displayImagePrenom(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneprenom.page!);
      this.displayImageINE(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneine.page!);
    }
  }

  public exportAsImage(): void {
    const scale = { scale: 2 };
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    if (this.zonenom !== undefined) {
      this.pdfService.getPageAsImage(this.zonenom.page! + this.currentStudent * this.nbreFeuilleParCopie, scale).then(dataURL => {
        this.aligneImages(dataURL, this.zonenom.page! + this.currentStudent * this.nbreFeuilleParCopie, (p: IPage) => {
          this.nomImage!.nativeElement.width = (this.zonenom.width! * p.width!) / 100000;
          this.nomImage!.nativeElement.height = (this.zonenom.height! * p.height!) / 100000;
          if (this.nomPages.has(this.zonenom.page! + this.currentStudent * this.nbreFeuilleParCopie)) {
            const ctx2 = this.nomImage?.nativeElement.getContext('2d');
            ctx2.putImageData(this.nomPages.get(this.zonenom.page! + this.currentStudent * this.nbreFeuilleParCopie)?.image, 0, 0);
            this.showNomImage = true;
          } else {
            this.alignImagesService
              .imageCrop({
                image: p.image,
                x: (this.zonenom.xInit! * p.width!) / 100000,
                y: (this.zonenom.yInit! * p.height!) / 100000,
                width: (this.zonenom.width! * p.width!) / 100000,
                height: (this.zonenom.height! * p.height!) / 100000,
              })
              .subscribe(res => {
                const ctx1 = this.nomImage?.nativeElement.getContext('2d');
                ctx1.putImageData(res, 0, 0);
                this.showNomImage = true;
                this.nomPages.set(this.zonenom.page! + this.currentStudent * this.nbreFeuilleParCopie, { image: res });

                if (this.zoneprenom !== undefined) {
                  this.pdfService
                    .getPageAsImage(this.zoneprenom.page! + this.currentStudent * this.nbreFeuilleParCopie, scale)
                    .then(dataURL1 => {
                      this.aligneImages(dataURL1, this.zoneprenom.page! + this.currentStudent * this.nbreFeuilleParCopie, (p1: IPage) => {
                        this.prenomImage!.nativeElement.width = (this.zoneprenom.width! * p1.width!) / 100000;
                        this.prenomImage!.nativeElement.height = (this.zoneprenom.height! * p1.height!) / 100000;

                        if (!this.prenomPages.has(this.zoneprenom.page! + this.currentStudent * this.nbreFeuilleParCopie)) {
                          this.alignImagesService
                            .imageCrop({
                              image: p1.image,
                              x: (this.zoneprenom.xInit! * p1.width!) / 100000,
                              y: (this.zoneprenom.yInit! * p1.height!) / 100000,
                              width: (this.zoneprenom.width! * p1.width!) / 100000,
                              height: (this.zoneprenom.height! * p1.height!) / 100000,
                            })
                            .subscribe(res1 => {
                              const ctx2 = this.prenomImage?.nativeElement.getContext('2d');
                              ctx2.putImageData(res1, 0, 0);
                              this.showPrenomImage = true;
                              this.prenomPages.set(this.zoneprenom.page! + this.currentStudent * this.nbreFeuilleParCopie, { image: res1 });
                            });
                        }
                      });
                    });
                }
                if (this.zoneine !== undefined) {
                  this.pdfService
                    .getPageAsImage(this.zoneine.page! + this.currentStudent * this.nbreFeuilleParCopie, scale)
                    .then(dataURL1 => {
                      this.aligneImages(dataURL1, this.zoneine.page! + this.currentStudent * this.nbreFeuilleParCopie, (p1: IPage) => {
                        this.ineImage!.nativeElement.width = (this.zoneine.width! * p1.width!) / 100000;
                        this.ineImage!.nativeElement.height = (this.zoneine.height! * p1.height!) / 100000;
                        if (!this.inePages.has(this.zoneine.page! + this.currentStudent * this.nbreFeuilleParCopie)) {
                          this.alignImagesService
                            .imageCrop({
                              image: p1.image,
                              x: (this.zoneine.xInit! * p1.width!) / 100000,
                              y: (this.zoneine.yInit! * p1.height!) / 100000,
                              width: (this.zoneine.width! * p1.width!) / 100000,
                              height: (this.zoneine.height! * p1.height!) / 100000,
                            })
                            .subscribe(res1 => {
                              const ctx2 = this.ineImage?.nativeElement.getContext('2d');
                              ctx2.putImageData(res1, 0, 0);
                              this.showINEImage = true;
                              this.inePages.set(this.zoneine.page! + this.currentStudent * this.nbreFeuilleParCopie, { image: res1 });
                            });
                        }
                      });
                    });
                }
              });
          }
          if (
            this.zoneprenom !== undefined &&
            this.prenomPages.has(this.zoneprenom.page! + this.currentStudent * this.nbreFeuilleParCopie)
          ) {
            const ctx2 = this.prenomImage?.nativeElement.getContext('2d');
            ctx2.putImageData(this.prenomPages.get(this.zoneprenom.page! + this.currentStudent * this.nbreFeuilleParCopie)?.image, 0, 0);
            this.showPrenomImage = true;
          }
          if (this.zoneine !== undefined && this.inePages.has(this.zoneine.page! + this.currentStudent * this.nbreFeuilleParCopie)) {
            const ctx2 = this.ineImage?.nativeElement.getContext('2d');
            ctx2.putImageData(this.inePages.get(this.zoneine.page! + this.currentStudent * this.nbreFeuilleParCopie)?.image, 0, 0);
            this.showINEImage = true;
          }
        });
      });
    }
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

  aligneImages(file: any, pagen: number, cb: (page: IPage) => void): void {
    if (this.alignPages.has(pagen)) {
      cb(this.alignPages.get(pagen)!);
    } else {
      const i = new Image();
      i.onload = () => {
        this.editedImage = <HTMLCanvasElement>document.createElement('canvas');
        this.editedImage.width = i.width;
        this.editedImage.height = i.height;
        const ctx = this.editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const inputimage1 = ctx!.getImageData(0, 0, i.width, i.height);
        if (this.alignement !== 'off') {
          this.alignImagesService
            .imageAlignement({
              imageA: this.templatePages.get(pagen % this.nbreFeuilleParCopie)?.image,
              imageB: inputimage1,
              marker: this.alignement === 'marker',
              x: (this.zoneine.xInit! * i.width!) / 100000,
              y: (this.zoneine.yInit! * i.height) / 100000,
              width: (this.zoneine.width! * i.width) / 100000,
              height: (this.zoneine.height! * i.height) / 100000,
            })
            .subscribe(e => {
              if (this.debug) {
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
              }
              const apage = {
                image: e.imageAligned,
                page: pagen,
                width: i.width!,
                height: i.height,
              };
              this.alignPages.set(pagen, apage);
              cb(apage);
            });
        } else {
          const apage = {
            image: inputimage1,
            page: pagen,
            width: i.width,
            height: i.height,
          };
          this.alignPages.set(pagen, apage);
          cb(apage);
        }
      };
      i.src = file;
    }
  }

  public alignementChange(): any {
    this.alignPages.clear();
    this.nomPages.clear();
    this.prenomPages.clear();
    this.inePages.clear();
    this.exportAsImage();
  }

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }
}
