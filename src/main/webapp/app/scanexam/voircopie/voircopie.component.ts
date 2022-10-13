/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */

// http://localhost:9000/copie/d6680b56-36a5-4488-ac5b-c862096bc311/1

import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewInit, HostListener } from '@angular/core';
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
import { FinalResultService } from '../../entities/final-result/service/final-result.service';
import { IExamSheet } from '../../entities/exam-sheet/exam-sheet.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { HttpClient } from '@angular/common/http';
import { CacheUploadService } from '../exam-detail/cacheUpload.service';
import { TranslateService } from '@ngx-translate/core';

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
  exam: IExam | undefined;
  currentStudent = 0;
  selectionStudents: IStudent[] | undefined;
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
  resolve: any;
  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;
  currentZoneVoirCopieHandler: ZoneVoirCopieHandler | undefined;
  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,

    public examService: ExamService,
    public zoneService: ZoneService,
    public studentService: StudentService,
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
                  this.populateBestSolutions();

                  // Step 1 Query templates

                  this.nbreFeuilleParCopie = this.sheet!.pagemax! - this.sheet!.pagemin! + 1;
                  // Step 2 Query Scan in local DB
                  this.finalize();
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
              if (this.questions![0].gradeType === GradeType.DIRECT && this.questions![0].typeAlgoName !== 'QCM') {
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
      if (comment.description?.startsWith('correct')) {
        return { 'background-color': '#7EED92' };
      } else if (comment.description?.startsWith('incorrect')) {
        return { 'background-color': '#FF6961' };
      } else {
        return { 'background-color': '#DCDCDC' };
      }
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
  getEmail(): string {
    if (this.selectionStudents !== undefined && this.exam !== undefined && this.questions !== undefined) {
      const firsName = this.selectionStudents![0].firstname!;
      const lastName = this.selectionStudents![0].name!;
      const examName = this.exam!.name!;
      const questionNumero = this.questions![0].numero!;
      const url = window.location.href;
      const ten = `Dear Prof,%0D%0A
My name is ${firsName} ${lastName},%0D%0A
I have the exam ${examName}. Looking at the answer key for this question ${questionNumero} available here (${url}), I could not understand my mistake.%0D%0A
%0D%0A%0D%0A
///EXPLAIN YOUR PROBLEM///%0D%0A
%0D%0A%0D%0A
Thank you in advance for the time taken to answer this email.%0D%0A
Best regards,%0D%0A
${firsName}
`;
      const tfr = `Bonjour,%0D%0A
je m'appelle ${firsName} ${lastName},%0D%0A
J'ai passé l'examen ${examName}. En regardant le corrigé de la question ${questionNumero} accessible ici (${url}), je ne comprends pas mon erreur.%0D%0A
%0D%0A%0D%0A
///EXPLIQUER VOTRE PROBLEME///%0D%0A
%0D%0A%0D%0A
Merci par avance pour le temps pris pour répondre à cet email.%0D%0A
Cordialement,%0D%0A
${firsName}
`;

      if (this.translateService.currentLang === 'fr') {
        return "mailto:?subject=Retour sur l'examen " + this.exam!.name + '&body=' + tfr;
      } else {
        return 'mailto:?subject=Feedback on your ewam ' + this.exam!.name + '&body=' + ten;
      }
    } else {
      return '';
    }
  }

  bestSolutions: string[] = [];

  populateBestSolutions(): void {
    this.http
      .get<string[]>(this.applicationConfigService.getEndpointFor('api/getBestAnswer/' + this.exam?.id + '/' + (this.questionno + 1)))
      .subscribe(s => {
        const result: string[] = [];
        s.forEach(s1 => {
          result.push('/reponse/' + btoa('/' + s1 + '/' + (this.questionno + 1) + '/'));
        });
        this.bestSolutions = result;
      });
  }
}
