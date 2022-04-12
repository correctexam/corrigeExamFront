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
import { ConfirmationService, MessageService } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { ICourse } from 'app/entities/course/course.model';
import { IScan } from '../../entities/scan/scan.model';
import { IZone } from 'app/entities/zone/zone.model';
import { AlignImagesService } from '../services/align-images.service';
import { ITemplate } from 'app/entities/template/template.model';
import { db } from '../db/db';
import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from '../../entities/student/student.model';

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
  providers: [ConfirmationService, MessageService],
})
export class AssocierCopiesEtudiantsComponent implements OnInit {
  blocked = false;
  examId = '';
  exam!: IExam;
  course!: ICourse;
  scan!: IScan;
  template!: ITemplate;
  pdfcontent!: string;
  zonenom!: IZone;
  setZoneNom: (z: IZone) => void = (z: IZone) => (this.zonenom = z);
  zoneprenom!: IZone;
  setZonePrenom: (z: IZone) => void = (z: IZone) => (this.zoneprenom = z);
  zoneine!: IZone;
  setZoneINE: (z: IZone) => void = (z: IZone) => (this.zoneine = z);
  nomDataURL: any;
  prenomDataURL: any;
  ineDataURL: any;
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
  selectionStudents = [];
  private editedImage: HTMLCanvasElement | undefined;
  _showNomImage = false;
  public get showNomImage(): boolean {
    return this._showNomImage;
  }
  public set showNomImage(s: boolean) {
    this._showNomImage = s;
  }
  public setShowNomImage: (s: boolean) => void = s => (this._showNomImage = s);

  @ViewChild('nomImage')
  nomImage: ElementRef | undefined;
  _showPrenomImage = false;
  public get showPrenomImage(): boolean {
    return this._showPrenomImage;
  }
  public set showPrenomImage(s: boolean) {
    this._showPrenomImage = s;
  }
  public setShowPrenomImage: (s: boolean) => void = s => (this._showPrenomImage = s);

  @ViewChild('prenomImage')
  prenomImage: ElementRef | undefined;
  _showINEImage = false;
  public get showINEImage(): boolean {
    return this._showINEImage;
  }
  public set showINEImage(s: boolean) {
    this._showINEImage = s;
  }
  public setShowINEImage: (s: boolean) => void = s => (this._showINEImage = s);

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
  debug = false;
  phase1 = false;
  students: IStudent[] | undefined;

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
    public examService: ExamService,
    public zoneService: ZoneService,
    public courseService: CourseService,
    public studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private alignImagesService: AlignImagesService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        // Step 1 Query templates
        db.templates
          .where('examId')
          .equals(+this.examId)
          .count()
          .then(e2 => {
            this.nbreFeuilleParCopie = e2;
            // Step 2 Query Scan in local DB

            db.alignImages
              .where('examId')
              .equals(+this.examId)
              .count()
              .then(e1 => {
                this.numberPagesInScan = e1;
                // Step 3 Query zone
                this.examService.find(+this.examId).subscribe(data => {
                  this.exam = data.body!;
                  this.courseService.find(this.exam.courseId!).subscribe(e => (this.course = e.body!));
                  this.loadZone(
                    this.exam.namezoneId,
                    this.setZoneNom,
                    true,
                    this.setShowNomImage,
                    this.nomImage,
                    this.currentStudent,
                    () => {
                      this.loadZone(
                        this.exam.firstnamezoneId,
                        this.setZonePrenom,
                        true,
                        this.setShowPrenomImage,
                        this.prenomImage,
                        this.currentStudent,
                        () => {
                          this.loadZone(
                            this.exam.idzoneId,
                            this.setZoneINE,
                            true,
                            this.setShowINEImage,
                            this.ineImage,
                            this.currentStudent,
                            () => {
                              // Step 4 Query Students for Exam
                              this.studentService.query({ courseId: this.exam.courseId }).subscribe(studentsbody => {
                                this.students = studentsbody.body!;
                                // Step 5 Bind All copies
                                this.bindAllCopies();
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                });
              });
          });
      }
    });
  }

  loadZone(
    zoneId: number | undefined,
    z: (zone: IZone) => void,
    showImage: boolean,
    showImageRef: (s: boolean) => void,
    imageRef: ElementRef<any> | undefined,
    currentStudent: number,
    next: () => void
  ): void {
    if (zoneId) {
      this.zoneService.find(zoneId).subscribe(e => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        z(e.body!);
        if (showImage) {
          this.displayImage(currentStudent! * this.nbreFeuilleParCopie! + e.body!.pageNumber!, e.body!, imageRef, showImageRef);
        }
        if (next) {
          next();
        }
      });
    } else {
      next();
    }
  }

  bindAllCopies(): void {}

  getAllImage4Zone(pageInscan: number, zone: IZone, rescb: (i: ImageData, w: number, h: number) => void): void {
    db.alignImages
      .where('examId')
      .equals(+this.examId)
      .and(e1 => e1!.id === pageInscan)
      .first()
      .then(e2 => {
        const image = JSON.parse(e2!.value, this.reviver);
        this.loadImage(image.pages, pageInscan, (image1: ImageData, page: number, w: number, h: number) => {
          const finalW = (zone.width! * w!) / 100000;
          const finalH = (zone.height! * h!) / 100000;
          this.alignImagesService
            .imageCrop({
              image: image1,
              x: (zone.xInit! * w!) / 100000,
              y: (zone.yInit! * h!) / 100000,
              width: finalW,
              height: finalH,
            })
            .subscribe(res => rescb(res, finalW, finalH));
        });
      });
  }

  displayImage(pageInscan: number, zone: IZone, imageRef: ElementRef<any> | undefined, show: (s: boolean) => void): void {
    this.getAllImage4Zone(pageInscan, zone, (i, w, h) => {
      if (imageRef !== undefined) {
        imageRef!.nativeElement.width = w;
        imageRef!.nativeElement.height = h;
        const ctx1 = imageRef!.nativeElement.getContext('2d');

        ctx1.putImageData(i, 0, 0);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        show(true);
      }
    });
  }

  nextStudent(): void {
    this.currentStudent = this.currentStudent + 1;
    this.reShow();
  }

  previousStudent(): void {
    this.currentStudent = this.currentStudent - 1;
    this.reShow();
  }

  goToStudent(i: number): void {
    if (i < this.numberPagesInScan) {
      this.currentStudent = i;
      this.reShow();
    }
  }

  reShow(): void {
    this.displayImage(
      this.currentStudent! * this.nbreFeuilleParCopie! + this.zonenom.pageNumber!,
      this.zonenom,
      this.nomImage,
      this.setShowNomImage
    );
    this.displayImage(
      this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneprenom.pageNumber!,
      this.zoneprenom,
      this.prenomImage,
      this.setShowPrenomImage
    );
    this.displayImage(
      this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneine.pageNumber!,
      this.zoneine,
      this.ineImage,
      this.setShowINEImage
    );
  }

  getImageAndRealign(zone: IZone, currentStudent: number, imageRef: ElementRef<any>, rescb: (i: ImageData) => void): void {
    if (zone !== undefined) {
      db.nonAlignImages
        .where('examId')
        .equals(+this.examId)
        .and(e1 => e1!.id === zone.pageNumber! + currentStudent * this.nbreFeuilleParCopie)
        .first()
        .then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);

          this.aligneImages(image.pages, zone.pageNumber! + currentStudent * this.nbreFeuilleParCopie, (p: IPage) => {
            imageRef!.nativeElement.width = (zone.width! * p.width!) / 100000;
            imageRef!.nativeElement.height = (zone.height! * p.height!) / 100000;

            this.alignImagesService
              .imageCrop({
                image: p.image,
                x: (zone.xInit! * p.width!) / 100000,
                y: (zone.yInit! * p.height!) / 100000,
                width: (zone.width! * p.width!) / 100000,
                height: (zone.height! * p.height!) / 100000,
              })
              .subscribe(res => {
                rescb(res);
              });
          });
        });
    }
  }

  public exportAsImage(): void {
    this.getImageAndRealign(this.zonenom, this.currentStudent, this.nomImage!, res => {
      const ctx1 = this.nomImage?.nativeElement.getContext('2d');
      ctx1.putImageData(res, 0, 0);
      this.showNomImage = true;
      this.getImageAndRealign(this.zoneprenom, this.currentStudent, this.prenomImage!, res1 => {
        const ctx2 = this.prenomImage?.nativeElement.getContext('2d');
        ctx2.putImageData(res1, 0, 0);
        this.showPrenomImage = true;
      });
      this.getImageAndRealign(this.zoneine, this.currentStudent, this.ineImage!, res1 => {
        const ctx2 = this.ineImage?.nativeElement.getContext('2d');
        ctx2.putImageData(res1, 0, 0);
        this.showINEImage = true;
      });
    });
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
    const i = new Image();
    i.onload = () => {
      this.editedImage = <HTMLCanvasElement>document.createElement('canvas');
      this.editedImage.width = i.width;
      this.editedImage.height = i.height;
      const ctx = this.editedImage.getContext('2d');
      ctx!.drawImage(i, 0, 0);
      const inputimage1 = ctx!.getImageData(0, 0, i.width, i.height);
      if (this.alignement !== 'off') {
        db.templates
          .where('examId')
          .equals(+this.examId)
          .and(e1 => e1!.id === pagen % this.nbreFeuilleParCopie)
          .first()
          .then(e1 => {
            const image1 = JSON.parse(e1!.value, this.reviver);

            this.loadImage(image1.pages, pagen % this.nbreFeuilleParCopie, (image2: ImageData, page: number, w: number, h: number) => {
              this.alignImagesService
                .imageAlignement({
                  imageA: image2,
                  imageB: inputimage1,
                  marker: this.alignement === 'marker',
                  x: (this.zoneine.xInit! * w!) / 100000,
                  y: (this.zoneine.yInit! * h) / 100000,
                  width: (this.zoneine.width! * w) / 100000,
                  height: (this.zoneine.height! * h) / 100000,
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
                  cb(apage);
                });
            });
          });
      } else {
        const apage = {
          image: inputimage1,
          page: pagen,
          width: i.width,
          height: i.height,
        };
        cb(apage);
      }
    };
    i.src = file;
  }

  onPageChange($event: any): void {
    this.selectionStudents = [];
    this.goToStudent($event.page);
  }

  selectStudent4Copie($event: any): void {
    this.selectionStudents = $event.value;
  }

  public alignementChange(): any {
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

  gotoUE(): any {
    this.router.navigateByUrl('/exam/' + this.examId);
  }
}
