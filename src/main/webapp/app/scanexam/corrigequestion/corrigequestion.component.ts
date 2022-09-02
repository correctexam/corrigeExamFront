/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
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
import { CourseService } from 'app/entities/course/service/course.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlignImagesService, IQCMInput } from '../services/align-images.service';
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-corrigequestion',
  templateUrl: './corrigequestion.component.html',
  styleUrls: ['./corrigequestion.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CorrigequestionComponent implements OnInit, AfterViewInit {
  @ViewChild('qcmcorrect')
  qcmcorrect!: ElementRef;
  @ViewChild('imageQcmDebugs')
  canvassQCM!: ElementRef;
  showImageQCM = false;

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
  noalign = false;
  factor = 1;

  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;

  currentZoneCorrectionHandler: ZoneCorrectionHandler | undefined;

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

  pageOffset = 0;
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
    private eventHandler: EventCanevascorrectionHandlerService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.blocked = true;
      let forceRefreshStudent = false;
      this.currentNote = 0;
      this.noteSteps = 0;
      this.maxNote = 0;
      this.resp = undefined;
      //      'answer/:examid/:questionno/:studentid',
      if (params.get('examid') !== null) {
        if (this.examId !== params.get('examid')! || this.images.length === 0) {
          this.examId = params.get('examid')!;
          this.loadAllPages();
          forceRefreshStudent = true;
        }
        this.examId = params.get('examid')!;
        this.pageOffset = 0;

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

                    this.refreshStudentList(forceRefreshStudent).then(() => {
                      this.getSelectedStudent();
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
                                  this.computeNote(false, this.resp!);
                                  if (this.questions![0].gradeType === GradeType.DIRECT && this.questions![0].typeAlgoName !== 'QCM') {
                                    this.textCommentService.query({ questionId: this.questions![0].id }).subscribe(com => {
                                      this.resp?.textcomments!.forEach(com1 => {
                                        const elt = com.body!.find(com2 => com2.id === com1.id);
                                        if (elt !== undefined) {
                                          (elt as any).checked = true;
                                        }
                                      });
                                      this.currentTextComment4Question = com.body!;
                                      this.blocked = false;
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
                                      this.blocked = false;
                                    });
                                  }
                                } else {
                                  this.studentResponseService.create(this.resp!).subscribe(sr1 => {
                                    this.resp = sr1.body!;
                                    if (this.questions![0].gradeType === GradeType.DIRECT) {
                                      this.textCommentService.query({ questionId: this.questions![0].id }).subscribe(com => {
                                        this.currentTextComment4Question = com.body!;
                                        this.blocked = false;
                                      });
                                    } else {
                                      this.gradedCommentService.query({ questionId: this.questions![0].id }).subscribe(com => {
                                        this.currentGradedComment4Question = com.body!;
                                        this.blocked = false;
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
      this.reloadImage();
      this.changeDetector.detectChanges();
    });
  }

  reloadImageGrowFactor(event: any): void {
    if (event.value !== this.factor) {
      this.factor = event.value;
      this.reloadImage();
    }
  }

  reloadImageOffset(event: any): void {
    if (event.value !== this.pageOffset) {
      this.pageOffset = event.value;
      this.reloadImage();
    }
  }

  reloadImage() {
    this.questions!.forEach((q, i) => {
      this.showImage[i] = false;
      this.loadZone(q.zoneId).then(z => {
        const pagewithoffset = this.currentStudent! * this.nbreFeuilleParCopie! + z!.pageNumber! + this.pageOffset;
        const pagewithoutoffset = this.currentStudent! * this.nbreFeuilleParCopie! + z!.pageNumber!;
        let page = pagewithoutoffset;
        if (pagewithoffset > 0 && pagewithoffset <= this.numberPagesInScan!) {
          page = pagewithoffset;
        }
        if (i === 0) {
          this.activeIndex = page - 1;
        }

        this.getAllImage4Zone(page, z!).then(p => {
          this.displayImage(
            p,
            this.canvass.get(i),
            b => {
              this.showImage[i] = b;
            },
            i,
            true
          );
        });
      });
    });
  }

  workOnQCM() {
    if (this.questions?.length === 1) {
      this.blocked = true;

      this.questions!.forEach(q => {
        // this.showImage[i] = false;
        this.loadZone(q.zoneId).then(z => {
          const promises: Promise<ImageZone>[] = [];
          const t: IQCMInput = {};
          t.pages = [];
          this.getTemplateImage4Zone(z!).then(p => {
            t.imageTemplate = p.i;

            for (let st = 0; st < this.numberPagesInScan! / this.nbreFeuilleParCopie!; st++) {
              const pagewithoffset = st! * this.nbreFeuilleParCopie! + z!.pageNumber! + this.pageOffset;
              const pagewithoutoffset = st * this.nbreFeuilleParCopie! + z!.pageNumber!;
              let page = pagewithoutoffset;
              if (pagewithoffset > 0 && pagewithoffset <= this.numberPagesInScan!) {
                page = pagewithoffset;
              }
              // console.log('page ' + page)
              promises.push(this.getAllImage4Zone(page, z!));
            }

            // t.imageTemplate;
            Promise.all(promises).then(value => {
              value.forEach((value1, index1) => {
                if (index1 === 1) {
                  t.widthZone = value1.w!;
                  t.heightZone = value1.h!;
                }

                t.pages!.push({ imageInput: value1.i, numero: index1 });
              });
              this.alignImagesService.correctQCM(t).subscribe(
                res => {
                  this.blocked = false;
                  res.solutions?.forEach(e => {
                    if (e.solution !== undefined && e.solution !== '') {
                      this.getStudentResponse(this.questions![0].id!, e.numero!).then(resp => {
                        console.log(resp);
                        resp.gradedcomments?.forEach(gc => {
                          (gc as any).checked = false;
                        });
                        resp!.gradedcomments = [];
                        // Check if gradedcomment with good parameters exists

                        const gcs = this.currentGradedComment4Question?.filter(c => c.text === e.solution);
                        let comment: IGradedComment = {
                          questionId: this.questions![0].id,
                          text: e.solution,
                          description: this.questions![0].validExpression!.split('|').includes(e.solution!)
                            ? 'correct ' + this.questions![0].point! + 'pt'
                            : 'incorrect pénalité - ' + ((1 / this.questions![0].step!) * this.questions![0].point!).toFixed(2) + 'pt',
                          grade: this.questions![0].validExpression!.split('|').includes(e.solution!)
                            ? this.questions![0].point
                            : this.questions![0].step,
                          studentResponses: [{ id: resp.id }],
                        };
                        // Comment already exists
                        if (gcs !== undefined && gcs.length > 0) {
                          comment = gcs[0];
                          comment.studentResponses?.push(resp!);
                          resp.gradedcomments.push(comment);
                          this.studentResponseService.update(resp!).subscribe(() => {
                            this.computeNote(true, resp!);
                          });
                        } else {
                          if (this.currentGradedComment4Question !== undefined) {
                            this.currentGradedComment4Question.push(comment);
                          } else {
                            this.currentGradedComment4Question = [comment];
                          }
                          this.gradedCommentService.create(comment).subscribe(e1 => {
                            resp.gradedcomments?.push(e1.body!);
                            // const currentComment = e1.body!;
                            this.studentResponseService.update(resp!).subscribe(() => {
                              if (this.currentStudent === e.numero) {
                                (comment as any).checked = true;
                                this.computeNote(true, resp!);
                              }
                            });
                          });
                        }
                      });
                    }
                  });
                },
                err => {
                  this.blocked = false;
                  this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('scanexam.couldnotcorrectQCM'),
                    detail: this.translateService.instant('scanexam.couldnotcorrectQCMdetails') + ' ' + err.message,
                  });
                }
              );
            });
          });
        });
      });
    } else {
      console.log('no support of QCM on multiple pages');
      // TODO
      this.messageService.add({
        severity: 'warning',
        summary: this.translateService.instant('scanexam.nosupportQMCmultiplepage'),
        detail: this.translateService.instant('scanexam.nosupportQMCmultiplepagedetails'),
      });
    }
  }
  changeNote(): void {
    if (this.resp !== undefined) {
      this.blocked = true;
      // When cancelling the marking, in fact it means marking to 0
      this.currentNote ??= 0;
      this.resp!.note = this.currentNote;
      this.studentResponseService.update(this.resp!).subscribe(sr1 => {
        this.resp = sr1.body!;
        this.blocked = false;
      });
    }
  }

  updateResponse(): void {
    if (this.resp !== undefined) {
      this.studentResponseService.update(this.resp!).subscribe(sr1 => (this.resp = sr1.body!));
    }
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

  ajouterTComment(comment: ITextComment): void {
    this.resp?.textcomments?.push(comment);
    this.studentResponseService.update(this.resp!).subscribe(() => {
      (comment as any).checked = true;
    });
  }
  ajouterGComment(comment: IGradedComment, resp: IStudentResponse): void {
    this.resp?.gradedcomments?.push(comment);
    this.studentResponseService.update(resp).subscribe(() => {
      (comment as any).checked = true;
      this.computeNote(true, this.resp!);
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
      this.computeNote(true, this.resp!);
    });
  }

  computeNote(update: boolean, resp: IStudentResponse): any {
    if (this.currentQuestion?.gradeType === GradeType.POSITIVE && this.currentQuestion.typeAlgoName !== 'QCM') {
      let currentNote = 0;
      resp.gradedcomments?.forEach(g => {
        if (g.grade !== undefined && g.grade !== null) {
          currentNote = currentNote + g.grade;
        }
      });
      if (currentNote > this.noteSteps) {
        currentNote = this.noteSteps;
      }
      this.currentNote = currentNote;
      resp.note = currentNote;
      if (update) {
        this.studentResponseService.partialUpdate(resp).subscribe(() => {});
      }
    } else if (this.currentQuestion?.gradeType === GradeType.NEGATIVE && this.currentQuestion.typeAlgoName !== 'QCM') {
      let currentNote = this.noteSteps;
      resp.gradedcomments?.forEach(g => {
        if (g.grade !== undefined && g.grade !== null) {
          currentNote = currentNote - g.grade;
        }
      });
      if (currentNote < 0) {
        currentNote = 0;
      }
      this.currentNote = currentNote;
      resp.note = currentNote;
      if (update) {
        this.studentResponseService.partialUpdate(resp!).subscribe(() => {});
      }
    } else if (this.currentQuestion?.typeAlgoName === 'QCM') {
      let currentNote = 0;
      resp.gradedcomments?.forEach(g => {
        if (g.description?.startsWith('correct')) {
          currentNote = currentNote + this.questions![0].point! * this.questions![0].step!;
        } else if (g.description?.startsWith('incorrect')) {
          //          currentNote = currentNote -  (Math.round(((1/ this.questions![0].step!) * this.questions![0].point!)*100)/100)
          currentNote = currentNote - this.questions![0].point!;
        }
      });
      if (resp === this.resp) {
        this.currentNote = currentNote;
      }
      resp.note = currentNote;
      if (update) {
        this.studentResponseService.partialUpdate(resp).subscribe(() => {});
      }
    }
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
          this.titreCommentaire = '';
          this.descCommentaire = '';
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
        this.resp?.gradedcomments?.push(e.body!);
        const currentComment = e.body!;
        this.studentResponseService.update(this.resp!).subscribe(() => {
          (currentComment as any).checked = true;
          this.currentGradedComment4Question?.push(currentComment);
          this.computeNote(false, this.resp!);
          this.titreCommentaire = '';
          this.descCommentaire = '';
          this.noteCommentaire = 0;
        });
      });
    }
  }

  @HostListener('window:keydown.control.ArrowLeft', ['$event'])
  previousStudent(event: KeyboardEvent) {
    if (!this.blocked) {
      event.preventDefault();
      const c = this.currentStudent;
      if (c > 0) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionno + 1) + '/' + c);
      }
    }
  }
  @HostListener('window:keydown.control.ArrowRight', ['$event'])
  nextStudent(event: KeyboardEvent) {
    if (!this.blocked) {
      event.preventDefault();
      const c = this.currentStudent + 2;
      if (c <= this.numberPagesInScan! / this.nbreFeuilleParCopie!) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionno + 1) + '/' + c);
      }
    }
  }
  @HostListener('window:keydown.shift.ArrowLeft', ['$event'])
  previousQuestion(event: KeyboardEvent): void {
    if (!this.blocked) {
      event.preventDefault();
      const c = this.currentStudent + 1;
      const q = this.questionno;
      if (q > 0) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + q + '/' + c);
      }
    }
  }
  @HostListener('window:keydown.shift.ArrowRight', ['$event'])
  nextQuestion(event: KeyboardEvent): void {
    if (!this.blocked) {
      event.preventDefault();
      const c = this.currentStudent + 1;
      const q = this.questionno + 2;
      if (q <= this.nbreQuestions) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + q + '/' + c);
      }
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

  async refreshStudentList(force: boolean): Promise<void> {
    await new Promise<void>(res => {
      if (force || this.students === undefined || this.students.length === 0) {
        this.studentService.query({ courseId: this.exam!.courseId }).subscribe(studentsbody => {
          this.students = studentsbody.body!;
          res();
        });
      } else {
        res();
      }
    });
  }

  getSelectedStudent() {
    const filterStudent = this.students!.filter(s =>
      s.examSheets?.some(ex => ex.scanId === this.exam!.scanfileId && ex.pagemin === this.currentStudent * this.nbreFeuilleParCopie!)
    );
    this.selectionStudents = filterStudent;
    if (this.selectionStudents.length === 0) {
      this.translateService.get('scanexam.copienotassociated').subscribe(() => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('scanexam.copienotassociated'),
          detail: this.translateService.instant('scanexam.copienotassociateddetails'),
        });
      });
    }
  }

  async loadZone(
    zoneId: number | undefined
    // showImageRef: (s: boolean) => void,
    // imageRef: ElementRef<any> | undefined,
    // currentStudent: number,
    // index: number
  ): Promise<IZone | undefined> {
    return new Promise<IZone | undefined>(resolve => {
      if (zoneId) {
        this.zoneService.find(zoneId).subscribe(e => {
          resolve(e.body!);
          /*          this.getAllImage4Zone(page, e.body!).then(p => {

            this.displayImage(p, imageRef, showImageRef, index);

          });*/
        });
      } else {
        resolve(undefined);
      }
    });
  }

  displayImage(
    v: ImageZone,
    imageRef: ElementRef<any> | undefined,
    show: (s: boolean) => void,
    index: number,
    updateanotationcanvas: boolean
  ): void {
    if (imageRef !== undefined) {
      imageRef!.nativeElement.width = v.w;
      imageRef!.nativeElement.height = v.h;
      const ctx1 = imageRef!.nativeElement.getContext('2d');
      ctx1.putImageData(v.i, 0, 0);

      //  this.addEventListeners( imageRef!.nativeElement)
      show(true);
      if (updateanotationcanvas) {
        if (this.currentZoneCorrectionHandler === undefined) {
          const zh = new ZoneCorrectionHandler(
            '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionno + '_' + index,
            this.eventHandler,
            this.resp?.id
          );
          zh.updateCanvas(imageRef!.nativeElement);
          this.currentZoneCorrectionHandler = zh;
        } else {
          if (
            this.currentZoneCorrectionHandler.zoneid ===
            '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionno + '_' + index
          ) {
            this.currentZoneCorrectionHandler.updateCanvas(imageRef!.nativeElement);
          } else {
            const zh = new ZoneCorrectionHandler(
              '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionno + '_' + index,
              this.eventHandler,
              this.resp?.id
            );
            zh.updateCanvas(imageRef!.nativeElement);
            this.currentZoneCorrectionHandler = zh;
          }
        }
      }
    }
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

  async getAllImage4Zone(pageInscan: number, zone: IZone): Promise<ImageZone> {
    if (this.noalign) {
      return new Promise(resolve => {
        db.nonAlignImages
          .where({ examId: +this.examId!, pageNumber: pageInscan })
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
          .where({ examId: +this.examId!, pageNumber: pageInscan })
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

  async getStudentResponse(questionId: number, currentStudent: number): Promise<StudentResponse> {
    return new Promise(resolve => {
      const sheets = (this.students?.map(st => st.examSheets) as any)
        .flat()
        .filter((ex: any) => ex?.scanId === this.exam!.scanfileId && ex?.pagemin === currentStudent * this.nbreFeuilleParCopie!);
      let sheetId = undefined;
      if (sheets !== undefined && sheets!.length > 0) {
        sheetId = sheets[0]?.id;
      }
      this.studentResponseService
        .query({
          sheetId: sheetId,
          questionId: questionId,
        })
        .subscribe(sr => {
          if (sr.body !== null && sr.body.length > 0) {
            resolve(sr.body![0]);
          } else {
            const st: IStudentResponse = {};
            st.note = this.currentNote;
            st.questionId = this.questions![0].id;
            if (sheets !== undefined && sheets!.length > 0) {
              st.sheetId = sheets[0]?.id;
            }
            this.studentResponseService.create(st).subscribe(sr1 => {
              resolve(sr1.body!);
            });
          }
        });
    });
  }

  async getTemplateImage4Zone(zone: IZone): Promise<ImageZone> {
    return new Promise(resolve => {
      db.templates
        .where({ examId: +this.examId!, pageNumber: zone.pageNumber })
        .first()
        .then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);
          this.loadImage(image.pages, zone.pageNumber!).then(v => {
            let finalW = (zone.width! * v.width! * this.factor) / 100000;
            let finalH = (zone.height! * v.height! * this.factor) / 100000;
            let initX =
              (zone.xInit! * v.width!) / 100000 - ((zone.width! * v.width! * this.factor) / 100000 - (zone.width! * v.width!) / 100000) / 2;
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

  showGalleria(): void {
    this.displayBasic = true;
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

  changeAlign(): void {
    this.images = [];
    this.loadAllPages();
    this.reloadImage();
  }
  getStudentName(): string | undefined {
    return this.selectionStudents?.map(e1 => e1.firstname + ' ' + e1.name).join(', ');
  }

  computeQCMdebug() {
    if (this.questions?.length === 1) {
      this.blocked = true;

      this.questions!.forEach((q, index) => {
        // this.showImage[i] = false;
        this.loadZone(q.zoneId).then(z => {
          // const promises: Promise<ImageZone>[] = [];
          const t: IQCMInput = {};
          t.pages = [];
          this.getTemplateImage4Zone(z!).then(p => {
            t.imageTemplate = p.i;
            const pagewithoffset = this.currentStudent * this.nbreFeuilleParCopie! + z!.pageNumber! + this.pageOffset;
            const pagewithoutoffset = this.currentStudent * this.nbreFeuilleParCopie! + z!.pageNumber!;
            let page = pagewithoutoffset;
            if (pagewithoffset > 0 && pagewithoffset <= this.numberPagesInScan!) {
              page = pagewithoffset;
            }
            // console.log('page ' + page)
            this.getAllImage4Zone(page, z!).then(value1 => {
              t.widthZone = value1.w!;
              t.heightZone = value1.h!;
              t.pages!.push({ imageInput: value1.i, numero: 1 });
              this.alignImagesService.correctQCM(t).subscribe(res => {
                this.blocked = false;
                res.solutions?.forEach(e => {
                  const v: ImageZone = {
                    i: e.imageSolution!,
                    w: value1.w!,
                    h: value1.h!,
                  };
                  this.displayImage(
                    v,
                    this.canvassQCM,
                    b => {
                      this.showImageQCM = b;
                    },
                    index,
                    false
                  );
                });
              });
            });
          });
        });
      });
    }
  }
  showQCMCorrect(event: any) {
    (this.qcmcorrect as any).toggle(event);
  }
}
