/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ZoneService } from '../../entities/zone/service/zone.service';
import { CourseService } from 'app/entities/course/service/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { ICourse } from 'app/entities/course/course.model';
import { IScan } from '../../entities/scan/scan.model';
import { IZone } from 'app/entities/zone/zone.model';
import { AlignImagesService } from '../services/align-images.service';
import { ITemplate } from 'app/entities/template/template.model';
import { db } from '../db/db';
import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from '../../entities/student/student.model';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { IExamSheet } from '../../entities/exam-sheet/exam-sheet.model';
import { v4 as uuid } from 'uuid';
import { faHouseSignal } from '@fortawesome/free-solid-svg-icons';
import { Listbox } from 'primeng/listbox';

export interface IPage {
  image?: ImageData;
  page?: number;
  width?: number;
  height?: number;
}

export interface ImageZone {
  i: ImageData;
  w: number;
  h: number;
}

@Component({
  selector: 'jhi-associer-copies-etudiants',
  templateUrl: './associer-copies-etudiants.component.html',
  styleUrls: ['./associer-copies-etudiants.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class AssocierCopiesEtudiantsComponent implements OnInit {
  @ViewChild('list')
  list!: Listbox;
  faHouseSignal = faHouseSignal;
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
  selectionStudents: any[] = [];
  selectionStudentsString: () => string = () => this.selectionStudents.map(s => s.name + ' ' + s.firstname).join(' - ');
  showRecognizedStudent: () => string = () =>
    this.recognizedStudent?.name +
    ' ' +
    this.recognizedStudent?.firstname +
    ' (' +
    this.recognizedStudent?.ine +
    ') [precision=' +
    this.predictionprecision +
    ']';

  students: IStudent[] = [];
  assisted = true;

  studentsOptions: () => SelectItem[] = () =>
    this.students.map(student => ({
      value: student,
      label: student.name + ' - ' + student.firstname + ' - (' + student.ine + ')',
    }));

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
  @ViewChild('nomImageReco')
  nomImageReco: ElementRef | undefined;
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
  @ViewChild('prenomImageReco')
  prenomImageReco: ElementRef | undefined;
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
  @ViewChild('ineImageReco')
  ineImageReco: ElementRef | undefined;
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
  noalign = false;
  factor = 1;

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
  recognizedStudent: IStudent | undefined;
  predictionprecision = 0;

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

  constructor(
    public examService: ExamService,
    public zoneService: ZoneService,
    public courseService: CourseService,
    public studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private alignImagesService: AlignImagesService,
    public messageService: MessageService,
    public sheetService: ExamSheetService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.recognizedStudent = undefined;
      this.blocked = true;
      if (params.get('examid') !== null) {
        if (this.examId !== params.get('examid')!) {
          this.examId = params.get('examid')!;
          this.images = [];
          this.loadAllPages();

          if (params.get('currentStudent') !== null) {
            this.currentStudent = +params.get('currentStudent')! - 1;

            // const startTime = performance.now();
            // Step 1 Query templates
            db.templates
              .where('examId')
              .equals(+this.examId)
              .count()
              .then(e2 => {
                this.nbreFeuilleParCopie = e2;

                this.activeIndex = this.currentStudent! * this.nbreFeuilleParCopie!;
                // Step 2 Query Scan in local DB
                /* let endTime = performance.now();
              let totalTime = endTime - startTime; // ti
              console.log(' step 1 ' + totalTime);*/
                this.factor = 1;
                this.noalign = false;
                db.alignImages
                  .where('examId')
                  .equals(+this.examId)
                  .count()
                  .then(e1 => {
                    /* endTime = performance.now();
                  totalTime = endTime - startTime; // ti
                  //   console.log(' step 2 ' + totalTime);*/

                    this.numberPagesInScan = e1;
                    this.examService.find(+this.examId).subscribe(data => {
                      // Step 3 Query Exam
                      /* endTime = performance.now();
                    totalTime = endTime - startTime; // ti
                    //  console.log(' step 3 ' + totalTime);*/

                      this.exam = data.body!;
                      this.courseService.find(this.exam.courseId!).subscribe(e => (this.course = e.body!));
                      // Step 4 Query Students for Exam
                      this.refreshStudentList().then(() => this.loadImageAndPredict());
                    });
                  });
              });
          } else {
            const c = this.currentStudent + 1;
            this.router.navigateByUrl('/studentbindings/' + this.examId! + '/' + c);
          }
        } else {
          this.currentStudent = +params.get('currentStudent')! - 1;
          this.activeIndex = this.currentStudent! * this.nbreFeuilleParCopie!;
          this.getFilterStudent();
          this.loadImageAndPredict();
        }
      }
    });
  }

  loadImageAndPredict(): void {
    /* endTime = performance.now();
      totalTime = endTime - startTime; // ti
      //    console.log(' step 4 ' + totalTime);*/
    const promiseload: Promise<ImageZone | null>[] = [];
    // Step 4 Query zone
    const p0 = this.loadZone(this.exam.namezoneId, this.setZoneNom, true, this.setShowNomImage, this.nomImage, this.currentStudent);
    /*                        true,
        this.students.map(student => student.name!),
        this.nomImageReco*/

    promiseload.push(p0);

    const p1 = this.loadZone(
      this.exam.firstnamezoneId,
      this.setZonePrenom,
      true,
      this.setShowPrenomImage,
      this.prenomImage,
      this.currentStudent
      /* true,
        this.students.map(student => student.firstname!),
        this.prenomImageReco*/
    );
    promiseload.push(p1);
    const p2 = this.loadZone(
      this.exam.idzoneId,
      this.setZoneINE,
      true,
      this.setShowINEImage,
      this.ineImage,
      this.currentStudent
      /* false,
        this.students.map(student => student.ine!),
        this.ineImageReco*/
    );
    promiseload.push(p2);

    Promise.all(promiseload).then(value => {
      /* endTime = performance.now();
        totalTime = endTime - startTime; // ti*/
      // console.log(' all image are loaded => start prediction ' + totalTime);
      this.blocked = false;
      const ppredics: Promise<(string | number)[]>[] = [];
      ppredics.push(
        this.predictText(
          value[0]!,
          true,
          this.students.map(student => student.name!),
          this.nomImageReco!
        )
      );
      ppredics.push(
        this.predictText(
          value[1]!,
          true,
          this.students.map(student => student.firstname!),
          this.prenomImageReco!
        )
      );

      ppredics.push(
        this.predictText(
          value[2]!,
          false,
          this.students.map(student => student.ine!),
          this.ineImageReco!
        )
      );
      Promise.all(ppredics).then(predicts => {
        /* endTime = performance.now();
          totalTime = endTime - startTime; // ti*/
        //  console.log(' get prediction ' + totalTime);

        const solutionName = predicts[0];
        const solutionFirstname = predicts[1];
        const solutionINE = predicts[2];
        console.log(solutionName);
        console.log(solutionFirstname);
        console.log(solutionINE);
        if (solutionName.length > 0 && solutionFirstname.length > 0 && solutionINE.length > 0) {
          let sts = this.students.filter(
            student =>
              (solutionName[0] as string).toLowerCase() === student.name?.toLowerCase() &&
              (solutionFirstname[0] as string).toLowerCase() === student.firstname?.toLowerCase() &&
              (solutionINE[0] as string).toLowerCase() === student.ine?.toLowerCase()
          );
          if (sts.length > 0) {
            this.recognizedStudent = sts[0];
            this.predictionprecision = ((solutionName[1] as number) + (solutionFirstname[1] as number) + (solutionINE[1] as number)) / 3;
          } else {
            if (solutionINE[1] < solutionFirstname[1] && solutionINE[1] < solutionName[1]) {
              let sts1 = this.students.filter(
                student =>
                  (solutionName[0] as string).toLowerCase() === student.name?.toLowerCase() &&
                  (solutionFirstname[0] as string).toLowerCase() === student.firstname?.toLowerCase()
              );
              if (sts1.length > 0) {
                this.recognizedStudent = sts1[0];
                this.predictionprecision = ((solutionName[1] as number) + (solutionFirstname[1] as number)) / 2;
              }
            } else if (this.recognizedStudent === undefined && solutionName[1] < solutionFirstname[1] && solutionName[1] < solutionINE[1]) {
              let sts1 = this.students.filter(
                student =>
                  (solutionFirstname[0] as string).toLowerCase() === student.firstname?.toLowerCase() &&
                  (solutionINE[0] as string).toLowerCase() === student.ine?.toLowerCase()
              );
              if (sts1.length > 0) {
                this.recognizedStudent = sts1[0];
                this.predictionprecision = ((solutionFirstname[1] as number) + (solutionINE[1] as number)) / 2;
              }
            } else if (
              this.recognizedStudent === undefined &&
              solutionFirstname[1] < solutionName[1] &&
              solutionFirstname[1] < solutionINE[1]
            ) {
              sts = this.students.filter(
                student =>
                  (solutionName[0] as string).toLowerCase() === student.name?.toLowerCase() &&
                  (solutionINE[0] as string).toLowerCase() === student.ine?.toLowerCase()
              );
              if (sts.length > 0) {
                this.recognizedStudent = sts[0];
                this.predictionprecision = ((solutionName[1] as number) + (solutionINE[1] as number)) / 2;
              }
            }
            if (
              this.recognizedStudent === undefined &&
              solutionINE[1] > solutionName[1] &&
              solutionINE[1] > solutionFirstname[1] &&
              solutionINE[1] > 0.4
            ) {
              sts = this.students.filter(student => (solutionINE[0] as string).toLowerCase() === student.ine?.toLowerCase());
              if (sts.length > 0) {
                this.recognizedStudent = sts[0];
                this.predictionprecision = solutionINE[1] as number;
              }
            }
            if (
              (this.recognizedStudent === undefined &&
                solutionName[1] > solutionINE[1] &&
                solutionName[1] > solutionFirstname[1] &&
                solutionName[1] > 0.4) ||
              (solutionFirstname[1] > solutionINE[1] && solutionFirstname[1] > solutionName[1] && solutionFirstname[1] > 0.4)
            ) {
              sts = this.students.filter(
                student =>
                  (solutionName[0] as string).toLowerCase() === student.name?.toLowerCase() &&
                  (solutionFirstname[0] as string).toLowerCase() === student.firstname?.toLowerCase()
              );
              if (sts.length > 0) {
                this.recognizedStudent = sts[0];
                this.predictionprecision = ((solutionName[1] as number) + (solutionFirstname[1] as number)) / 2;
              }
            }
          }
        } else if (solutionName.length > 0 && solutionFirstname.length > 0) {
          let sts = this.students.filter(
            student =>
              (solutionName[0] as string).toLowerCase() === student.name?.toLowerCase() &&
              (solutionFirstname[0] as string).toLowerCase() === student.firstname?.toLowerCase()
          );
          if (sts.length > 0) {
            this.recognizedStudent = sts[0];
            this.predictionprecision = ((solutionName[1] as number) + (solutionFirstname[1] as number)) / 2;
          }
        } else if (solutionName.length > 0 && solutionINE.length > 0) {
          let sts = this.students.filter(
            student =>
              (solutionName[0] as string).toLowerCase() === student.name?.toLowerCase() &&
              (solutionINE[0] as string).toLowerCase() === student.ine?.toLowerCase()
          );
          if (sts.length > 0) {
            this.recognizedStudent = sts[0];
            this.predictionprecision = ((solutionName[1] as number) + (solutionINE[1] as number)) / 2;
          }
        } else if (solutionINE.length > 0 && solutionINE[1] > 0.4) {
          let sts = this.students.filter(student => (solutionINE[0] as string).toLowerCase() === student.ine?.toLowerCase());
          if (sts.length > 0) {
            this.recognizedStudent = sts[0];
            this.predictionprecision = solutionINE[1] as number;
          }
        }
      });
    });
  }
  reloadImageGrowFactor(event: any): void {
    if (event.value !== this.factor) {
      this.factor = event.value;
      this.reloadImage();
    }
  }

  reloadImage(): void {
    this.blocked = true;

    const promiseload: Promise<ImageZone | null>[] = [];
    const p0 = this.loadZone(this.exam.namezoneId, this.setZoneNom, true, this.setShowNomImage, this.nomImage, this.currentStudent);

    promiseload.push(p0);

    const p1 = this.loadZone(
      this.exam.firstnamezoneId,
      this.setZonePrenom,
      true,
      this.setShowPrenomImage,
      this.prenomImage,
      this.currentStudent
    );
    promiseload.push(p1);
    const p2 = this.loadZone(this.exam.idzoneId, this.setZoneINE, true, this.setShowINEImage, this.ineImage, this.currentStudent);
    promiseload.push(p2);

    Promise.all(promiseload).then(() => (this.blocked = false));
  }

  async predictText(p: ImageZone, zoneletter: boolean, candidatematch: string[], debugimageRef: ElementRef): Promise<(string | number)[]> {
    return new Promise<(string | number)[]>(resolve => {
      if (this.assisted) {
        const c = { image: p.i, match: candidatematch };
        this.alignImagesService.prediction(c, zoneletter).subscribe(result => {
          const ctx2 = debugimageRef?.nativeElement.getContext('2d');
          ctx2.putImageData(result.debug, 0, 0);
          resolve(result.solution!);
        });
      } else {
        resolve([]);
      }
    });
  }
  @HostListener('window:keydown.control.Enter', ['$event'])
  async selectRecogniezStudent(): Promise<void> {
    this.selectionStudents = [this.recognizedStudent];
    await this.bindStudent();
    if ((this.currentStudent + 1) * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.currentStudent = this.currentStudent + 1;
      this.goToStudent(this.currentStudent);
    }
  }

  async loadZone(
    zoneId: number | undefined,
    z: (zone: IZone) => void,
    showImage: boolean,
    showImageRef: (s: boolean) => void,
    imageRef: ElementRef<any> | undefined,
    currentStudent: number
  ): Promise<ImageZone | null> {
    return new Promise<ImageZone | null>(resolve => {
      if (zoneId) {
        this.zoneService.find(zoneId).subscribe(e => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          z(e.body!);
          this.getAllImage4Zone(currentStudent! * this.nbreFeuilleParCopie! + e.body!.pageNumber!, e.body!).then(p => {
            if (showImage) {
              this.displayImage(p, imageRef, showImageRef);
            }
            resolve(p);
          });
        });
      } else {
        resolve(null);
      }
    });
  }

  async getAllImage4Zone(pageInscan: number, zone: IZone): Promise<ImageZone> {
    if (this.noalign) {
      return new Promise(resolve => {
        // const startTime = performance.now();
        db.nonAlignImages
          .where({ examId: +this.examId, pageNumber: pageInscan })
          .first()
          .then(e2 => {
            const image = JSON.parse(e2!.value, this.reviver);
            this.loadImage(image.pages, pageInscan).then(v => {
              let finalW = (zone.width! * v.width! * this.factor) / 100000;
              let finalH = (zone.height! * v.height! * this.factor) / 100000;
              let initX =
                (zone.xInit! * v.width!) / 100000 -
                ((zone.width! * v.width! * this.factor) / 100000 - (zone.width! * v.width!) / 100000) / 2;
              if (initX < 0) {
                finalW = finalW + initX;
                initX = 0;
              }
              let initY =
                (zone.yInit! * v.height!) / 100000 -
                ((zone.height! * v.height! * this.factor) / 100000 - (zone.height! * v.height!) / 100000) / 2;
              if (initY < 0) {
                finalH = finalH + initY;
                initY = 0;
              }
              this.alignImagesService
                .imageCrop({
                  image: v.image,
                  x: initX,
                  y: initY,
                  width: finalW,
                  height: finalH,
                })
                .subscribe(res => resolve({ i: res, w: finalW, h: finalH }));

              /*
              const finalW = (zone.width! * v.width!) / 100000;
              const finalH = (zone.height! * v.height!) / 100000;
              this.alignImagesService
                .imageCrop({
                  image: v.image,
                  x: (zone.xInit! * v.width!) / 100000,
                  y: (zone.yInit! * v.height!) / 100000,
                  width: finalW,
                  height: finalH,
                })
                .subscribe(res => {
                  resolve({ i: res, w: finalW, h: finalH });
                });*/
            });
          });
      });
    } else {
      return new Promise(resolve => {
        // const startTime = performance.now();
        db.alignImages
          .where({ examId: +this.examId, pageNumber: pageInscan })
          .first()
          .then(e2 => {
            const image = JSON.parse(e2!.value, this.reviver);
            this.loadImage(image.pages, pageInscan).then(v => {
              let finalW = (zone.width! * v.width! * this.factor) / 100000;
              let finalH = (zone.height! * v.height! * this.factor) / 100000;
              let initX =
                (zone.xInit! * v.width!) / 100000 -
                ((zone.width! * v.width! * this.factor) / 100000 - (zone.width! * v.width!) / 100000) / 2;
              if (initX < 0) {
                finalW = finalW + initX;
                initX = 0;
              }
              let initY =
                (zone.yInit! * v.height!) / 100000 -
                ((zone.height! * v.height! * this.factor) / 100000 - (zone.height! * v.height!) / 100000) / 2;
              if (initY < 0) {
                finalH = finalH + initY;
                initY = 0;
              }
              this.alignImagesService
                .imageCrop({
                  image: v.image,
                  x: initX,
                  y: initY,
                  width: finalW,
                  height: finalH,
                })
                .subscribe(res => resolve({ i: res, w: finalW, h: finalH }));
            });
          });
      });
    }
  }

  displayImage(v: ImageZone, imageRef: ElementRef<any> | undefined, show: (s: boolean) => void): void {
    if (imageRef !== undefined) {
      imageRef!.nativeElement.width = v.w;
      imageRef!.nativeElement.height = v.h;
      const ctx1 = imageRef!.nativeElement.getContext('2d');

      ctx1.putImageData(v.i, 0, 0);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      show(true);
    }
  }

  goToStudent(i: number): void {
    this.list._filterValue = '';
    this.list._filteredOptions = this.list._options;

    if (i * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.router.navigateByUrl('studentbindings/' + this.examId + '/' + (i + 1));
    }
  }

  reShow(): void {
    this.getAllImage4Zone(this.currentStudent! * this.nbreFeuilleParCopie! + this.zonenom.pageNumber!, this.zonenom).then(p =>
      this.displayImage(p, this.nomImage, this.setShowNomImage)
    );
    this.getAllImage4Zone(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneprenom.pageNumber!, this.zoneprenom).then(p =>
      this.displayImage(p, this.prenomImage, this.setShowPrenomImage)
    );
    this.getAllImage4Zone(this.currentStudent! * this.nbreFeuilleParCopie! + this.zoneine.pageNumber!, this.zoneine).then(p =>
      this.displayImage(p, this.ineImage, this.setShowINEImage)
    );

    const filterStudent = this.students.filter(s =>
      s.examSheets?.some(ex => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie)
    );
    this.selectionStudents = filterStudent;
  }

  async refresh(): Promise<void> {
    await this.refreshStudentList();
    this.reShow();
  }

  async getImageAndRealign(zone: IZone, currentStudent: number, imageRef: ElementRef<any>): Promise<ImageData> {
    return new Promise<ImageData>(resolve => {
      if (zone !== undefined) {
        db.nonAlignImages
          .where({ examId: +this.examId, pageNumber: zone.pageNumber! + currentStudent * this.nbreFeuilleParCopie })
          .first()
          .then(e2 => {
            const image = JSON.parse(e2!.value, this.reviver);

            this.aligneImages(image.pages, zone.pageNumber! + currentStudent * this.nbreFeuilleParCopie).then((p: IPage) => {
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
                  resolve(res);
                });
            });
          });
      }
    });
  }

  public exportAsImage(): void {
    this.getImageAndRealign(this.zonenom, this.currentStudent, this.nomImage!).then(res => {
      const ctx1 = this.nomImage?.nativeElement.getContext('2d');
      ctx1.putImageData(res, 0, 0);
      this.showNomImage = true;
      this.getImageAndRealign(this.zoneprenom, this.currentStudent, this.prenomImage!).then(res1 => {
        const ctx2 = this.prenomImage?.nativeElement.getContext('2d');
        ctx2.putImageData(res1, 0, 0);
        this.showPrenomImage = true;
      });
      this.getImageAndRealign(this.zoneine, this.currentStudent, this.ineImage!).then(res1 => {
        const ctx2 = this.ineImage?.nativeElement.getContext('2d');
        ctx2.putImageData(res1, 0, 0);
        this.showINEImage = true;
      });
    });
  }

  async loadImage(file: any, page1: number): Promise<IPage> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        this.editedImage = <HTMLCanvasElement>document.createElement('canvas');
        this.editedImage.width = i.width;
        this.editedImage.height = i.height;
        const ctx = this.editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const inputimage = ctx!.getImageData(0, 0, i.width, i.height);
        resolve({ image: inputimage, page: page1, width: i.width, height: i.height });
      };
      i.src = file;
    });
  }

  async aligneImages(file: any, pagen: number): Promise<IPage> {
    return new Promise<IPage>(resolve => {
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
            .where({ examId: +this.examId, pageNumber: pagen % this.nbreFeuilleParCopie })
            .first()
            .then(e1 => {
              const image1 = JSON.parse(e1!.value, this.reviver);

              this.loadImage(image1.pages, pagen % this.nbreFeuilleParCopie).then(v => {
                this.alignImagesService
                  .imageAlignement({
                    imageA: v.image,
                    imageB: inputimage1,
                    marker: this.alignement === 'marker',
                    x: (this.zoneine.xInit! * v.width!) / 100000,
                    y: (this.zoneine.yInit! * v.height!) / 100000,
                    width: (this.zoneine.width! * v.width!) / 100000,
                    height: (this.zoneine.height! * v.height!) / 100000,
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
                    resolve(apage);
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
          resolve(apage);
        }
      };
      i.src = file;
    });
  }

  onPageChange($event: any): void {
    this.selectionStudents = [];
    this.goToStudent($event.page);
  }

  selectStudent4Copie($event: any): void {
    this.selectionStudents = $event.value;
  }

  public alignementChange(): any {
    this.loadAllPages();
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

  async refreshStudentList(): Promise<void> {
    await new Promise<void>(res =>
      this.studentService.query({ courseId: this.exam.courseId }).subscribe(studentsbody => {
        this.students = studentsbody.body!;
        // Step 5 Bind All copies
        this.getFilterStudent();
        //  this.list.onOptionDoubleClick = (event) => {console.log(event)}
        // console.log(this.list.el.nativeElement);

        res();
      })
    );
  }

  getFilterStudent(): void {
    const filterStudent = this.students.filter(s =>
      s.examSheets?.some(ex => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie)
    );
    this.selectionStudents = filterStudent;
  }

  async selectStudents(event: IStudent): Promise<void> {
    this.selectionStudents = [event];

    await this.bindStudent();
    if ((this.currentStudent + 1) * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.currentStudent = this.currentStudent + 1;
      this.goToStudent(this.currentStudent);
    }
  }

  async bindStudent(): Promise<void> {
    console.log('foo1');
    return new Promise<void>(resolve1 => {
      const examSheet4CurrentStudent: IExamSheet[] = (
        this.students.filter(s => this.selectionStudents.map((s1: IStudent) => s1.id)!.includes(s.id)).map(s => s.examSheets) as any
      )
        .flat()
        .filter((ex: any) => ex?.scanId === this.exam.scanfileId);
      const examSheet4CurrentPage: IExamSheet[] = (
        this.students
          .filter(s =>
            s.examSheets?.some(ex => ex?.scanId === this.exam.scanfileId && ex.pagemin === this.currentStudent * this.nbreFeuilleParCopie)
          )
          .map(s => s.examSheets) as any
      ).flat();
      let promises: Promise<void>[] = [];
      examSheet4CurrentPage
        .filter(ex => !examSheet4CurrentStudent.map(ex1 => ex1.id).includes(ex!.id))
        .forEach(ex => {
          ex!.pagemin = -1;
          ex!.pagemax = -1;
          const p = new Promise<void>(res => {
            this.sheetService.update(ex!).subscribe(() => {
              res();
            });
          });
          promises.push(p);
        });

      const selectedStudent = this.students.filter(s => this.selectionStudents.map((s1: IStudent) => s1.id)!.includes(s.id));
      selectedStudent.forEach(student => {
        const examS4Student = student.examSheets?.filter((ex: IExamSheet) => ex?.scanId === this.exam.scanfileId);
        if (examS4Student !== undefined && examS4Student.length > 0) {
          examS4Student.forEach((ex: IExamSheet) => {
            ex.pagemin = this.currentStudent * this.nbreFeuilleParCopie;
            ex.pagemax = (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1;
            const p1 = new Promise<void>(res => {
              this.sheetService.update(ex).subscribe(() => {
                res();
              });
            });
            promises.push(p1);
          });
        } else {
          const sheet: IExamSheet = {
            name: uuid(),
            pagemin: this.currentStudent * this.nbreFeuilleParCopie,
            pagemax: (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1,
            scanId: this.exam.scanfileId,
            students: this.selectionStudents,
          };

          const p = new Promise<void>(res => {
            this.sheetService.create(sheet).subscribe(e => {
              const p1s: Promise<void>[] = [];
              this.selectionStudents.forEach(s1 => {
                const p1 = new Promise<void>(res1 => {
                  s1.examSheets?.push(e.body!);
                  this.studentService.update(s1).subscribe(() => {
                    res1();
                  });
                });
                p1s.push(p1);
              });
              Promise.all(p1s).then(() => res());
            });
          });
          promises.push(p);
        }
      });
      Promise.all(promises).then(() => {
        // console.log('all actions done');
        this.refreshStudentList().then(() => resolve1());
      });
    });
  }

  showGalleria(): void {
    this.displayBasic = true;
  }

  loadAllPages(): void {
    if (this.noalign) {
      db.nonAlignImages.where({ examId: +this.examId! }).each(e => {
        const image = JSON.parse(e!.value, this.reviver);
        this.images.push({
          src: image.pages,
          alt: 'Description for Image 2',
          title: 'Exam',
        });
      });
    } else {
      db.alignImages.where({ examId: +this.examId! }).each(e => {
        const image = JSON.parse(e!.value, this.reviver);
        this.images.push({
          src: image.pages,
          alt: 'Description for Image 2',
          title: 'Exam',
        });
      });
    }
  }
}
