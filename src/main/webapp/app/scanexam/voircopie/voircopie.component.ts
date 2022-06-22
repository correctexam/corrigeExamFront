/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */

// http://localhost:9000/copie/d6680b56-36a5-4488-ac5b-c862096bc311/1

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
  HostListener,
  ViewChild,
} from '@angular/core';
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
import { EventCanevasVoirCopieHandlerService } from './event-canevasvoircopie-handler.service';
import { ZoneVoirCopieHandler } from './ZoneVoirCopieHandler';
import { GradeType } from '../../entities/enumerations/grade-type.model';
import { ITextComment } from '../../entities/text-comment/text-comment.model';
import { IGradedComment } from '../../entities/graded-comment/graded-comment.model';
import { GradedCommentService } from '../../entities/graded-comment/service/graded-comment.service';
import { TextCommentService } from 'app/entities/text-comment/service/text-comment.service';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { FinalResultService } from '../../entities/final-result/service/final-result.service';
import { IFinalResult } from '../../entities/final-result/final-result.model';
import { IScan } from '../../entities/scan/scan.model';
import { IExamSheet } from '../../entities/exam-sheet/exam-sheet.model';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { TemplateService } from '../../entities/template/service/template.service';
import { ITemplate } from 'app/entities/template/template.model';

@Component({
  selector: 'jhi-voircopie',
  templateUrl: './voircopie.component.html',
  styleUrls: ['./voircopie.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class VoirCopieComponent implements OnInit, AfterViewInit {
  public href = '';

  @ViewChildren('nomImage')
  canvass!: QueryList<ElementRef>;
  showImage: boolean[] = [];
  nbreFeuilleParCopie: number | undefined;
  numberPagesInScan: number | undefined;
  exam: IExam | undefined;
  // course: ICourse | undefined;
  // students: IStudent[] | undefined;
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
  note = new Promise<number>(resolve => {
    this.resolve = resolve;
  });
  scan: IScan | undefined;
  resolve: any;
  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;
  finalResult: IFinalResult | undefined;

  private editedImage: HTMLCanvasElement | undefined;
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
  nonalignPages: Map<number, IPage> = new Map();
  debug = false;
  phase1 = false;
  loaded = false;
  alignement = 'marker';
  template!: ITemplate;
  pdfcontent!: string;
  currentZoneVoirCopieHandler: ZoneVoirCopieHandler | undefined;
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
    private eventHandler: EventCanevasVoirCopieHandlerService,
    public finalResultService: FinalResultService,
    private pdfService: NgxExtendedPdfViewerService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.href = this.router.url;

    this.activatedRoute.paramMap.subscribe(params => {
      this.blocked = true;
      this.currentNote = 0;
      this.noteSteps = 0;
      this.maxNote = 0;
      this.resp = undefined;
      //      'answer/:examid/:questionno/:studentid',
      if (params.get('uuid') !== null) {
        this.uuid = params.get('uuid')!;
        this.sheetService.query({ name: params.get('uuid') }).subscribe(s => {
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
                  this.finalResultService
                    .query({ examId: this.exam.id, studentId: this.selectionStudents![0].id })
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    .subscribe(bo => this.resolve(bo.body![0].note! / 100));
                }

                if (params.get('questionno') !== null) {
                  this.questionno = +params.get('questionno')! - 1;

                  // Step 1 Query templates

                  this.nbreFeuilleParCopie = this.sheet!.pagemax! - this.sheet!.pagemin! + 1;
                  // Step 2 Query Scan in local DB
                  db.alignImages
                    .where('examId')
                    .equals(this.exam!.id!)
                    .count()
                    .then(e1 => {
                      if (e1 === 0) {
                        this.populateCache();
                      } else {
                        this.numberPagesInScan = e1;
                        this.finalize();
                      }
                    });
                }
              });
          });
        });
      }
    });
  }

  finalize() {
    // this.courseService.find(this.exam!.courseId!).subscribe(e => (this.course = e.body!));

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
        this.currentStudent,
        i
      );
    });
  }

  checked(comment: ITextComment | IGradedComment): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (comment as any).checked;
  }

  getStyle(comment: ITextComment | IGradedComment): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if ((comment as any).checked) {
      return { 'background-color': '#DCDCDC' };
    } else {
      return {};
    }
  }

  @HostListener('window:keydown.shift.ArrowLeft', ['$event'])
  previousQuestion(event: KeyboardEvent): void {
    event.preventDefault();
    const q = this.questionno;
    if (q > 0) {
      this.router.navigateByUrl('/copie/' + this.uuid + '/' + q);
    }
  }
  @HostListener('window:keydown.shift.ArrowRight', ['$event'])
  nextQuestion(event: KeyboardEvent): void {
    event.preventDefault();
    const q = this.questionno + 2;
    if (q <= this.nbreQuestions) {
      this.router.navigateByUrl('/copie/' + this.uuid + '/' + q);
    }
  }

  changeQuestion($event: any): void {
    this.questionno = $event.page;
    this.router.navigateByUrl('/copie/' + this.uuid + '/' + (this.questionno + 1));
  }

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  async loadZone(
    zoneId: number | undefined,
    showImageRef: (s: boolean) => void,
    imageRef: ElementRef<any> | undefined,
    currentStudent: number,
    index: number
  ): Promise<IZone | undefined> {
    return new Promise<IZone | undefined>(resolve => {
      if (zoneId) {
        this.zoneService.find(zoneId).subscribe(e => {
          this.getAllImage4Zone(currentStudent! * this.nbreFeuilleParCopie! + e.body!.pageNumber!, e.body!).then(p => {
            this.displayImage(p, imageRef, showImageRef, index);
            resolve(e.body!);
          });
        });
      } else {
        resolve(undefined);
      }
    });
  }

  displayImage(v: ImageZone, imageRef: ElementRef<any> | undefined, show: (s: boolean) => void, index: number): void {
    if (imageRef !== undefined) {
      imageRef!.nativeElement.width = v.w;
      imageRef!.nativeElement.height = v.h;
      const ctx1 = imageRef!.nativeElement.getContext('2d');
      ctx1.putImageData(v.i, 0, 0);
      //  this.addEventListeners( imageRef!.nativeElement)
      show(true);

      if (this.currentZoneVoirCopieHandler === undefined) {
        const zh = new ZoneVoirCopieHandler(
          '' + this.exam!.id + '_' + this.selectionStudents![0].id + '_' + this.questionno + '_' + index,
          this.eventHandler,
          this.resp?.id
        );
        zh.updateCanvas(imageRef!.nativeElement);
        this.currentZoneVoirCopieHandler = zh;
      } else {
        if (
          this.currentZoneVoirCopieHandler.zoneid ===
          '' + this.exam!.id + '_' + this.selectionStudents![0].id + '_' + this.questionno + '_' + index
        ) {
          this.currentZoneVoirCopieHandler.updateCanvas(imageRef!.nativeElement);
        } else {
          const zh = new ZoneVoirCopieHandler(
            '' + this.exam!.id + '_' + this.selectionStudents![0].id + '_' + this.questionno + '_' + index,
            this.eventHandler,
            this.resp?.id
          );
          zh.updateCanvas(imageRef!.nativeElement);
          this.currentZoneVoirCopieHandler = zh;
        }
      }
    }
  }

  async getAllImage4Zone(pageInscan: number, zone: IZone): Promise<ImageZone> {
    if (this.noalign) {
      return new Promise(resolve => {
        db.nonAlignImages
          .where({ examId: +this.exam!.id!, pageNumber: pageInscan })
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
    } else {
      return new Promise(resolve => {
        db.alignImages
          .where({ examId: +this.exam!.id!, pageNumber: pageInscan })
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

  populateCache() {
    // this.courseService.find(this.exam!.courseId!).subscribe(e => (this.course = e.body!));
    if (this.exam!.templateId) {
      this.templateService.find(this.exam!.templateId).subscribe(e1 => {
        this.template = e1.body!;
        this.pdfcontent = this.template.content!;
      });
    }
  }

  async removeElement(examId: number): Promise<any> {
    await db.removeElementForExam(examId);
    await db.removeExam(examId);
  }

  public pdfloaded(): void {
    if (!this.phase1) {
      this.nbreFeuilleParCopie = this.pdfService.numberOfPages();
      this.process();
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
    this.removeElement(this.exam!.id!);
    if (!this.phase1) {
      const scale = { scale: 2 };
      for (let i = 1; i <= this.nbreFeuilleParCopie!; i++) {
        this.pdfService.getPageAsImage(i, scale).then(dataURL => {
          this.loadImage(dataURL, i).then(res1 => {
            this.templatePages.set(res1.page!, {
              image: res1.image,
              page: res1.page,
              width: res1.width,
              height: res1.height,
            });
            if (res1.page! === this.nbreFeuilleParCopie) {
              this.phase1 = true;
              if (this.exam!.scanfileId) {
                this.scanService.find(this.exam!.scanfileId).subscribe(e => {
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
    const templatePages64: Map<number, string> = new Map();
    const alignPages64: Map<number, string> = new Map();
    const nonalignPages64: Map<number, string> = new Map();
    this.templatePages.forEach((e, k) => {
      templatePages64.set(k, this.fgetBase64Image(e.image!));
    });
    this.alignPages.forEach((e, k) => {
      alignPages64.set(k, this.fgetBase64Image(e.image!));
    });
    this.nonalignPages.forEach((e, k) => {
      nonalignPages64.set(k, this.fgetBase64Image(e.image!));
    });
    await db.exams.add({
      id: +this.exam!.id!,
    });

    for (const e of templatePages64.keys()) {
      await db.templates.add({
        examId: +this.exam!.id!,
        pageNumber: e,
        value: JSON.stringify(
          {
            pages: templatePages64.get(e)!,
          },
          this.replacer
        ),
      });
    }

    for (const e of alignPages64.keys()) {
      await db.alignImages.add({
        examId: +this.exam!.id!,
        pageNumber: e,
        value: JSON.stringify(
          {
            pages: alignPages64.get(e)!,
          },
          this.replacer
        ),
      });
    }
    for (const e of nonalignPages64.keys()) {
      await db.nonAlignImages.add({
        examId: +this.exam!.id!,
        pageNumber: e,
        value: JSON.stringify(
          {
            pages: nonalignPages64.get(e)!,
          },
          this.replacer
        ),
      });
    }
    this.finalize();
    this.blocked = false;
  }

  public exportAsImage(): void {
    const scale = { scale: 2 };
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    for (let page = this.sheet!.pagemin! + 1; page <= this.sheet!.pagemax! + 1; page++) {
      this.pdfService.getPageAsImage(page, scale).then(dataURL => {
        this.aligneImages(dataURL, page, (p: IPage) => {
          if (p.page === this.sheet!.pagemax! + 1) {
            this.saveData();
          }
        });
      });
    }
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

        const napage = {
          image: inputimage1,
          page: pagen,
          width: i.width!,
          height: i.height,
        };
        this.nonalignPages.set(pagen, napage);
        if (this.alignement !== 'off') {
          let paget = pagen % this.nbreFeuilleParCopie!;
          if (paget === 0) {
            paget = this.nbreFeuilleParCopie!;
          }
          this.alignImagesService
            .imageAlignement({
              imageA: this.templatePages.get(paget)?.image,
              imageB: inputimage1,
              marker: this.alignement === 'marker',
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
    this.exportAsImage();
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
  getEmail(): string {
    if (this.selectionStudents !== undefined && this.exam !== undefined && this.questions !== undefined) {
      const firsName = this.selectionStudents![0].firstname!;
      const lastName = this.selectionStudents![0].name!;
      const examName = this.exam!.name!;
      const questionNumero = this.questions![0].numero!;
      const url = window.location.href;
      const t = `Bonjour,%0D%0A
je m'appelle ${firsName} ${lastName},%0D%0A
J'ai passé l'examen ${examName}. En regardant le corrigé de la question ${questionNumero} accessible ici (${url}), je ne comprends pas mon erreur.%0D%0A
%0D%0A%0D%0A
///EXPLIQUER VOTRE PROBLEME///%0D%0A
%0D%0A%0D%0A
Merci par avance pour le temps pris pour répondre à cet email.%0D%0A
Cordialement,%0D%0A
${firsName}
`;

      return "mailto:?subject=Retour sur l'examen " + this.exam!.name + '&body=' + t;
    } else {
      return '';
    }
  }
}
