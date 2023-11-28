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
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  AlignImagesService,
  IImageAlignement,
  IImageAlignementInput,
  IImageCropFromZoneInput,
  IQCMInput,
} from '../services/align-images.service';
import { IExam } from '../../entities/exam/exam.model';
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
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DrawingTools } from '../annotate-template/paint/models';

enum ScalePolicy {
  FitWidth = 1,
  FitHeight = 2,
  Original = 3,
}

@Component({
  selector: 'jhi-corrigequestion',
  templateUrl: './corrigequestion.component.html',
  styleUrls: ['./corrigequestion.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CorrigequestionComponent implements OnInit, AfterViewInit {
  getQuestionTooltip(): string | undefined {
    if (
      this.questions &&
      this.questions!.length > this.questionindex &&
      this.questions![this.questionindex]?.libelle &&
      this.questions![this.questionindex].libelle !== ''
    ) {
      return this.questions![this.questionindex].libelle!;
    } else {
      return 'Question ' + this.questionNumeros[this.questionindex];
    }
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
  nbreFeuilleParCopie: number | undefined;
  numberPagesInScan: number | undefined;
  exam: IExam | undefined;
  // course: ICourse | undefined;
  students: IStudent[] | undefined;
  currentStudent = 0;
  selectionStudents: IStudent[] | undefined;
  numberofzone: number | undefined = 0;
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
  examId: string | undefined;
  studentid: number | undefined;
  questionindex4shortcut: number | undefined;
  // examId_prev: string | undefined;
  // studentid_prev: number | undefined;
  // questionindex4shortcut_prev : number | undefined;

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
  init = true;
  showSpinner = false;
  constructor(
    public examService: ExamService,
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
    private keyboardShortcutService: KeyboardShortcutService,
    private applicationConfigService: ApplicationConfigService,
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
    this.init = true;

    let forceRefreshStudent = false;
    this.currentNote = 0;
    this.noteSteps = 0;
    this.maxNote = 0;
    this.resp = undefined;
    const examId_prev = this.examId;
    let studentid_prev = this.studentid;
    let questionindex4shortcut_prev = this.questionindex4shortcut;
    //      'answer/:examid/:questionno/:studentid',
    if (params.get('examid') !== null) {
      this.examId = params.get('examid')!;
      if (this.images.length === 0) {
        this.examId = params.get('examid')!;
        forceRefreshStudent = true;
      }
      if (params.get('questionno') !== null) {
        this.questionindex4shortcut = +params.get('questionno')! - 1;
      }

      this.pageOffset = 0;

      if (params.get('studentid') !== null) {
        this.studentid = +params.get('studentid')!;
        this.currentStudent = this.studentid - 1;
        // Step 1 Query templates
        if (this.examId !== examId_prev) {
          studentid_prev = -1;
          questionindex4shortcut_prev = -1;
          questionindex4shortcut_prev = -1;
          this.nbreFeuilleParCopie = await this.db.countPageTemplate(+this.examId);
          this.numberPagesInScan = await this.db.countAlignImage(+this.examId!);
          const data = await firstValueFrom(this.examService.find(+this.examId!));
          this.exam = data.body!;
          const b = await firstValueFrom(this.questionService.query({ examId: this.exam!.id }));
          this.questionNumeros = Array.from(new Set(b.body!.map(q => q.numero!))).sort((n1, n2) => n1 - n2);
          this.nbreQuestions = this.questionNumeros.length;

          await this.refreshStudentList(forceRefreshStudent);
        }
        if (this.studentid !== studentid_prev) {
          this.getSelectedStudent();
        }

        // must be done here as the change of the nbreQuestions triggers the event of change question with page = 0
        let questions: IQuestion[] | undefined = undefined;
        if (this.questions !== undefined) {
          questions = [...this.questions];
        }
        // eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
        if (this.questionindex4shortcut !== questionindex4shortcut_prev) {
          this.currentGradedComment4Question = [];
          this.currentTextComment4Question = [];

          if (params.get('questionno') !== null) {
            this.questionindex = +params.get('questionno')! - 1;
          }

          const q1 = await firstValueFrom(
            this.questionService.query({ examId: this.exam!.id, numero: this.questionNumeros[this.questionindex!] }),
          );
          if (q1.body !== null && q1.body.length > 0) {
            questions = q1.body!;
            this.noteSteps = questions[0].point! * questions[0].step!;
            this.questionStep = questions[0].step!;
            this.maxNote = questions[0].point!;
            this.currentQuestion = questions[0];

            if (questions![0].gradeType === GradeType.DIRECT && questions![0].typeAlgoName !== 'QCM') {
              const com = await firstValueFrom(this.textCommentService.query({ questionId: questions![0].id }));
              this.currentTextComment4Question = com.body!;
              this.currentTextComment4Question.forEach(com1 => {
                this.active.set(com1.id!, false);
              });
            } else {
              const com = await firstValueFrom(this.gradedCommentService.query({ questionId: questions![0].id }));
              this.currentGradedComment4Question = com.body!;
              this.currentGradedComment4Question.forEach(com1 => {
                this.active.set(com1.id!, false);
              });
            }
          }
        }

        this.currentGradedComment4Question?.forEach(com2 => ((com2 as any).checked = false));
        this.currentTextComment4Question?.forEach(com2 => ((com2 as any).checked = false));

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (questions !== undefined && questions.length > 0) {
          this.noteSteps = questions[0].point! * questions[0].step!;

          const sheets = (this.selectionStudents?.map(st => st.examSheets) as any)
            .flat()
            .filter((ex: any) => ex?.scanId === this.exam!.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie!);
          if (sheets !== undefined && sheets!.length > 0) {
            const sr = await firstValueFrom(
              this.studentResponseService.query({
                sheetId: sheets[0]?.id,
                questionsId: questions!.map(q => q.id),
              }),
            );
            if (sr.body !== null && sr.body.length > 0) {
              this.resp = sr.body![0];

              this.currentNote = this.resp.note!;
              await this.computeNote(false, this.resp!, this.currentQuestion!);
              if (questions![0].gradeType === GradeType.DIRECT && questions![0].typeAlgoName !== 'QCM') {
                this.resp.textcomments!.forEach(com1 => {
                  const elt = this.currentTextComment4Question?.find(com2 => com2.id === com1.id);
                  if (elt !== undefined) {
                    (elt as any).checked = true;
                  } else {
                    (elt as any).checked = false;
                  }
                });
              } else {
                this.resp.gradedcomments!.forEach(com1 => {
                  const elt = this.currentGradedComment4Question?.find(com2 => com2.id === com1.id);
                  if (elt !== undefined) {
                    (elt as any).checked = true;
                  } else {
                    (elt as any).checked = false;
                  }
                });
              }
            } else {
              this.resp = new StudentResponse(undefined, this.currentNote);
              this.resp.note = this.currentNote;
              this.resp.questionId = questions![0].id;
              this.resp.sheetId = sheets[0]?.id;
              this.resp.questionId = questions![0].id;
              //            this.studentResponseService.create(this.resp!).subscribe(sr1 => {
              //                                      this.resp = sr1.body!;
            }
            this.populateDefaultShortCut();
          }
          this.showImage = new Array<boolean>(questions.length);

          this.questions = questions;
          if (this.questionindex4shortcut === questionindex4shortcut_prev) {
            setTimeout(() => {
              this.questions = undefined;
              setTimeout(() => {
                this.questions = questions;
              }, 0);
            }, 1);
          }

          this.init = false;
          this.blocked = false;
        }
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
        key: ['ctrl + right', 'cmd + right'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.nextstudent'),
        command: () => this.nextStudent(),
        preventDefault: true,
      },
      {
        // ArrowLeft
        key: ['ctrl + left', 'cmd + left'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.previousstudent'),
        command: () => this.previousStudent(),
        preventDefault: true,
      },

      {
        key: ['ctrl + up', 'cmd + up'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.previousquestion'),
        command: () => this.previousQuestion(),
        preventDefault: true,
      },
      {
        key: ['ctrl + down', 'cmd + down'],
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
      },
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

  active: Map<number, boolean> = new Map();

  populateDefaultShortCut(): void {
    const toRemove: number[] = [];
    const comments: (IGradedComment | ITextComment)[] = [];
    if (this.currentGradedComment4Question) {
      comments.push(...this.currentGradedComment4Question);
    }
    if (this.currentTextComment4Question) {
      comments.push(...this.currentTextComment4Question);
    }

    if (this.keyboardShortcutService.getShortCutPreference().shortcuts.has(this.examId + '_' + this.questionindex)) {
      const res: IKeyBoardShortCutPreferenceEntry[] = this.keyboardShortcutService
        .getShortCutPreference()
        .shortcuts.get(this.examId + '_' + this.questionindex)!;
      res
        .filter(e1 => e1.examId === +this.examId! && e1.questionIndex === +this.questionindex)
        .forEach(entry => {
          toRemove.push(entry.commentId);
          const c2 = comments.filter(c => c.id === entry.commentId);
          if (c2.length > 0) {
            c2[0].shortcut = entry.key;
          }
        });
    }
    for (const { index, comment } of comments.map((c1, i) => ({ index: i, comment: c1 }))) {
      if (!toRemove.includes(comment.id!)) {
        let sh = '' + (index + 1);
        let createShortcut = true;
        if (index + 1 > 9 && index + 1 < 36) {
          sh = String.fromCharCode(87 + index + 1);
        } else if (index + 1 >= 36) {
          createShortcut = false;
        }
        if (createShortcut) {
          comment.shortcut = ['ctrl + ' + sh, 'cmd + ' + sh];
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  editComment(comment: any) {
    this.active.set(comment.id, true);
    this.minimizeComment = false;
  }

  resetAllShortCut() {
    this.testdisableAndEnableKeyBoardShortCut = false;
    this.shortCut4Comment = false;
    this.keyboardShortcutService.clearToDefault();
    this.populateDefaultShortCut();

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
    this.populateDefaultShortCut();
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

  async reloadImage() {
    if (this.questions) {
      for (const { i, q } of this.questions.map((value, index) => ({ i: index, q: value }))) {
        this.showImage[i] = false;
        const z = q.zoneDTO; // await this.loadZone(q.zoneId);
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
        const imagezone = await this.getAllImage4Zone(page, z!);

        this.displayImage(
          imagezone,
          this.canvass.get(i),
          b => {
            this.showImage[i] = b;
          },
          i,
          true,
        );
      }
    }
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

          //    this.loadZone(q.zoneId).then(z => {
          const z = q.zoneDTO;
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
                    const qid = this.questions!.map(qq => qq.id);
                    let sid = '';
                    const sheets = (this.selectionStudents?.map(st => st.examSheets) as any)
                      .flat()
                      .filter(
                        (ex: any) =>
                          ex?.scanId === this.exam!.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie!,
                      );
                    if (sheets !== undefined && sheets!.length > 0) {
                      sid = sheets[0]?.id;
                    }
                    this.studentResponseService
                      .query({
                        sheetId: sid,
                        questionsId: qid,
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
                },
              );
            });
          });
          //    });
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
      c => !this.currentGradedComment4Question?.map(v => v.text).includes(c) && !validExp!.includes(c!) && c !== '',
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
      const resp = await this.getStudentResponse(
        this.questions!.map(q => q.id!),
        e.numero!,
      );

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
          this.testdisableAndEnableKeyBoardShortCut = false;
          this.populateDefaultShortCut();
          setTimeout(() => {
            (this.testdisableAndEnableKeyBoardShortCut = true), 300;
          });
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
      !(this.currentQuestion.gradeType !== GradeType.DIRECT || this.currentQuestion.typeAlgoName === 'QCM') &&
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
    if (!this.blocked) {
      const res = this.currentTextComment4Question?.filter(c => c.id === commentId);
      if (res !== undefined && res.length > 0) {
        this.toggleTComment(res[0]);
      }
    }
  }
  toggleGCommentById(commentId: any) {
    if (!this.blocked) {
      const res = this.currentGradedComment4Question?.filter(c => c.id === commentId);
      if (res !== undefined && res.length > 0) {
        this.toggleGComment(res[0]);
      }
    }
  }

  toggleGComment(comment: IGradedComment) {
    if (!this.blocked) {
      if (!this.checked(comment)) {
        this.ajouterGComment(comment);
      } else {
        this.retirerGComment(comment);
      }
    }
  }
  toggleTComment(comment: ITextComment) {
    if (!this.blocked) {
      if (!this.checked(comment)) {
        this.ajouterTComment(comment);
      } else {
        this.retirerTComment(comment);
      }
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
    if (!this.blocked) {
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
              this.testdisableAndEnableKeyBoardShortCut = false;
              this.populateDefaultShortCut();
              setTimeout(() => {
                (this.testdisableAndEnableKeyBoardShortCut = true), 300;
              });

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
              this.testdisableAndEnableKeyBoardShortCut = false;
              this.populateDefaultShortCut();
              setTimeout(() => {
                (this.testdisableAndEnableKeyBoardShortCut = true), 300;
              });

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
  }

  cleanCanvassCache() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.eventHandler?.allcanvas !== undefined) {
      this.eventHandler.allcanvas.splice(0);
      this.eventHandler.selectedTool = DrawingTools.PENCIL;
    }
  }

  previousStudent() {
    if (!this.blocked) {
      this.cleanCanvassCache();
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

  nextStudent() {
    if (!this.blocked) {
      this.cleanCanvassCache();

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
      this.cleanCanvassCache();

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
      this.cleanCanvassCache();
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
    if (!this.init) {
      this.cleanCanvassCache();
      this.currentStudent = $event.page;
      const c = this.currentStudent + 1;
      this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionindex! + 1) + '/' + c);
    }
  }
  changeQuestion($event: any): void {
    if (!this.init) {
      this.cleanCanvassCache();

      this.questionindex = $event.page;

      const c = this.currentStudent + 1;
      if ($event.pageCount !== 1) {
        this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionindex! + 1) + '/' + c);
      }
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
    this.cleanCanvassCache();
    this.router.navigateByUrl('/exam/' + this.examId!);
  }

  gotoMarkingSummary(): void {
    this.cleanCanvassCache();
    this.router.navigateByUrl('/marking-summary/' + this.examId!);
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
    const filterStudent = this.students!.filter(
      s => s.examSheets?.some(ex => ex.scanId === this.exam!.scanfileId && ex.pagemin === this.currentStudent * this.nbreFeuilleParCopie!),
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

  displayImage(
    v: ImageZone,
    imageRef: ElementRef<any> | undefined,
    show: (s: boolean) => void,
    index: number,
    updateanotationcanvas: boolean,
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
            '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionNumeros[this.questionindex] + '_' + index,
          ) === undefined
        ) {
          const zh = new ZoneCorrectionHandler(
            '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionNumeros[this.questionindex] + '_' + index,
            this.eventHandler,
            this.resp?.id,
          );
          zh.updateCanvas(imageRef!.nativeElement);
          this.currentZoneCorrectionHandler.set(
            '' + this.examId + '_' + this.selectionStudents![0].id + '_' + this.questionNumeros[this.questionindex] + '_' + index,
            zh,
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
    const imageToCrop: IImageCropFromZoneInput = {
      examId: +this.examId!,
      factor: +this.factor,
      align: !this.noalign,
      template: false,
      indexDb: this.preferenceService.getPreference().cacheDb === 'indexdb',
      page: pageInscan,
      z: zone,
    };
    const crop = await firstValueFrom(this.alignImagesService.imageCropFromZone(imageToCrop));
    this.computeScale(crop.width, crop.height);

    return {
      i: new ImageData(new Uint8ClampedArray(crop.image), crop.width, crop.height),
      h: crop.height,
      w: crop.width,
    };
  }

  async getTemplateImage4Zone(zone: IZone): Promise<ImageZone> {
    const imageToCrop: IImageCropFromZoneInput = {
      examId: +this.examId!,
      factor: +this.factor,
      align: !this.noalign,
      template: true,
      indexDb: this.preferenceService.getPreference().cacheDb === 'indexdb',
      page: zone.pageNumber!,
      z: zone,
    };
    const crop = await firstValueFrom(this.alignImagesService.imageCropFromZone(imageToCrop));
    this.computeScale(crop.width, crop.height);

    return {
      i: new ImageData(new Uint8ClampedArray(crop.image), crop.width, crop.height),
      h: crop.height,
      w: crop.width,
    };
  }

  async getStudentResponse(questionsId: number[], currentStudent: number): Promise<StudentResponse> {
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
          questionsId: questionsId,
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

  showGalleria(): void {
    this.blocked = true;
    this.loadAllPages().then(() => {
      this.blocked = false;

      this.displayBasic = true;
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeydownHandler(event: KeyboardEvent) {
    this.displayBasic = false;
  }

  scalePolicy = ScalePolicy.FitWidth;
  scaleOptions = [
    { name: 'FitWidth', value: ScalePolicy.FitWidth },
    { name: 'FitHeight', value: ScalePolicy.FitHeight },
    { name: 'No Fit', value: ScalePolicy.Original },
  ];
  updateScalePolicy(event: any) {
    this.scalePolicy = event.value;
    this.reloadImage();
  }
  computeScale(imageWidth: number, imageHeight: number): void {
    let scale = 1;
    if (this.scalePolicy === ScalePolicy.FitWidth) {
      let factorScale = 0.75;
      if (this.windowWidth < 991) {
        factorScale = 0.95;
      }
      scale = (window.innerWidth * factorScale) / imageWidth;
      if (scale > 2) {
        scale = 2;
      }
    } else if (this.scalePolicy === ScalePolicy.FitHeight) {
      const factorScale = 0.7;
      scale = (window.innerHeight * factorScale) / imageHeight;
      if (scale > 2) {
        scale = 2;
      }
      let factorScaleW = 0.75;
      if (this.windowWidth < 991) {
        factorScaleW = 0.95;
      }
      if (imageWidth * scale > factorScaleW * window.innerWidth) {
        scale = (window.innerWidth * factorScaleW) / imageWidth;
      }
    } else {
      // Fitnormal
      scale = 1;
    }

    this.scale = scale;
    this.eventHandler.scale = this.scale;
  }

  async loadImage(file: any, page1: number): Promise<IPage> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        this.computeScale(i.width, i.height);
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
    if (l.id) {
      this.active.set(l.id, false);
    }
  }

  closeEditComment(l: IGradedComment | ITextComment) {
    if (l.id) {
      this.active.set(l.id, false);
    }
  }

  changeAlign(): void {
    this.images = [];
    this.reloadImage();
  }
  getStudentName(): string | undefined {
    return this.selectionStudents?.map(e1 => e1.firstname + ' ' + e1.name).join(', ');
  }

  computeQCMdebug() {
    if (this.questions?.length === 1) {
      this.blocked = true;

      this.questions!.forEach((q, index) => {
        const z = q.zoneDTO;
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
                  false,
                );
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
    if (!this.blocked) {
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
    if (!this.blocked) {
      this.blocked = true;
      this.initPool();
      this.questions!.forEach(q => {
        //   this.loadZone(q.zoneId).then(z => {
        const z = q.zoneDTO;
        const pagewithoffset = this.currentStudent! * this.nbreFeuilleParCopie! + z!.pageNumber! + this.pageOffset;
        const pagewithoutoffset = this.currentStudent! * this.nbreFeuilleParCopie! + z!.pageNumber!;
        let page = pagewithoutoffset;
        if (pagewithoffset > 0 && pagewithoffset <= this.numberPagesInScan!) {
          page = pagewithoffset;
        }
        this.db.getFirstTemplate(+this.examId!, z!.pageNumber!).then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);
          this.loadImage(image.pages, z!.pageNumber!).then(v => {
            const inp: IImageAlignementInput = {
              imageA: v.image!.data.buffer,
              //                    imageB: v1.image!.data.buffer,
              heightA: v.height,
              widthA: v.width,
              //                    heightB: v1.height,
              //                    widthB: v1.width,
              pageNumber: page,
              marker: mark,
              preference: this.preferenceService.getPreference(),
              debug: false,
              examId: +this.examId!,
              indexDb: this.preferenceService.getPreference().cacheDb === 'indexdb',
            };

            this.observer!.next(inp);
          });
        });
        // });
      });
    }
  }

  observable: Observable<IImageAlignementInput> | undefined;
  observer: Subscriber<IImageAlignementInput> | undefined;

  initPool(): void {
    this.observable = new Observable(observer => {
      this.observer = observer;
    });
    fromWorkerPool<IImageAlignementInput, IImageAlignement>(worker1, this.observable, {
      selectTransferables: input => [input.imageA],
    }).subscribe(
      e => {
        const apage = {
          image: e.imageAligned,
          page: e.pageNumber,
          width: e.imageAlignedWidth!,
          height: e.imageAlignedHeight,
        };
        const im = new ImageData(new Uint8ClampedArray(apage.image!), apage.width, apage.height);
        // TODO remove just align
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
              },
            );
          },
          () => {
            this.observer?.complete();
            this.blocked = false;
          },
        );
      },
      err => {
        console.log(err);
      },
    );
  }

  async removeElementForPages(examId: number, pageStart: number, pageEnd: number): Promise<any> {
    await this.db.removePageAlignForExamForPages(examId, pageStart, pageEnd);
  }
  async saveEligneImage(pageN: number, imageString: string): Promise<void> {
    await this.db.addAligneImage({
      examId: +this.examId!,
      pageNumber: pageN,
      value: JSON.stringify(
        {
          pages: imageString!,
        },
        this.replacer,
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
    let exportImageType = 'image/webp';
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.preferenceService.getPreference().imageTypeExport !== undefined &&
      ['image/webp', 'image/png', 'image/jpg'].includes(this.preferenceService.getPreference().imageTypeExport)
    ) {
      exportImageType = this.preferenceService.getPreference().imageTypeExport;
    }

    const dataURL = canvas.toDataURL(exportImageType);
    return dataURL;
  }

  changeStartPreference(): void {
    this.preferenceService.setKeyboardShortcuts(this.shortcutvalue);
  }

  removeAllAnswer(): void {
    this.examService.deleteAllAnswerAndComment(+this.examId!).subscribe(() => window.location.reload());
  }

  removeAnswer(): void {
    if (!this.blocked) {
      this.examService.deleteAnswer(this.resp!.id!).subscribe(() => this.ngOnInit());
    }
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

  compareGradedComment(event: any, comment: IGradedComment) {
    if (!this.blocked) {
      if (event.ctrlKey || event.metaKey) {
        this.zone.run(() => {
          const url = this.router.serializeUrl(this.router.createUrlTree(['/comparegradedcomment/' + this.examId + '/' + comment.id]));
          if ('/' !== this.applicationConfigService.getFrontUrl()) {
            if (this.applicationConfigService.getFrontUrl().endsWith('/') && url.startsWith('/')) {
              window.open(this.applicationConfigService.getFrontUrl().slice(0, -1) + url, '_blank');
            } else {
              window.open(this.applicationConfigService.getFrontUrl() + url, '_blank');
            }
          } else {
            window.open(url, '_blank');
          }
        });
      } else {
        this.zone.run(() => {
          this.router.navigate(['/comparegradedcomment/' + this.examId + '/' + comment.id]);
        });
      }
    }
  }
  compareTextComment(event: any, comment: ITextComment) {
    if (!this.blocked) {
      if (event.ctrlKey || event.metaKey) {
        this.zone.run(() => {
          const url = this.router.serializeUrl(this.router.createUrlTree(['/comparetextcomment/' + this.examId + '/' + comment.id]));
          if ('/' !== this.applicationConfigService.getFrontUrl()) {
            if (this.applicationConfigService.getFrontUrl().endsWith('/') && url.startsWith('/')) {
              window.open(this.applicationConfigService.getFrontUrl().slice(0, -1) + url, '_blank');
            } else {
              window.open(this.applicationConfigService.getFrontUrl() + url, '_blank');
            }
          } else {
            window.open(url, '_blank');
          }
        });
      } else {
        this.zone.run(() => {
          this.router.navigate(['/comparetextcomment/' + this.examId + '/' + comment.id]);
        });
      }
    }
  }
  compareMark(event: any, response: IStudentResponse) {
    if (!this.blocked) {
      if (event.ctrlKey || event.metaKey) {
        this.zone.run(() => {
          const url = this.router.serializeUrl(this.router.createUrlTree(['/comparemark/' + this.examId + '/' + response.id]));
          if ('/' !== this.applicationConfigService.getFrontUrl()) {
            if (this.applicationConfigService.getFrontUrl().endsWith('/') && url.startsWith('/')) {
              window.open(this.applicationConfigService.getFrontUrl().slice(0, -1) + url, '_blank');
            } else {
              window.open(this.applicationConfigService.getFrontUrl() + url, '_blank');
            }
          } else {
            window.open(url, '_blank');
          }
        });
      } else {
        this.zone.run(() => {
          this.router.navigate(['/comparemark/' + this.examId + '/' + response.id]);
        });
      }
    }
  }
}
