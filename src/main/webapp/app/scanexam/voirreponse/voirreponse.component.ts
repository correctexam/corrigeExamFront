/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */

// http://localhost:9000/copie/d6680b56-36a5-4488-ac5b-c862096bc311/1

import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlignImagesService } from '../services/align-images.service';
import { db } from '../db/dbstudent';
import { IExam } from '../../entities/exam/exam.model';
// import { ICourse } from 'app/entities/course/course.model';
import { IStudent } from '../../entities/student/student.model';
import { ImageZone, IPage } from '../associer-copies-etudiants/associer-copies-etudiants.component';
import { IZone } from 'app/entities/zone/zone.model';
import { QuestionService } from '../../entities/question/service/question.service';
import { IQuestion } from '../../entities/question/question.model';
import { IStudentResponse } from '../../entities/student-response/student-response.model';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';
import { GradeType } from '../../entities/enumerations/grade-type.model';
import { ITextComment } from '../../entities/text-comment/text-comment.model';
import { IGradedComment } from '../../entities/graded-comment/graded-comment.model';
import { GradedCommentService } from '../../entities/graded-comment/service/graded-comment.service';
import { TextCommentService } from 'app/entities/text-comment/service/text-comment.service';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { IExamSheet } from '../../entities/exam-sheet/exam-sheet.model';
import { CacheUploadService } from '../exam-detail/cacheUpload.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-voirreponse',
  templateUrl: './voirreponse.component.html',
  styleUrls: ['./voirreponse.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class VoirReponseComponent implements OnInit, AfterViewInit {
  public href = '';

  @ViewChildren('nomImage')
  canvass!: QueryList<ElementRef>;
  showImage: boolean[] = [];
  nbreFeuilleParCopie: number | undefined;
  exam: IExam | undefined;
  currentStudent = 0;
  selectionStudents: IStudent[] | undefined;
  numberofzone: number | undefined = 0;
  questions: IQuestion[] | undefined;
  blocked = true;
  nbreQuestions = 1;
  currentNote = 0;
  noteSteps = 0;
  maxNote = 0;
  questionStep = 0;
  questionno = 0;
  resp: IStudentResponse | undefined;
  currentQuestion: IQuestion | undefined;
  noalign = false;
  factor = 1;
  uuid = '';
  sheet: IExamSheet | undefined;
  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;

  constructor(
    public examService: ExamService,
    public zoneService: ZoneService,
    //    public courseService: CourseService,
    public studentService: StudentService,
    public scanService: ScanService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private alignImagesService: AlignImagesService,
    public messageService: MessageService,
    public sheetService: ExamSheetService,
    public questionService: QuestionService,
    public gradedCommentService: GradedCommentService,
    public textCommentService: TextCommentService,
    public studentResponseService: StudentResponseService,
    private changeDetector: ChangeDetectorRef,
    public cacheUploadService: CacheUploadService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.href = this.router.url;

    this.activatedRoute.paramMap.subscribe(params => {
      this.blocked = true;
      this.currentNote = 0;
      this.noteSteps = 0;
      this.maxNote = 0;
      this.resp = undefined;
      if (params.get('base64uuid') !== null) {
        const base64uuid = params.get('base64uuid')!;
        const uuiddecode = atob(base64uuid);
        const param = uuiddecode.split('/');
        if (param.length > 2) {
          this.uuid = param[1];
          this.sheetService.query({ name: this.uuid }).subscribe(s => {
            this.sheet = s.body![0];
            this.currentStudent = this.sheet.pagemin! / (this.sheet.pagemax! - this.sheet.pagemin! + 1);

            this.studentService.query({ sheetId: this.sheet.id }).subscribe(studentsr => {
              this.selectionStudents = studentsr.body!;
              this.examService
                .query({
                  scanId: this.sheet!.scanId,
                })
                .subscribe(ex2 => {
                  this.exam = ex2.body![0];
                  if (
                    this.selectionStudents !== undefined &&
                    this.selectionStudents.length > 0 &&
                    this.selectionStudents[0].id !== undefined
                  ) {
                    this.questionno = +param[2] - 1;

                    this.nbreFeuilleParCopie = this.sheet!.pagemax! - this.sheet!.pagemin! + 1;
                    // Step 2 Query Scan in local DB
                    this.finalize();
                  }
                });
            });
          });
        }
      }
    });
  }

  finalize() {
    // Step 4 Query zone 4 questions
    this.blocked = false;
    this.questionService.query({ examId: this.exam!.id }).subscribe(b =>
      b.body!.forEach(q => {
        if (q.numero! > this.nbreQuestions) {
          this.nbreQuestions = q.numero!;
        }
      })
    );
    this.questionService.query({ examId: this.exam!.id, numero: this.questionno + 1 }).subscribe(q1 => {
      this.questions = q1.body!;
      this.showImage = new Array<boolean>(this.questions.length);

      if (this.questions.length > 0) {
        this.noteSteps = this.questions[0].point! * this.questions[0].step!;
        this.questionStep = this.questions[0].step!;
        this.maxNote = this.questions[0].point!;
        this.currentQuestion = this.questions[0];

        this.studentResponseService
          .query({
            sheetId: this.sheet!.id,
            questionId: this.questions[0].id,
          })
          .subscribe(sr => {
            if (sr.body !== null && sr.body.length > 0) {
              this.resp = sr.body![0];
              this.currentNote = this.resp.note!;
              if (this.questions![0].gradeType === GradeType.DIRECT) {
                this.currentTextComment4Question = this.resp.textcomments!;
              } else {
                this.currentGradedComment4Question = this.resp.gradedcomments!;
              }
            }
          });
      }
    });
  }

  ngAfterViewInit(): void {
    this.canvass.changes.subscribe(() => {
      this.reloadImage();
      this.changeDetector.detectChanges();
    });
  }

  reloadImage() {
    this.questions!.forEach((q, i) => {
      this.showImage[i] = false;
      this.loadZone(
        q.zoneId,
        b => {
          this.showImage[i] = b;
        },
        this.canvass.get(i),
        this.currentStudent
      );
    });
  }

  async loadZone(
    zoneId: number | undefined,
    showImageRef: (s: boolean) => void,
    imageRef: ElementRef<any> | undefined,
    currentStudent: number
  ): Promise<IZone | undefined> {
    return new Promise<IZone | undefined>(resolve => {
      if (zoneId) {
        this.zoneService.find(zoneId).subscribe(e => {
          this.getAllImage4Zone(currentStudent! * this.nbreFeuilleParCopie! + e.body!.pageNumber!, e.body!).then(p => {
            this.displayImage(p, imageRef, showImageRef);
            resolve(e.body!);
          });
        });
      } else {
        resolve(undefined);
      }
    });
  }

  displayImage(v: ImageZone, imageRef: ElementRef<any> | undefined, show: (s: boolean) => void): void {
    if (imageRef !== undefined) {
      imageRef!.nativeElement.width = v.w;
      imageRef!.nativeElement.height = v.h;
      const ctx1 = imageRef!.nativeElement.getContext('2d');
      ctx1.putImageData(v.i, 0, 0);
      //  this.addEventListeners( imageRef!.nativeElement)
      show(true);
    }
  }

  async getAllImage4Zone(pageInscan: number, zone: IZone): Promise<ImageZone> {
    if (this.noalign) {
      return new Promise((resolve, reject) => {
        db.nonAlignImages
          .where({ examId: +this.exam!.id!, pageNumber: pageInscan })
          .count()
          .then(count => {
            if (count === 0) {
              this.cacheUploadService.getNoAlignImage(this.exam!.id!, pageInscan).subscribe(body => {
                const image = JSON.parse(body, this.reviver);
                db.addNonAligneImage({
                  examId: this.exam!.id!,
                  pageNumber: pageInscan,
                  value: body,
                }).then(() => {
                  this.loadImage1(image, pageInscan, zone, resolve);
                });
              });
            } else if (count > 0) {
              db.nonAlignImages
                .where({ examId: +this.exam!.id!, pageNumber: pageInscan })
                .first()
                .then(e2 => {
                  const image = JSON.parse(e2!.value, this.reviver);
                  this.loadImage1(image, pageInscan, zone, resolve);
                });
            } else {
              db.resetDatabase().then(() => {
                reject('no image in cache');
              });
            }
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        db.alignImages
          .where({ examId: +this.exam!.id!, pageNumber: pageInscan })
          .count()
          .then(count => {
            if (count === 0) {
              this.cacheUploadService.getAlignImage(this.exam!.id!, pageInscan).subscribe(body => {
                const image = JSON.parse(body, this.reviver);
                db.addAligneImage({
                  examId: this.exam!.id!,
                  pageNumber: pageInscan,
                  value: body,
                }).then(() => {
                  this.loadImage1(image, pageInscan, zone, resolve);
                });
              });
            } else if (count > 0) {
              db.alignImages
                .where({ examId: +this.exam!.id!, pageNumber: pageInscan })
                .first()
                .then(e2 => {
                  const image = JSON.parse(e2!.value, this.reviver);
                  this.loadImage1(image, pageInscan, zone, resolve);
                });
            } else {
              db.resetDatabase().then(() => {
                reject('no image in cache');
              });
            }
          });
      });
    }
  }

  loadImage1(image: any, pageInscan: number, zone: IZone, resolve: (value: ImageZone | PromiseLike<ImageZone>) => void) {
    this.loadImage(image.pages, pageInscan).then(v => {
      let finalW = (zone.width! * v.width! * this.factor) / 100000;
      let finalH = (zone.height! * v.height! * this.factor) / 100000;
      let initX =
        (zone.xInit! * v.width!) / 100000 - ((zone.width! * v.width! * this.factor) / 100000 - (zone.width! * v.width!) / 100000) / 2;
      if (initX < 0) {
        finalW = finalW + initX;
        initX = 0;
      }
      let initY =
        (zone.yInit! * v.height!) / 100000 - ((zone.height! * v.height! * this.factor) / 100000 - (zone.height! * v.height!) / 100000) / 2;
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
  }

  async loadImage(file: any, page1: number): Promise<IPage> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const inputimage = ctx!.getImageData(0, 0, i.width, i.height);
        resolve({ image: inputimage, page: page1, width: i.width, height: i.height });
      };
      i.src = file;
    });
  }

  changeAlign(): void {
    this.reloadImage();
  }

  async removeElement(examId: number): Promise<any> {
    await db.removeElementForExam(examId);
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

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }
}
