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
  NgZone,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CourseService } from 'app/entities/course/service/course.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlignImagesService, IImageAlignement, IImageAlignementInput, IQCMInput } from '../services/align-images.service';
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
import { IQCMSolution } from '../../qcm';
import { Observable, Subscriber, firstValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { fromWorkerPool } from 'observable-webworker';
import { worker1 } from '../services/workerimport';
import { PreferenceService } from '../preference-page/preference.service';
import { EntityResponseType } from '../../entities/exam-sheet/service/exam-sheet.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { KeyboardShortcutsComponent, ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';
import { IKeyBoardShortCutPreferenceEntry, KeyboardShortcutService } from '../preference-page/keyboardshortcut.service';

@Component({
  selector: 'jhi-corrigequestion',
  templateUrl: './corrigequestion.component.html',
  styleUrls: ['./corrigequestion.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CorrigequestionComponent implements OnInit, AfterViewInit {
  compareGradedComment(comment: IGradedComment) {
    this.zone.run(() => {
      this.router.navigate(['/comparegradedcomment/' + this.examId + '/' + comment.id]);
    });
  }
  compareTextComment(comment: ITextComment) {
    this.zone.run(() => {
      this.router.navigate(['/comparetextcomment/' + this.examId + '/' + comment.id]);
    });
  }
  compareMark(response: IStudentResponse) {
    this.zone.run(() => {
      this.router.navigate(['/comparemark/' + this.examId + '/' + response.id]);
    });
  }
  minimizeComment = false;
  layoutsidebarVisible = false;
  debug = false;
  @ViewChild('qcmcorrect')
  qcmcorrect!: ElementRef;
  @ViewChild('imageQcmDebugs')
  canvassQCM!: ElementRef;
  shortcut = true;
  shortcutvalue = true;
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
  currentNote: number | undefined = 0;
  noteSteps = 0;
  maxNote = 0;
  questionStep = 0;
  questionindex = 0;
  questionNumeros: Array<number> = [];
  resp: IStudentResponse | undefined;
  titreCommentaire = '';
  descCommentaire = '';
  noteCommentaire = 0;
  currentQuestion: IQuestion | undefined;
  noalign = false;
  factor = 1;
  scale = 1;
  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;
  windowWidth = 0;
  currentZoneCorrectionHandler: Map<string, ZoneCorrectionHandler> = new Map(); // | undefined;
  shortcuts: ShortcutInput[] = [];
  shortCut4Comment = false;
  currentKeyBoardShorcut: string | string[] = '';
  commentShortcut: any;
  questionindex4shortcut = 0;
  @ViewChild(KeyboardShortcutsComponent)
  private keyboard: KeyboardShortcutsComponent | undefined;
  @ViewChild('input') input: ElementRef | undefined;
  testdisableAndEnableKeyBoardShortCut = false;
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
    private translateService: TranslateService,
    private preferenceService: PreferenceService,
    private db: CacheServiceImpl,
    private zone: NgZone,
    private keyboardShortcutService: KeyboardShortcutService
  ) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.shortcut = this.preferenceService.showKeyboardShortcuts();
    this.shortcutvalue = this.preferenceService.showKeyboardShortcuts();
    this.minimizeComment = this.preferenceService.minimizeComments();

    this.activatedRoute.paramMap.subscribe(params => {
      this.manageParam(params);
    });
  }

  async manageParam(params: ParamMap) {
    this.testdisableAndEnableKeyBoardShortCut = false;

    this.blocked = true;
    let forceRefreshStudent = false;
    this.currentNote = 0;
    this.noteSteps = 0;
    this.maxNote = 0;
    this.resp = undefined;
    //      'answer/:examid/:questionno/:studentid',
    if (params.get('examid') !== null) {
      this.examId = params.get('examid')!;
      if (this.images.length === 0) {
        this.examId = params.get('examid')!;
        forceRefreshStudent = true;
      } else {
        /* const changeStudent = params.get('studentid') !== null && this.studentid !== +params.get('studentid')!;
        this.db.countNonAlignImage(+this.examId!).then(page => {
          if (page > 30 && changeStudent) {
            //              this.loadAllPages();
          }
        }); */
      }
      if (params.get('questionno') !== null) {
        this.questionindex4shortcut = +params.get('questionno')! - 1;
      }

      this.pageOffset = 0;

      if (params.get('studentid') !== null) {
        this.studentid = +params.get('studentid')!;
        this.currentStudent = this.studentid - 1;
        // Step 1 Query templates
        this.nbreFeuilleParCopie = await this.db.countPageTemplate(+this.examId);
        // Step 2 Query Scan in local DB

        this.numberPagesInScan = await this.db.countAlignImage(+this.examId!);
        const data = await firstValueFrom(this.examService.find(+this.examId!));
        this.exam = data.body!;
        const e = await firstValueFrom(this.courseService.find(this.exam.courseId!));
        this.course = e.body!;
        // Step 3 Query Students for Exam

        await this.refreshStudentList(forceRefreshStudent);
        this.getSelectedStudent();
        // Step 4 Query zone 4 questions
        const b = await firstValueFrom(this.questionService.query({ examId: this.exam.id }));
        this.questionNumeros = Array.from(new Set(b.body!.map(q => q.numero!))).sort((n1, n2) => n1 - n2);
        this.nbreQuestions = this.questionNumeros.length;

        // must be done here as the change of the nbreQuestions triggers the event of change question with page = 0
        if (params.get('questionno') !== null) {
          this.questionindex = +params.get('questionno')! - 1;
        }

        const q1 = await firstValueFrom(
          this.questionService.query({ examId: this.exam.id, numero: this.questionNumeros[this.questionindex!] })
        );

        this.questions = q1.body!;

        if (this.questions.length > 0) {
          this.noteSteps = this.questions[0].point! * this.questions[0].step!;
          this.questionStep = this.questions[0].step!;
          this.maxNote = this.questions[0].point!;
          this.currentQuestion = this.questions[0];
          this.resp = new StudentResponse(undefined, this.currentNote);
          this.resp.note = this.currentNote;
          this.resp.questionId = this.questions![0].id;
          const sheets = (this.selectionStudents?.map(st => st.examSheets) as any)
            .flat()
            .filter((ex: any) => ex?.scanId === this.exam!.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie!);
          if (sheets !== undefined && sheets!.length > 0) {
            this.resp.sheetId = sheets[0]?.id;
          }

          const sr = await firstValueFrom(
            this.studentResponseService.query({
              sheetId: this.resp.sheetId,
              questionId: this.resp.questionId,
            })
          );
          if (sr.body !== null && sr.body.length > 0) {
            this.resp = sr.body![0];

            this.currentNote = this.resp.note!;
            await this.computeNote(false, this.resp!, this.currentQuestion!);
            if (this.questions![0].gradeType === GradeType.DIRECT && this.questions![0].typeAlgoName !== 'QCM') {
              const com = await firstValueFrom(this.textCommentService.query({ questionId: this.questions![0].id }));
              this.resp.textcomments!.forEach(com1 => {
                const elt = com.body!.find(com2 => com2.id === com1.id);
                if (elt !== undefined) {
                  (elt as any).checked = true;
                }
              });
              this.currentTextComment4Question = com.body!;
              this.blocked = false;
            } else {
              const com = await firstValueFrom(this.gradedCommentService.query({ questionId: this.questions![0].id }));
              this.resp.gradedcomments!.forEach(com1 => {
                const elt = com.body!.find(com2 => com2.id === com1.id);
                if (elt !== undefined) {
                  (elt as any).checked = true;
                }
              });
              this.currentGradedComment4Question = com.body!;
              this.blocked = false;
            }
          } else {
            //            this.studentResponseService.create(this.resp!).subscribe(sr1 => {
            //                                      this.resp = sr1.body!;
            if (this.questions![0].gradeType === GradeType.DIRECT) {
              const com = await firstValueFrom(this.textCommentService.query({ questionId: this.questions![0].id }));
              this.currentTextComment4Question = com.body!;
              this.blocked = false;
            } else {
              const com = await firstValueFrom(this.gradedCommentService.query({ questionId: this.questions![0].id }));
              this.currentGradedComment4Question = com.body!;
              this.blocked = false;
            }
          }
        }
        this.showImage = new Array<boolean>(this.questions.length);
      } else {
        const c = this.currentStudent + 1;
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionindex! + 1) + '/' + c);
      }
      this.testdisableAndEnableKeyBoardShortCut = true;
    }
  }

  ngAfterViewInit(): void {
    this.canvass.changes.subscribe(() => {
      this.reloadImage();
      this.changeDetector.detectChanges();
    });

    this.shortcuts.push(
      {
        // ArrowRight
        key: ['ctrl + right', 'meta + right'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.nextstudent'),
        command: () => this.nextStudent(),
        preventDefault: true,
      },
      {
        // ArrowLeft
        key: ['ctrl + left', 'meta + left'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.previousstudent'),
        command: () => this.previousStudent(),
        preventDefault: true,
      },

      {
        // ArrowRight
        key: ['ctrl + up', 'meta + up'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.previousquestion'),
        command: () => this.previousQuestion(),
        preventDefault: true,
      },
      {
        // ArrowLeft
        key: ['ctrl + down', 'meta + down'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.nextquestion'),
        command: () => this.nextQuestion(),
        preventDefault: true,
      },

      {
        // ArrowLeft
        key: [
          'shift + 1',
          '1',
          'shift + 2',
          '2',
          'shift + 3',
          '3',
          'shift + 4',
          '4',
          'shift + 5',
          '5',
          'shift + 6',
          '6',
          'shift + 7',
          '7',
          'shift + 8',
          '8',
          'shift + 9',
          '9',
          'shift + 0',
          '0',
        ],
        label: this.translateService.instant('scanexam.directevaluation'),
        description: this.translateService.instant('scanexam.directgradding'),
        command: (output: ShortcutEventOutput) => this.changeNote1(output),
        preventDefault: true,
      }
    );
  }

  bindKeyBoardShortCut(comment: any) {
    this.shortCut4Comment = true;
    this.commentShortcut = comment;
    if (this.keyboardShortcutService.getShortCutPreference().shortcuts.has(this.examId! + '_' + this.questionindex)) {
      const res: IKeyBoardShortCutPreferenceEntry[] = this.keyboardShortcutService
        .getShortCutPreference()
        .shortcuts.get(this.examId! + '_' + this.questionindex)!
        .filter(shortcut => shortcut.commentId === comment.id);
      if (res.length > 0) {
        this.currentKeyBoardShorcut = res[0].key;
      }
    }
  }

  resetAllShortCut() {
    this.testdisableAndEnableKeyBoardShortCut = false;
    this.shortCut4Comment = false;
    this.keyboardShortcutService.clearToDefault();
    setTimeout(() => {
      (this.testdisableAndEnableKeyBoardShortCut = true), 300;
    });
  }

  saveShortCut() {
    this.testdisableAndEnableKeyBoardShortCut = false;

    this.shortCut4Comment = false;
    const shorts = this.keyboardShortcutService.getShortCutPreference();
    if (shorts.shortcuts.has(this.examId! + '_' + this.questionindex)) {
      const res: IKeyBoardShortCutPreferenceEntry[] = shorts.shortcuts
        .get(this.examId! + '_' + this.questionindex)!
        .filter(shortcut => shortcut.commentId === this.commentShortcut.id);
      if (res.length > 0) {
        res[0].key = this.currentKeyBoardShorcut;
        res[0].description = this.commentShortcut.text;
      } else {
        shorts.shortcuts.get(this.examId! + '_' + this.questionindex)!.push({
          key: this.currentKeyBoardShorcut,
          label: this.translateService.instant('gradeScopeIsticApp.comments.detail.title'),
          commentId: this.commentShortcut.id,
          questionId: this.resp!.questionId!,
          questionIndex: this.questionindex,
          textComment:
            this.currentQuestion !== undefined &&
            this.currentQuestion.gradeType === GradeType.DIRECT &&
            this.currentQuestion.typeAlgoName !== 'QCM',
          examId: +this.examId!,
          description: this.commentShortcut.text,
        });
      }
    } else {
      shorts.shortcuts.set(this.examId! + '_' + this.questionindex, [
        {
          key: this.currentKeyBoardShorcut,
          label: this.translateService.instant('gradeScopeIsticApp.comments.detail.title'),
          commentId: this.commentShortcut.id,
          examId: +this.examId!,
          questionId: this.resp!.questionId!,
          questionIndex: this.questionindex,
          textComment:
            this.currentQuestion !== undefined &&
            this.currentQuestion.gradeType === GradeType.DIRECT &&
            this.currentQuestion.typeAlgoName !== 'QCM',

          description: this.commentShortcut.text,
        },
      ]);
    }
    this.keyboardShortcutService.save(shorts);
    this.commentShortcut = null;
    this.currentKeyBoardShorcut = '';
    setTimeout(() => {
      (this.testdisableAndEnableKeyBoardShortCut = true), 300;
    });
  }

  cleanShortCut() {
    this.commentShortcut = null;
    this.currentKeyBoardShorcut = '';
    this.testdisableAndEnableKeyBoardShortCut = true;
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
          if (this.numberPagesInScan! > 30) {
            this.activeIndex = (page - 1) % this.nbreFeuilleParCopie!;
          } else {
            this.activeIndex = page - 1;
          }
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
  cleanAllCorrection(q: IQuestion): Observable<HttpResponse<IQuestion>> {
    return this.questionService.cleanAllCorrectionAndComment(q);
  }
  workOnQCM() {
    if (this.questions?.length === 1) {
      this.blocked = true;

      this.questions!.forEach(q => {
        // this.showImage[i] = false;
        this.currentGradedComment4Question = [];
        this.currentTextComment4Question = [];

        this.cleanAllCorrection(q).subscribe(() => {
          q.gradedcomments = [];
          q.textcomments = [];

          this.loadZone(q.zoneId).then(z => {
            const promises: Promise<ImageZone>[] = [];
            const t: IQCMInput = {
              preference: this.preferenceService.getPreference(),
            };
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
                    this.processSolutions(res.solutions).then(() => {
                      const qid = this.questions![0].id;
                      let sid = '';
                      const sheets = (this.selectionStudents?.map(st => st.examSheets) as any)
                        .flat()
                        .filter(
                          (ex: any) =>
                            ex?.scanId === this.exam!.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie!
                        );
                      if (sheets !== undefined && sheets!.length > 0) {
                        sid = sheets[0]?.id;
                      }
                      this.studentResponseService
                        .query({
                          sheetId: sid,
                          questionId: qid,
                        })
                        .subscribe(sr => {
                          if (sr.body !== null && sr.body.length > 0) {
                            this.resp = sr.body![0];
                            this.computeNote(false, this.resp, this.currentQuestion!);
                            this.blocked = false;
                          } else {
                            this.blocked = false;
                          }
                        });
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

  async processSolutions(solutions: IQCMSolution[] | undefined) {
    // Create list of gradedComments
    const validExp = this.currentQuestion?.validExpression!.split('|');
    let validToCreate: string[] = [];
    const invalidExp = solutions!.map(s => s.solution!);
    let invalidToCreate: string[] = [];
    if (this.currentGradedComment4Question === undefined) {
      this.currentGradedComment4Question = [];
    }
    validToCreate = validExp!.filter(c => !this.currentGradedComment4Question?.map(v => v.text).includes(c));
    invalidToCreate = invalidExp!.filter(
      c => !this.currentGradedComment4Question?.map(v => v.text).includes(c) && !validExp!.includes(c!) && c !== ''
    );
    invalidToCreate = [...new Set(invalidToCreate)];

    for (const gcv of validToCreate) {
      const comment: IGradedComment = {
        questionId: this.questions![0].id,
        text: gcv,
        description: 'correct ' + this.questions![0].point! + 'pt',
        grade: this.questions![0].point,
        studentResponses: [],
      };
      const c1 = await this.createGradedComment(comment);
      this.currentGradedComment4Question!.push(c1);
    }
    for (const gcv of invalidToCreate) {
      const comment: IGradedComment = {
        questionId: this.questions![0].id,
        text: gcv,
        description:
          this.questions![0].step! > 0
            ? 'incorrect pénalité ' + ' - ' + ((1 / this.questions![0].step!) * this.questions![0].point!).toFixed(2) + 'pt'
            : 'incorrect pénalité ' + '0 pt',
        grade: this.questions![0].step,
        studentResponses: [],
      };
      const c1 = await this.createGradedComment(comment);
      this.currentGradedComment4Question!.push(c1);
    }
    // UpdateStudentResponse
    for (const solution of solutions!) {
      await this.processAnswer(solution);
    }
  }

  async processAnswer(e: IQCMSolution) {
    if (e.solution !== undefined /* && e.solution !== '' */) {
      const resp = await this.getStudentResponse(this.questions![0].id!, e.numero!);

      resp.gradedcomments?.forEach(gc => {
        (gc as any).checked = false;
      });
      resp!.gradedcomments = [];
      // Check if gradedcomment with good parameters exists

      const gcs = this.currentGradedComment4Question?.filter(c => c.text === e.solution);
      // Comment already exists
      if (gcs !== undefined && gcs.length > 0) {
        resp.gradedcomments.push(gcs[0]);
        await this.updateStudentResponsAndComputeNote4QCM(resp, e.numero!, gcs[0]);
        // gcs[0].studentResponses?.push(resp!);
      }
    }
  }

  createGradedComment(comment: IGradedComment): Promise<IGradedComment> {
    return new Promise<IStudentResponse>((resolve, reject) => {
      this.gradedCommentService.create(comment).subscribe(e1 => {
        if (e1.body !== null) {
          resolve(e1.body!);
        } else {
          reject(null);
        }
      });
    });
  }

  updateStudentResponsAndComputeNote4QCM(resp: IStudentResponse, numero: number, comment: IGradedComment): Promise<IStudentResponse> {
    return new Promise<IStudentResponse>(resolve => {
      this.updateResponseRequest(resp).subscribe(resp1 => {
        if (this.currentStudent === numero) {
          (comment as any).checked = true;
        }
        this.computeNote(true, resp1.body!, this.currentQuestion!).then(value => {
          resolve(value);
        });
      });
    });
  }

  changeNote(): void {
    if (this.resp !== undefined && !this.blocked) {
      this.blocked = true;
      // When cancelling the marking, in fact it means marking to 0
      this.currentNote ??= 0;
      this.resp!.note = this.currentNote;
      this.updateResponseRequest(this.resp!).subscribe(sr1 => {
        this.resp = sr1.body!;
        this.blocked = false;
      });
    }
  }

  isTextInput(ele: any): boolean {
    const tagName = ele.tagName;
    if (tagName === 'INPUT') {
      const validType = [
        'text',
        'password',
        'number',
        'email',
        'tel',
        'url',
        'search',
        'date',
        'datetime',
        'datetime-local',
        'time',
        'month',
        'week',
      ];
      const eleType = ele.type;
      return validType.includes(eleType);
    } else if (tagName === 'TEXTAREA') {
      return true;
    }
    return false;
  }

  changeNote1(e: ShortcutEventOutput): void {
    if (
      this.currentQuestion !== undefined &&
      !(this.currentQuestion.gradeType !== 'DIRECT' || this.currentQuestion.typeAlgoName === 'QCM') &&
      !this.isTextInput(e.event.target) &&
      this.resp !== undefined &&
      this.noteSteps >= +e.event.key
    ) {
      this.currentNote = +e.event.key;
      this.changeNote();
    }
  }

  updateResponseRequest(studentResp: IStudentResponse): Observable<EntityResponseType> {
    if (studentResp.id !== undefined) {
      return this.studentResponseService.update(studentResp); // .subscribe(sr1 => (this.resp = sr1.body!));
    } else {
      return this.studentResponseService.create(studentResp); // .subscribe(sr1 => (this.resp = sr1.body!));
    }
  }

  updateResponse(): void {
    this.blocked = true;
    if (this.resp !== undefined) {
      this.updateResponseRequest(this.resp).subscribe(sr1 => {
        this.blocked = false;
        this.resp = sr1.body!;
      });
    }
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

  async ajouterTComment(comment: ITextComment) {
    if (!this.blocked) {
      this.blocked = true;
      if (!this.resp!.id) {
        const ret = await this.updateResponseRequest(this.resp!).toPromise();
        this.resp = ret!.body!;
      }

      this.resp?.textcomments?.push(comment);
      this.updateResponseRequest(this.resp!).subscribe(resp1 => {
        this.resp = resp1.body!;
        (comment as any).checked = true;
        this.blocked = false;
      });
    }
  }
  async ajouterGComment(comment: IGradedComment) {
    if (!this.blocked) {
      this.blocked = true;
      if (!this.resp!.id) {
        const ret = await this.updateResponseRequest(this.resp!).toPromise();
        this.resp = ret!.body!;
      }
      this.resp?.gradedcomments?.push(comment);
      this.updateResponseRequest(this.resp!).subscribe(resp1 => {
        this.resp = resp1.body!;
        (comment as any).checked = true;
        this.computeNote(true, this.resp!, this.currentQuestion!).then(() => (this.blocked = false));
      });
    }
  }
  async retirerTComment(comment: ITextComment) {
    if (!this.blocked) {
      this.blocked = true;
      if (!this.resp!.id) {
        const ret = await this.updateResponseRequest(this.resp!).toPromise();
        this.resp = ret!.body!;
      }

      this.resp!.textcomments = this.resp?.textcomments!.filter(e => e.id !== comment.id);
      this.blocked = true;
      this.updateResponseRequest(this.resp!).subscribe(resp1 => {
        this.resp = resp1.body!;
        this.blocked = false;
        (comment as any).checked = false;
      });
    }
  }

  toggleTCommentById(commentId: any) {
    const res = this.currentTextComment4Question?.filter(c => c.id === commentId);
    if (res !== undefined && res.length > 0) {
      this.toggleTComment(res[0]);
    }
  }
  toggleGCommentById(commentId: any) {
    const res = this.currentGradedComment4Question?.filter(c => c.id === commentId);
    if (res !== undefined && res.length > 0) {
      this.toggleGComment(res[0]);
    }
  }

  toggleGComment(comment: IGradedComment) {
    if (!this.checked(comment)) {
      this.ajouterGComment(comment);
    } else {
      this.retirerGComment(comment);
    }
  }
  toggleTComment(comment: ITextComment) {
    if (!this.checked(comment)) {
      this.ajouterTComment(comment);
    } else {
      this.retirerTComment(comment);
    }
  }

  async retirerGComment(comment: IGradedComment) {
    if (!this.blocked) {
      this.blocked = true;
      if (!this.resp!.id) {
        const ret = await this.updateResponseRequest(this.resp!).toPromise();
        this.resp = ret!.body!;
      }
      this.resp!.gradedcomments = this.resp?.gradedcomments!.filter(e => e.id !== comment.id);
      this.blocked = true;
      this.updateResponseRequest(this.resp!).subscribe(resp1 => {
        this.resp = resp1.body!;

        (comment as any).checked = false;
        this.computeNote(true, this.resp!, this.currentQuestion!).then(() => (this.blocked = false));
      });
    }
  }

  computeNote(update: boolean, resp: IStudentResponse, currentQ: IQuestion): Promise<IStudentResponse> {
    return new Promise<IStudentResponse>((resolve, reject) => {
      if (currentQ.gradeType === GradeType.POSITIVE && currentQ.typeAlgoName !== 'QCM') {
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
          this.studentResponseService.partialUpdate(resp).subscribe(b => {
            if (b.body !== null) {
              resolve(b.body);
            } else {
              reject(null);
            }
          });
        } else {
          resolve(resp);
        }
      } else if (currentQ.gradeType === GradeType.NEGATIVE && currentQ.typeAlgoName !== 'QCM') {
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
          this.studentResponseService.partialUpdate(resp!).subscribe(b => {
            if (b.body !== null) {
              resolve(b.body);
            } else {
              reject(null);
            }
          });
        } else {
          resolve(resp);
        }
      } else if (currentQ.typeAlgoName === 'QCM' && currentQ.step! > 0) {
        let currentNote = 0;
        resp.gradedcomments?.forEach(g => {
          if (g.description?.startsWith('correct')) {
            currentNote = currentNote + currentQ.point! * currentQ.step!;
          } else if (g.description?.startsWith('incorrect')) {
            currentNote = currentNote - currentQ.point!;
          }
        });
        if (resp === this.resp) {
          this.currentNote = currentNote;
        }
        resp.note = currentNote;
        if (update) {
          this.studentResponseService.partialUpdate(resp).subscribe(b => {
            if (b.body !== null) {
              resolve(b.body);
            } else {
              reject(null);
            }
          });
        } else {
          resolve(resp);
        }
      } else if (currentQ.typeAlgoName === 'QCM' && currentQ.step! <= 0) {
        let currentNote = 0;
        resp.gradedcomments?.forEach(g => {
          if (g.description?.startsWith('correct')) {
            currentNote = currentNote + currentQ.point!;
          }
        });
        if (resp === this.resp) {
          this.currentNote = currentNote;
        }
        resp.note = currentNote;
        if (update) {
          this.studentResponseService.partialUpdate(resp).subscribe(b => {
            if (b.body !== null) {
              resolve(b.body);
            } else {
              reject(null);
            }
          });
        } else {
          resolve(resp);
        }
      }
      resolve(resp);
    });
  }

  addComment() {
    this.blocked = true;
    this.updateResponseRequest(this.resp!).subscribe(resp => {
      this.resp = resp.body!;
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
          this.updateResponseRequest(this.resp!).subscribe(resp1 => {
            this.resp = resp1.body!;
            (currentComment as any).checked = true;
            this.currentTextComment4Question?.push(currentComment);
            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.blocked = false;
          });
        });
      } else if (this.currentQuestion !== undefined && this.currentQuestion.gradeType !== GradeType.DIRECT) {
        const t: IGradedComment = {
          questionId: this.currentQuestion.id,
          text: this.titreCommentaire,
          description: this.descCommentaire,
          grade: !this.noteCommentaire ? 0 : this.noteCommentaire,
          // studentResponses: [{ id: this.resp?.id }],
        };
        this.blocked = true;
        this.gradedCommentService.create(t).subscribe(e => {
          this.resp?.gradedcomments?.push(e.body!);
          const currentComment = e.body!;
          this.updateResponseRequest(this.resp!).subscribe(resp1 => {
            this.resp = resp1.body!;

            (currentComment as any).checked = true;
            this.currentGradedComment4Question?.push(currentComment);
            this.computeNote(false, this.resp!, this.currentQuestion!);
            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.noteCommentaire = 0;
            this.blocked = false;
          });
        });
      }
    });
  }

  // @HostListener('window:keydown.control.ArrowLeft', ['$event'])
  previousStudent() {
    if (!this.blocked) {
      const c = this.currentStudent;
      const q1 = this.questionindex!;

      if (c > 0) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionindex! + 1) + '/' + c);
      } else if (q1 > 0) {
        const prevSt = this.numberPagesInScan! / this.nbreFeuilleParCopie!;
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + q1 + '/' + prevSt);
      }
    }
  }

  // @HostListener('window:keydown.control.ArrowRight', ['$event'])
  nextStudent() {
    if (!this.blocked) {
      //      event.preventDefault();
      const c = this.currentStudent + 2;
      const q1 = this.questionindex! + 2;
      if (c <= this.numberPagesInScan! / this.nbreFeuilleParCopie!) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionindex! + 1) + '/' + c);
      } else if (q1 <= this.nbreQuestions) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + q1 + '/' + 1);
      }
    }
  }
  previousQuestion(): void {
    if (!this.blocked) {
      const c = this.currentStudent + 1;
      const q = this.questionindex;
      if (q! > 0) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + q + '/' + c);
      } else if (c > 1) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + this.nbreQuestions + '/' + (c - 1));
      }
    }
  }

  nextQuestion(): void {
    if (!this.blocked) {
      const c = this.currentStudent + 1;
      const q = this.questionindex! + 2;
      if (q <= this.nbreQuestions) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + q + '/' + c);
      } else if (c < this.numberPagesInScan! / this.nbreFeuilleParCopie!) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + 1 + '/' + (c + 1));
      }
    }
  }

  changeStudent($event: any): void {
    this.currentStudent = $event.page;
    const c = this.currentStudent + 1;
    this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionindex! + 1) + '/' + c);
  }
  changeQuestion($event: any): void {
    this.questionindex = $event.page;

    const c = this.currentStudent + 1;
    if ($event.pageCount !== 1) {
      this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionindex! + 1) + '/' + c);
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
      imageRef!.nativeElement.width = v.w * this.scale;
      imageRef!.nativeElement.height = v.h * this.scale;
      const ctx1 = imageRef!.nativeElement.getContext('2d');
      const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
      editedImage.width = v.w;
      editedImage.height = v.h;
      const ctx2 = editedImage.getContext('2d');
      ctx2!.putImageData(v.i, 0, 0);
      ctx1!.scale(this.scale, this.scale);
      ctx1!.drawImage(editedImage, 0, 0);
      show(true);
      if (updateanotationcanvas) {
        if (
          this.currentZoneCorrectionHandler.get(
            '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionNumeros[this.questionindex] + '_' + index
          ) === undefined
        ) {
          const zh = new ZoneCorrectionHandler(
            '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionNumeros[this.questionindex] + '_' + index,
            this.eventHandler,
            this.resp?.id
          );
          zh.updateCanvas(imageRef!.nativeElement);
          this.currentZoneCorrectionHandler.set(
            '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionNumeros[this.questionindex] + '_' + index,
            zh
          );
        } else {
          this.currentZoneCorrectionHandler
            .get('' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionNumeros[this.questionindex] + '_' + index)!
            .updateCanvas(imageRef!.nativeElement);
        }
      }
    }
  }

  loadAllPages(): Promise<void> {
    this.images = [];
    return new Promise<void>(resolve => {
      this.db.countNonAlignImage(+this.examId!).then(page => {
        if (page > 30) {
          this.db.countPageTemplate(+this.examId!).then(page1 => {
            if (this.noalign) {
              this.db
                .getNonAlignImageBetweenAndSortByPageNumber(+this.examId!, this.currentStudent * page1, (this.currentStudent + 1) * page1)
                .then(e1 => {
                  e1.forEach(e => {
                    const image = JSON.parse(e!.value, this.reviver);
                    this.images.push({
                      src: image.pages,
                      alt: 'Description for Image 2',
                      title: 'Exam',
                    });
                  });

                  resolve();
                });
            } else {
              this.db
                .getAlignImageBetweenAndSortByPageNumber(+this.examId!, this.currentStudent * page1 + 1, (this.currentStudent + 1) * page1)
                .then(e1 => {
                  e1.forEach(e => {
                    const image = JSON.parse(e!.value, this.reviver);
                    this.images.push({
                      src: image.pages,
                      alt: 'Description for Image 2',
                      title: 'Exam',
                    });
                  });
                  resolve();
                });
            }
          });
        } else {
          if (this.noalign) {
            this.db.getNonAlignSortByPageNumber(+this.examId!).then(e1 => {
              e1.forEach(e => {
                const image = JSON.parse(e!.value, this.reviver);

                this.images.push({
                  src: image.pages,
                  alt: 'Description for Image 2',
                  title: 'Exam',
                });
              });
              resolve();
            });
          } else {
            this.db.getAlignSortByPageNumber(+this.examId!).then(e1 => {
              e1.forEach(e => {
                const image = JSON.parse(e!.value, this.reviver);
                this.images.push({
                  src: image.pages,
                  alt: 'Description for Image 2',
                  title: 'Exam',
                });
              });
              resolve();
            });
          }
        }
      });
    });
  }

  async getAllImage4Zone(pageInscan: number, zone: IZone): Promise<ImageZone> {
    if (this.noalign) {
      return new Promise(resolve => {
        this.db.getFirstNonAlignImage(+this.examId!, pageInscan).then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);
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
        this.db.getFirstAlignImage(+this.examId!, pageInscan).then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);

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
      this.db.getFirstTemplate(+this.examId!, zone.pageNumber!).then(e2 => {
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
    this.blocked = true;
    this.loadAllPages().then(() => {
      this.blocked = false;

      this.displayBasic = true;
    });
  }

  async loadImage(file: any, page1: number): Promise<IPage> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        let factorScale = 0.75;
        if (this.windowWidth < 991) {
          factorScale = 0.95;
        }
        this.scale = (window.innerWidth * factorScale) / i.width;
        this.eventHandler.scale = this.scale;
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
      if ((l as IGradedComment).grade === null) {
        (l as IGradedComment).grade = 0;
      }
      this.gradedCommentService.update(l).subscribe(() => {
        const coms = this.resp?.gradedcomments?.filter(c => c.id === l.id!);
        if (coms !== undefined && coms.length > 0) {
          coms[0].grade = (l as any).grade;
          this.computeNote(true, this.resp!, this.currentQuestion!);
        }
      });
    } else {
      this.textCommentService.update(l).subscribe(() => {});
    }
  }

  changeAlign(): void {
    this.images = [];
    // this.loadAllPages();
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
          const t: IQCMInput = {
            preference: this.preferenceService.getPreference(),
          };
          t.pages = [];
          this.getTemplateImage4Zone(z!).then(p => {
            t.imageTemplate = p.i;
            const pagewithoffset = this.currentStudent * this.nbreFeuilleParCopie! + z!.pageNumber! + this.pageOffset;
            const pagewithoutoffset = this.currentStudent * this.nbreFeuilleParCopie! + z!.pageNumber!;
            let page = pagewithoutoffset;
            if (pagewithoffset > 0 && pagewithoffset <= this.numberPagesInScan!) {
              page = pagewithoffset;
            }
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

  removeTextComment(comment: ITextComment): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('scanexam.removetextcommentconfirmation'),
      accept: () => {
        this.retirerTComment(comment).then(() => {
          this.currentTextComment4Question = this.currentTextComment4Question!.filter(e => e.id !== comment.id);
          this.textCommentService.delete(comment!.id!).subscribe(() => console.log('delete'));
        });
      },
    });
  }

  removeGradedComment(comment: IGradedComment): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('scanexam.removegradedcommentconfirmation'),
      accept: () => {
        this.retirerGComment(comment).then(() => {
          this.currentGradedComment4Question = this.currentGradedComment4Question!.filter(e => e.id !== comment.id);
          this.gradedCommentService.delete(comment!.id!).subscribe(() => {
            console.log('delete');
          });
        });
      },
    });
  }

  // ----------------- code for realign -----------------------

  realign(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('scanexam.contientmarqueur'),
      accept: () => {
        this.realignInternal(true);
      },
      reject: () => {
        this.realignInternal(false);
      },
    });
  }

  realignInternal(mark: boolean) {
    this.blocked = true;
    this.initPool();
    this.questions!.forEach(q => {
      this.loadZone(q.zoneId).then(z => {
        const pagewithoffset = this.currentStudent! * this.nbreFeuilleParCopie! + z!.pageNumber! + this.pageOffset;
        const pagewithoutoffset = this.currentStudent! * this.nbreFeuilleParCopie! + z!.pageNumber!;
        let page = pagewithoutoffset;
        if (pagewithoffset > 0 && pagewithoffset <= this.numberPagesInScan!) {
          page = pagewithoffset;
        }
        this.db.getFirstTemplate(+this.examId!, z!.pageNumber!).then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);
          this.loadImage(image.pages, z!.pageNumber!).then(v => {
            this.db.getFirstNonAlignImage(+this.examId!, page).then(e3 => {
              const image1 = JSON.parse(e3!.value, this.reviver);
              this.loadImage(image1.pages, page).then(v1 => {
                const inp: IImageAlignementInput = {
                  imageA: v.image!.data.buffer,
                  imageB: v1.image!.data.buffer,
                  heightA: v.height,
                  widthA: v.width,
                  heightB: v1.height,
                  widthB: v1.width,
                  pageNumber: page,
                  marker: mark,
                  preference: this.preferenceService.getPreference(),
                  debug: false,
                };

                this.observer!.next(inp);
              });
            });
          });
        });
      });
    });
  }

  observable: Observable<IImageAlignementInput> | undefined;
  observer: Subscriber<IImageAlignementInput> | undefined;

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
        this.removeElementForPages(+this.examId!, e.pageNumber!, e.pageNumber!).then(
          () => {
            this.saveEligneImage(apage.page!, this.fgetBase64Image(im)).then(
              () => {
                this.observer?.complete();
                this.blocked = false;
              },
              () => {
                this.observer?.complete();
                this.blocked = false;
              }
            );
          },
          () => {
            this.observer?.complete();
            this.blocked = false;
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  async removeElementForPages(examId: number, pageStart: number, pageEnd: number): Promise<any> {
    await this.db.removeElementForExamForPages(examId, pageStart, pageEnd);
  }
  async saveEligneImage(pageN: number, imageString: string): Promise<void> {
    await this.db.addAligneImage({
      examId: +this.examId!,
      pageNumber: pageN,
      value: JSON.stringify(
        {
          pages: imageString!,
        },
        this.replacer
      ),
    });
    this.images = [];
    //  this.loadAllPages();
    this.reloadImage();
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
  private fgetBase64Image(img: ImageData): string {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx?.putImageData(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }

  changeStartPreference(): void {
    this.preferenceService.setKeyboardShortcuts(this.shortcutvalue);
  }

  removeAllAnswer(): void {
    this.examService.deleteAllAnswerAndComment(+this.examId!).subscribe(() => window.location.reload());
  }

  removeAnswer(): void {
    this.examService.deleteAnswer(this.resp!.id!).subscribe(() => this.ngOnInit());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const old = this.windowWidth;
    this.windowWidth = event.target.innerWidth;
    if (old / event.target.innerWidth > 1.15 || old / event.target.innerWidth < 0.85) {
      this.reloadImage();
    }
  }

  toggleCommentLayout() {
    this.minimizeComment = !this.minimizeComment;
    this.preferenceService.setMinimizeComments(this.minimizeComment);
  }
}
