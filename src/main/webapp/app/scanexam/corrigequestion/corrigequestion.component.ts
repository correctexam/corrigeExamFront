/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'app/entities/course/service/course.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlignImagesService } from '../services/align-images.service';
import { db } from '../db/db';
import { IExam } from '../../entities/exam/exam.model';
import { ICourse } from 'app/entities/course/course.model';
import { IStudent } from '../../entities/student/student.model';
import { ImageZone, IPage } from '../associer-copies-etudiants/associer-copies-etudiants.component';
import { IZone } from 'app/entities/zone/zone.model';
import { QuestionService } from '../../entities/question/service/question.service';
import { IQuestion } from '../../entities/question/question.model';
import { IStudentResponse, StudentResponse } from '../../entities/student-response/student-response.model';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';
import { EventCanevascorrectionHandlerService } from './event-canevascorrection-handler.service';
import { ZoneCorrectionHandler } from './ZoneCorrectionHandler';
import { GradeType } from '../../entities/enumerations/grade-type.model';
import { ITextComment } from '../../entities/text-comment/text-comment.model';
import { IGradedComment } from '../../entities/graded-comment/graded-comment.model';
import { GradedCommentService } from '../../entities/graded-comment/service/graded-comment.service';
import { TextCommentService } from 'app/entities/text-comment/service/text-comment.service';

@Component({
  selector: 'jhi-corrigequestion',
  templateUrl: './corrigequestion.component.html',
  styleUrls: ['./corrigequestion.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CorrigequestionComponent implements OnInit, AfterViewInit {
  @ViewChildren('nomImage')
  canvass!: QueryList<ElementRef>;
  showImage: boolean[] = [];
  examId: string | undefined;
  nbreFeuilleParCopie: number | undefined;
  numberPagesInScan: number | undefined;
  exam: IExam | undefined;
  course: ICourse | undefined;
  students: IStudent[] | undefined;
  currentStudent = 0;
  selectionStudents: IStudent[] | undefined;
  numberofzone: number | undefined = 0;
  studentid: number | undefined;
  questions: IQuestion[] | undefined;
  blocked = true;
  nbreQuestions = 1;
  currentNote = 0;
  noteSteps = 0;
  maxNote = 0;
  questionStep = 0;
  questionno = 0;
  resp: IStudentResponse | undefined;
  titreCommentaire = '';
  descCommentaire = '';
  noteCommentaire = 0;
  currentQuestion: IQuestion | undefined;

  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;

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
    public sheetService: ExamSheetService,
    public questionService: QuestionService,
    public gradedCommentService: GradedCommentService,
    public textCommentService: TextCommentService,
    public studentResponseService: StudentResponseService,
    private changeDetector: ChangeDetectorRef,
    private eventHandler: EventCanevascorrectionHandlerService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.currentNote = 0;
      this.noteSteps = 0;
      this.maxNote = 0;
      this.resp = undefined;
      //      'answer/:examid/:questionno/:studentid',
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        if (params.get('questionno') !== null) {
          this.questionno = +params.get('questionno')! - 1;
        }
        if (params.get('studentid') !== null) {
          this.studentid = +params.get('studentid')!;
          this.currentStudent = this.studentid - 1;
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
                .equals(+this.examId!)
                .count()
                .then(e1 => {
                  this.numberPagesInScan = e1;
                  this.examService.find(+this.examId!).subscribe(data => {
                    this.exam = data.body!;
                    this.courseService.find(this.exam.courseId!).subscribe(e => (this.course = e.body!));
                    // Step 3 Query Students for Exam

                    this.refreshStudentList().then(() => {
                      // Step 4 Query zone 4 questions
                      this.blocked = false;
                      this.questionService.query({ examId: this.exam?.id }).subscribe(b =>
                        b.body!.forEach(q => {
                          if (q.numero! > this.nbreQuestions) {
                            this.nbreQuestions = q.numero!;
                          }
                        })
                      );
                      this.questionService.query({ examId: this.exam?.id, numero: this.questionno + 1 }).subscribe(q1 => {
                        this.questions = q1.body!;

                        if (this.questions.length > 0) {
                          this.noteSteps = this.questions[0].point! * this.questions[0].step!;
                          this.questionStep = this.questions[0].step!;
                          this.maxNote = this.questions[0].point!;
                          this.currentQuestion = this.questions[0];

                          if (this.resp === undefined) {
                            this.resp = new StudentResponse(undefined, this.currentNote);
                            this.resp.note = this.currentNote;
                            this.resp.questionId = this.questions![0].id;
                            const sheets = (this.selectionStudents?.map(st => st.examSheets) as any)
                              .flat()
                              .filter(
                                (ex: any) =>
                                  ex?.scanId === this.exam!.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie!
                              );
                            if (sheets !== undefined && sheets!.length > 0) {
                              this.resp.sheetId = sheets[0]?.id;
                            }
                            this.studentResponseService
                              .query({
                                sheetId: this.resp.sheetId,
                                questionId: this.resp.questionId,
                              })
                              .subscribe(sr => {
                                if (sr.body !== null && sr.body.length > 0) {
                                  this.resp = sr.body![0];
                                  this.currentNote = this.resp.note!;
                                  if (this.questions![0].gradeType === GradeType.DIRECT) {
                                    this.textCommentService.query({ questionId: this.questions![0].id }).subscribe(com => {
                                      this.resp?.textcomments!.forEach(com1 => {
                                        const elt = com.body!.find(com2 => com2.id === com1.id);
                                        if (elt !== undefined) {
                                          (elt as any).checked = true;
                                        }
                                      });
                                      this.currentTextComment4Question = com.body!;
                                    });
                                  } else {
                                    this.gradedCommentService.query({ questionId: this.questions![0].id }).subscribe(com => {
                                      this.resp?.gradedcomments!.forEach(com1 => {
                                        const elt = com.body!.find(com2 => com2.id === com1.id);
                                        if (elt !== undefined) {
                                          (elt as any).checked = true;
                                        }
                                      });
                                      this.currentGradedComment4Question = com.body!;
                                    });
                                  }
                                } else {
                                  this.studentResponseService.create(this.resp!).subscribe(sr1 => {
                                    this.resp = sr1.body!;
                                    if (this.questions![0].gradeType === GradeType.DIRECT) {
                                      this.textCommentService.query({ questionId: this.questions![0].id }).subscribe(com => {
                                        this.currentTextComment4Question = com.body!;
                                      });
                                    } else {
                                      this.gradedCommentService.query({ questionId: this.questions![0].id }).subscribe(com => {
                                        this.currentGradedComment4Question = com.body!;
                                      });
                                    }
                                  });
                                }
                              });
                          }
                        }
                        this.showImage = new Array<boolean>(this.questions.length);
                      });
                    });
                  });
                });
            });
        } else {
          const c = this.currentStudent + 1;
          this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionno + 1) + '/' + c);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.canvass.changes.subscribe(() => {
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
      this.changeDetector.detectChanges();
    });
  }

  changeNote(): void {
    if (this.resp !== undefined) {
      this.resp!.note = this.currentNote;
      this.studentResponseService.update(this.resp!).subscribe(sr1 => (this.resp = sr1.body!));
    }
  }

  checked(comment: ITextComment | IGradedComment): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (comment as any).checked;
  }

  ajouterTComment(comment: ITextComment): void {
    this.resp?.textcomments?.push(comment);
    this.studentResponseService.update(this.resp!).subscribe(() => {
      (comment as any).checked = true;
    });
  }
  ajouterGComment(comment: IGradedComment): void {
    this.resp?.gradedcomments?.push(comment);
    this.studentResponseService.update(this.resp!).subscribe(() => {
      (comment as any).checked = true;
    });
  }
  retirerTComment(comment: ITextComment): void {
    this.resp!.textcomments = this.resp?.textcomments!.filter(e => e.id !== comment.id);
    this.studentResponseService.update(this.resp!).subscribe(() => {
      (comment as any).checked = false;
    });
  }
  retirerGComment(comment: IGradedComment): void {
    this.resp!.gradedcomments = this.resp?.gradedcomments!.filter(e => e.id !== comment.id);
    this.studentResponseService.update(this.resp!).subscribe(() => {
      (comment as any).checked = false;
    });
  }

  addComment() {
    if (this.currentQuestion !== undefined && this.currentQuestion.gradeType === GradeType.DIRECT) {
      const t: ITextComment = {
        questionId: this.currentQuestion.id,
        text: this.titreCommentaire,
        description: this.descCommentaire,
        // studentResponses : [{id: this.resp?.id}]
      };
      this.textCommentService.create(t).subscribe(e => {
        this.resp?.textcomments?.push(e.body!);
        const currentComment = e.body!;
        this.studentResponseService.update(this.resp!).subscribe(() => {
          (currentComment as any).checked = true;
          this.currentTextComment4Question?.push(currentComment);
        });
      });
    } else if (this.currentQuestion !== undefined && this.currentQuestion.gradeType !== GradeType.DIRECT) {
      const t: IGradedComment = {
        questionId: this.currentQuestion.id,
        text: this.titreCommentaire,
        description: this.descCommentaire,
        grade: this.noteCommentaire,
        studentResponses: [{ id: this.resp?.id }],
      };
      this.gradedCommentService.create(t).subscribe(e => {
        console.log(e);
      });
    }
  }

  @HostListener('window:keydown.control.ArrowLeft', ['$event'])
  previousStudent(event: KeyboardEvent) {
    event.preventDefault();
    const c = this.currentStudent;
    if (c > 0) {
      this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionno + 1) + '/' + c);
    }
  }
  @HostListener('window:keydown.control.ArrowRight', ['$event'])
  nextStudent(event: KeyboardEvent) {
    event.preventDefault();
    const c = this.currentStudent + 2;
    console.log(this.numberPagesInScan! / this.nbreFeuilleParCopie!);
    if (c <= this.numberPagesInScan! / this.nbreFeuilleParCopie!) {
      this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionno + 1) + '/' + c);
    }
  }
  @HostListener('window:keydown.shift.ArrowLeft', ['$event'])
  previousQuestion(event: KeyboardEvent): void {
    event.preventDefault();
    const c = this.currentStudent + 1;
    const q = this.questionno;
    if (q > 0) {
      this.router.navigateByUrl('/answer/' + this.examId! + '/' + q + '/' + c);
    }
  }
  @HostListener('window:keydown.shift.ArrowRight', ['$event'])
  nextQuestion(event: KeyboardEvent): void {
    event.preventDefault();
    const c = this.currentStudent + 1;
    const q = this.questionno + 2;
    console.log(this.nbreQuestions);
    if (q <= this.nbreQuestions) {
      this.router.navigateByUrl('/answer/' + this.examId! + '/' + q + '/' + c);
    }
  }

  changeStudent($event: any): void {
    this.currentStudent = $event.page;
    const c = this.currentStudent + 1;
    this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionno + 1) + '/' + c);
  }
  changeQuestion($event: any): void {
    this.questionno = $event.page;
    const c = this.currentStudent + 1;
    this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionno + 1) + '/' + c);
  }

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  gotoUE(): void {
    this.router.navigateByUrl('/exam/' + this.examId!);
  }

  async refreshStudentList(): Promise<void> {
    await new Promise<void>(res =>
      this.studentService.query({ courseId: this.exam!.courseId }).subscribe(studentsbody => {
        this.students = studentsbody.body!;
        const filterStudent = this.students.filter(s =>
          s.examSheets?.some(ex => ex.scanId === this.exam!.scanfileId && ex.pagemin === this.currentStudent * this.nbreFeuilleParCopie!)
        );
        this.selectionStudents = filterStudent;
        res();
      })
    );
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
      const zh = new ZoneCorrectionHandler(
        '' + this.examId + '_' + this.studentid + '_' + this.questionno + '_' + index,
        this.eventHandler,
        this.resp?.id
      );
      zh.updateCanvas(imageRef!.nativeElement);
    }
  }

  async getAllImage4Zone(pageInscan: number, zone: IZone): Promise<ImageZone> {
    return new Promise(resolve => {
      db.alignImages
        .where({ examId: +this.examId!, pageNumber: pageInscan })
        .first()
        .then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);
          this.loadImage(image.pages, pageInscan).then(v => {
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
              .subscribe(res => resolve({ i: res, w: finalW, h: finalH }));
          });
        });
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

  updateComment($event: any, l: IGradedComment | ITextComment, graded: boolean): any {
    if (graded) {
      this.gradedCommentService.update(l).subscribe(() => {});
    } else {
      this.textCommentService.update(l).subscribe(() => {});
    }
  }
  /*
  private addEventListeners(canvas: any) {
    canvas.on('mouse:down', (e: any) => this.ngZone.run(() => this.onCanvasMouseDown(e)));
    canvas.on('mouse:move', (e: any) => this.ngZone.run(() => this.onCanvasMouseMove(e)));
    canvas.on('mouse:up', () => this.ngZone.run(() => this.onCanvasMouseUp()));
    canvas.on('selection:created', (e: any) => this.ngZone.run(() => this.onSelectionCreated(e as any)));
    canvas.on('selection:updated', (e: any) => this.ngZone.run(() => this.onSelectionUpdated(e as any)));
    canvas.on('object:moving', (e: any) => this.ngZone.run(() => this.onObjectMoving(e as any)));
    canvas.on('object:scaling', (e: any) => this.ngZone.run(() => this.onObjectScaling(e as any)));
  }

  private onCanvasMouseDown(event: { e: Event }) {
    this.eventHandler.mouseDown(event.e);
    this.avoidDragAndClickEventsOfOtherUILibs(event.e);
  }
  private onCanvasMouseMove(event: { e: Event }) {
    this.eventHandler.mouseMove(event.e);
  }
  private onCanvasMouseUp() {
    this.eventHandler.mouseUp();
  }
  private onSelectionCreated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
  }
  private onSelectionUpdated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
  }
  private onObjectMoving(e: any) {
    this.eventHandler.objectMoving(e.target.id, e.target.type, e.target.left, e.target.top);
  }
  private onObjectScaling(e: any) {
    this.eventHandler.objectScaling(
      e.target.id,
      e.target.type,
      { x: e.target.scaleX, y: e.target.scaleY },
      { left: e.target.left, top: e.target.top }
    );
  }

  private avoidDragAndClickEventsOfOtherUILibs(e: Event) {
    e.stopPropagation();
  } */
}
