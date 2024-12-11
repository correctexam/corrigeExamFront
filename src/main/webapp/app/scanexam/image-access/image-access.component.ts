/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  HostListener,
  ViewChild,
  NgZone,
  Signal,
  signal,
  WritableSignal,
  effect,
  LOCALE_ID,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CourseService } from 'app/entities/course/service/course.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import {
  AlignImagesService,
  IImageAlignement,
  IImageAlignementInput,
  IImageCropFromZoneInput,
  IQCMInput,
} from '../services/align-images.service';
import { IExam } from '../../entities/exam/exam.model';
// import { IStudent } from '../../entities/student/student.model';
import { ImageZone, IPage } from '../associer-copies-etudiants/associer-copies-etudiants.component';
import { IZone } from 'app/entities/zone/zone.model';
import { QuestionService } from '../../entities/question/service/question.service';
import { IQuestion } from '../../entities/question/question.model';
import { IStudentResponse, StudentResponse } from '../../entities/student-response/student-response.model';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';
import { EventCanevascorrectionHandlerService } from '../corrigequestion/event-canevascorrection-handler.service';
import { ZoneCorrectionHandler } from '../corrigequestion/ZoneCorrectionHandler';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Observable, Subscriber, firstValueFrom } from 'rxjs';
import { fromWorkerPool } from 'observable-webworker';
import { worker1 } from '../services/workerimport';
import { PreferenceService } from '../preference-page/preference.service';
import { EntityResponseType } from '../../entities/exam-sheet/service/exam-sheet.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { KeyboardShortcutsComponent, ShortcutEventOutput, ShortcutInput, KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DrawingTools } from '../annotate-template/paint/models';
import { Inplace, InplaceModule } from 'primeng/inplace';
import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { OrderList, OrderListModule } from 'primeng/orderlist';
import { Title } from '@angular/platform-browser';

import { PromisePool } from '@supercharge/promise-pool';
import { FocusViewService } from '../../layouts/profiles/focusview.service';
import { KnobModule } from 'primeng/knob';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GraphicalToolbarCorrectionComponent } from '../corrigequestion/toolbar/toolbar.component';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { GalleriaModule } from 'primeng/galleria';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FontsizeSliderComponent } from '../corrigequestion/toolbar/fontsize-slider/fontsize-slider.component';
import { ThicknessSliderComponent } from '../corrigequestion/toolbar/thickness-slider/thickness-slider.component';
import { ColourPaletteComponent } from '../corrigequestion/toolbar/colour-palette/colour-palette.component';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RatingModule } from 'primeng/rating';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { QuestionpropertiesviewComponent } from '../annotate-template/paint/questionpropertiesview/questionpropertiesview.component';
import { SidebarModule } from 'primeng/sidebar';
import { KeyboardshortcutComponent } from '../corrigequestion/keyboardshortcut/keyboardshortcut.component';
import { NgIf, NgFor, DecimalPipe, DatePipe } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Button, ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { SwipeDirective } from '../swipe.directive';
import { ScriptService } from 'app/entities/scan/service/dan-service.service';
import { IPrediction } from 'app/entities/prediction/prediction.model';
import { delay } from 'cypress/types/bluebird';

enum ScalePolicy {
  FitWidth = 1,
  FitHeight = 2,
  Original = 3,
}

@Component({
  selector: 'jhi-image-access',
  templateUrl: './image-access.component.html',
  styleUrls: ['./image-access.component.scss'],
  providers: [ConfirmationService, MessageService, { provide: LOCALE_ID, useValue: 'fr' }],
  standalone: true,
  imports: [
    SwipeDirective,
    ToastModule,
    DialogModule,
    TranslateDirective,
    FormsModule,
    InputTextModule,
    Button,
    ConfirmDialogModule,
    PrimeTemplate,
    ButtonDirective,
    KeyboardShortcutsModule,
    NgIf,
    KeyboardshortcutComponent,
    SidebarModule,
    QuestionpropertiesviewComponent,
    OrderListModule,
    FaIconComponent,
    RatingModule,
    InputSwitchModule,
    TooltipModule,
    SliderModule,
    ColourPaletteComponent,
    ThicknessSliderComponent,
    FontsizeSliderComponent,
    SelectButtonModule,
    BlockUIModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    GalleriaModule,
    ProgressBarModule,
    PaginatorModule,
    NgFor,
    GraphicalToolbarCorrectionComponent,
    InplaceModule,
    InputTextareaModule,
    KnobModule,
    DecimalPipe,
    DatePipe,
    TranslateModule,
  ],
})
export class ImageAccessComponent implements OnInit {
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
  focusView = false;

  layoutsidebarVisible = false;
  debug = false;
  @ViewChild('qcmcorrect')
  qcmcorrect!: ElementRef;
  @ViewChild('imageQcmDebugs')
  canvassQCM!: ElementRef;

  shortcut = true;
  shortcutvalue = true;
  showImageQCM = false;

  @ViewChildren('nomImage') canvass2!: QueryList<ElementRef<HTMLCanvasElement>>;

  @ViewChildren('nomImage')
  canvass!: QueryList<ElementRef>;
  showImage: boolean[] = [];
  nbreFeuilleParCopie: number | undefined;
  numberPagesInScan: number | undefined;
  exam: IExam | undefined;
  sheet: IExamSheet | undefined;

  // course: ICourse | undefined;
  //  students: IStudent[] | undefined;
  currentStudent = 0;
  currentStudentPaginator = 0;
  //  selectionStudents: IStudent[] | null |undefined;
  studentName: string | undefined;
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
  currentQuestion: IQuestion | undefined;
  noalign = false;
  factor = 1;
  scale = 1;
  currentPrediction4Question: Signal<IPrediction>[] | undefined;

  windowWidth = 0;
  currentZoneCorrectionHandler: Map<string, ZoneCorrectionHandler> = new Map(); // | undefined;
  shortcuts: ShortcutInput[] = [];
  currentKeyBoardShorcut: string | string[] = '';
  examId: string | undefined;
  studentid: number | undefined;
  questionindex4shortcut: number | undefined;
  // examId_prev: string | undefined;
  // studentid_prev: number | undefined;
  // questionindex4shortcut_prev : number | undefined;

  @ViewChild(KeyboardShortcutsComponent)
  private keyboard: KeyboardShortcutsComponent | undefined;
  @ViewChild('input') input: ElementRef | undefined;
  testdisableAndEnableKeyBoardShortCut: WritableSignal<boolean> = signal(false);
  testdisableAndEnableKeyBoardShortCutSignal = false;
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

  relativeOptions = [
    { label: 'relative', value: true },
    { label: 'absolute', value: false },
  ];
  grade = 0;
  relative = true;
  step = 1;

  // Variables pour gérer la sortie et l'erreur du script
  output: string = '';
  error: string = '';
  imagepath: string = 'I did not get it';
  predictionsDic: { [key: number]: string } = {}; // Object to store predictions for each page
  currentPrediction: IPrediction | null = null;
  questionId: number | undefined = -1;
  deleted: boolean = false;

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
    public predictionService: PredictionService,
    public studentResponseService: StudentResponseService,
    private changeDetector: ChangeDetectorRef,
    private eventHandler: EventCanevascorrectionHandlerService,
    private translateService: TranslateService,
    private preferenceService: PreferenceService,
    private db: CacheServiceImpl,
    private zone: NgZone,
    private titleService: Title,
    private ngZone: NgZone,
    private scriptService: ScriptService, // Ajout du service ici
  ) {
    effect(() => {
      this.testdisableAndEnableKeyBoardShortCutSignal = this.testdisableAndEnableKeyBoardShortCut();
    });
  }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.shortcut = this.preferenceService.showKeyboardShortcuts();
    this.shortcutvalue = this.preferenceService.showKeyboardShortcuts();

    this.activatedRoute.paramMap.subscribe(params => {
      this.manageParam(params);
    });
  }

  updateTitle(): void {
    this.activatedRoute.data.subscribe(e => {
      // console.error('title', this.exam);
      this.translateService.get(e['pageTitle'], { examName: this.exam?.name, courseName: this.exam?.courseName }).subscribe(e1 => {
        //  console.error('settitle', e1);
        this.titleService.setTitle(e1);
      });
    });
  }

  async manageParam(params: ParamMap) {
    this.testdisableAndEnableKeyBoardShortCut.set(false);
    this.init = true;

    //    let forceRefreshStudent = false;
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
        //   forceRefreshStudent = true;
      }
      if (params.get('questionno') !== null) {
        this.questionindex4shortcut = +params.get('questionno')! - 1;
      }

      this.pageOffset = 0;

      this.updateTitle();

      if (params.get('studentid') !== null) {
        this.studentid = +params.get('studentid')!;
        this.currentStudent = this.studentid - 1;
        const m = this.preferenceService.getRandomOrderForExam(+this.examId);
        if (m.size === 0) {
          this.currentStudentPaginator = this.studentid - 1;
        } else {
          if (params.get('questionno') !== null) {
            this.currentStudentPaginator = m.get(+params.get('questionno')!)!.indexOf(this.currentStudent + 1);

            //            this.currentStudentPaginator = m.get(+params.get('questionno')!)![this.currentStudent] - 1;
          }
        }
        // Step 1 Query templates
        if (this.examId !== examId_prev) {
          studentid_prev = -1;
          questionindex4shortcut_prev = -1;
          questionindex4shortcut_prev = -1;
          this.nbreFeuilleParCopie = await this.db.countPageTemplate(+this.examId);
          this.numberPagesInScan = await this.db.countAlignImage(+this.examId!);
          const data = await firstValueFrom(this.examService.find(+this.examId!));
          this.exam = data.body!;
          this.updateTitle();
          this.translateService.onLangChange.subscribe(() => {
            this.updateTitle();
          });

          const b = await firstValueFrom(this.questionService.query({ examId: this.exam!.id }));

          if (this.numberPagesInScan && this.nbreFeuilleParCopie) {
            this.preferenceService.generateRandomOrderForQuestion(
              b.body!,
              this.numberPagesInScan! / this.nbreFeuilleParCopie!,
              +this.examId,
            );
          }

          this.questionNumeros = Array.from(new Set(b.body!.map(q => q.numero!))).sort((n1, n2) => n1 - n2);
          this.nbreQuestions = this.questionNumeros.length;

          //          await this.refreshStudentList(forceRefreshStudent);
        }
        if (this.studentid !== studentid_prev) {
          await this.getSelectedStudent(this.currentStudent);
        }

        // must be done here as the change of the nbreQuestions triggers the event of change question with page = 0
        let questions: IQuestion[] | undefined = undefined;
        if (this.questions !== undefined) {
          questions = [...this.questions];
        }

        if (this.questionindex4shortcut !== questionindex4shortcut_prev) {
          this.currentPrediction4Question = [];

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

            /* Need to be verified
            const com = await firstValueFrom(this.predictionService.query({ questionId: questions![0].id }));
              this.currentPrediction4Question = [];
              com.body!.forEach(prediction => {
                this.currentPrediction4Question?.push(signal(prediction));
              });
              this.currentPrediction4Question.forEach(com1 => {
                this.active.set(com1().id!, signal(false));
              });
            */
            this.questionId = questions![0].id;

            this.loadPrediction();
            setTimeout(() => {
              if (this.currentQuestion?.typeAlgoName === 'manuscrit' && !this.currentPrediction) {
                this.executeScript();
              }
            }, 500);
          }
        }
        this.currentPrediction4Question?.forEach(com2 => ((com2() as any).checked = false));

        if (questions !== undefined && questions.length > 0) {
          this.noteSteps = questions[0].point! * questions[0].step!;

          if (this.sheet !== undefined) {
            const sr = await firstValueFrom(
              this.studentResponseService.query({
                sheetId: this.sheet.id!,
                questionsId: questions!.map(q => q.id),
              }),
            );
          }
          this.showImage = new Array<boolean>(questions.length);

          this.questions = questions;
          if (this.questionindex4shortcut === questionindex4shortcut_prev) {
            setTimeout(() => {
              this.questions = undefined;
              setTimeout(() => {
                this.questions = questions;
              }, 20);
            }, 1);
          }

          this.init = false;
          this.blocked = false;
        }
      } else {
        const c = this.currentStudent + 1;
        this.ngZone.run(() => {
          this.router.navigateByUrl('/answer/' + this.examId! + '/' + (this.questionindex! + 1) + '/' + c);
        });
      }
      this.testdisableAndEnableKeyBoardShortCut.set(true);
    }
  }

  active: Map<number, WritableSignal<boolean>> = new Map();

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
  updateWorstStar() {
    if (this.resp !== undefined) {
      if (this.resp.worststar) {
        this.resp.star = false;
      }
      this.updateResponse();
    }
  }
  updateStar() {
    if (this.resp !== undefined) {
      if (this.resp.star) {
        this.resp.worststar = false;
      }
      this.updateResponse();
    }
  }

  cleanCanvassCache() {
    if (this.eventHandler?.allcanvas !== undefined) {
      this.eventHandler.allcanvas.splice(0);
      this.eventHandler.selectedTool = DrawingTools.PENCIL;
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
    this.ngZone.run(() => {
      this.router.navigateByUrl('/exam/' + this.examId!);
    });
  }

  async getSelectedStudent(currentStudent: number) {
    if ((currentStudent + 1) * this.nbreFeuilleParCopie! - 1 < this.numberPagesInScan!) {
      const _sheets = await firstValueFrom(
        this.sheetService.query({
          scanId: this.exam!.scanfileId,
          pagemin: currentStudent * this.nbreFeuilleParCopie!,
          pagemax: (currentStudent + 1) * this.nbreFeuilleParCopie! - 1,
        }),
      );
      if (_sheets.body !== null && _sheets.body.length > 0) {
        this.sheet = _sheets.body[0];
        this.studentService.query({ sheetId: this.sheet.id! }).subscribe(e => {
          if (e.body !== null) {
            this.studentName = e.body.map(e1 => e1.firstname + ' ' + e1.name).join(', ');
          } else {
            this.studentName = undefined;
          }
        });
      }
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
      if (updateanotationcanvas && this.sheet !== undefined) {
        if (
          this.currentZoneCorrectionHandler.get(
            '' + this.examId + '_' + this.sheet.id! + '_' + this.questionNumeros[this.questionindex] + '_' + index,
          ) === undefined
        ) {
          const zh = new ZoneCorrectionHandler(
            '' + this.examId + '_' + this.sheet.id! + '_' + this.questionNumeros[this.questionindex] + '_' + index,
            this.eventHandler,
            this.resp?.id,
          );
          zh.updateCanvas(imageRef!.nativeElement);
          this.currentZoneCorrectionHandler.set(
            '' + this.examId + '_' + this.sheet.id! + '_' + this.questionNumeros[this.questionindex] + '_' + index,
            zh,
          );
        } else {
          this.currentZoneCorrectionHandler
            .get('' + this.examId + '_' + this.sheet.id! + '_' + this.questionNumeros[this.questionindex] + '_' + index)!
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
    console.log('I am here getTemplateImage4Zone');
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

  async getStudentResponse4CurrentStudent(questionsId: number[], currentStudent: number): Promise<StudentResponse> {
    console.log('I am here getStudentResponse4CurrentStudent');
    const _sheets = await firstValueFrom(
      this.sheetService.query({
        scanId: this.exam!.scanfileId,
        pagemin: currentStudent * this.nbreFeuilleParCopie!,
        pagemax: (currentStudent + 1) * this.nbreFeuilleParCopie! - 1,
      }),
    );
    let sheet: IExamSheet | undefined;
    if (_sheets.body !== null && _sheets.body.length > 0) {
      sheet = _sheets.body[0];
    }

    if (sheet !== undefined) {
      const _sr = (
        await firstValueFrom(
          this.studentResponseService.query({
            sheetId: sheet!.id!,
            questionsId: questionsId,
          }),
        )
      ).body;
      if (_sr !== null && _sr.length > 0) {
        return _sr[0];
      } else {
        const st: IStudentResponse = {};
        st.note = this.currentNote;
        st.questionId = this.questions![0].id;
        st.sheetId = sheet!.id!;
        const sr1 = await firstValueFrom(this.studentResponseService.create(st));
        return sr1.body!;
      }
    } else {
      throw new Error('No sheet for this page, should never happen');
    }
  }

  async getStudentResponse(questionsId: number[]): Promise<StudentResponse> {
    if (this.sheet !== undefined) {
      const _sr = (
        await firstValueFrom(
          this.studentResponseService.query({
            sheetId: this.sheet!.id!,
            questionsId: questionsId,
          }),
        )
      ).body;
      if (_sr !== null && _sr.length > 0) {
        return _sr[0];
      } else {
        const st: IStudentResponse = {};
        st.note = this.currentNote;
        st.questionId = this.questions![0].id;
        st.sheetId = this.sheet!.id!;
        const sr1 = await firstValueFrom(this.studentResponseService.create(st));
        return sr1.body!;
      }
    } else {
      throw new Error('No sheet for this page, should never happen');
    }
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
    console.log('loadImage called with file:', file);
    return new Promise(resolve => {
      const i = new Image();

      // Add debugging to check when the image is loaded
      i.onload = () => {
        console.log('Image loaded with dimensions:', i.width, i.height); // Log image dimensions

        const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        this.computeScale(i.width, i.height);
        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);

        const inputimage = ctx!.getImageData(0, 0, i.width, i.height);
        console.log('ImageData extracted:', inputimage); // Log extracted image data

        resolve({ image: inputimage, page: page1, width: i.width, height: i.height });
      };

      // Set the image source and log it
      i.src = file;
      console.log('Image source set to:', i.src); // Debugging log for the image source
    });
  }

  changeAlign(): void {
    this.images = [];
    this.reloadImage();
  }
  // getStudentName(): string | undefined {
  // }

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const old = this.windowWidth;
    this.windowWidth = event.target.innerWidth;
    if (old / event.target.innerWidth > 1.15 || old / event.target.innerWidth < 0.85) {
      this.reloadImage();
    }
  }

  questionpropertiesviewVisible = false;
  editQuestion(): void {
    this.questionpropertiesviewVisible = true;
  }

  // This method is to get the image
  getImageFromCanvas(): string | undefined {
    const canvasArray = this.canvass2.toArray();
    if (canvasArray && canvasArray[0]) {
      const canvas = canvasArray[0].nativeElement;
      const base64Data = canvas.toDataURL(); // Convert the canvas to a base64-encoded string
      return base64Data;
    } else {
      console.error('Canvas not found or not yet available');
      return undefined;
    }
  }

  isLoading = false;
  // Méthode pour exécuter le script
  async executeScript(): Promise<void> {
    this.deleted = false;
    if (this.currentQuestion?.typeAlgoName === 'manuscrit') {
      console.log('Yes, I am manuscrit.');
      this.isLoading = true;
      this.changeDetector.detectChanges();
      const imageData = this.getImageFromCanvas();
      console.log('Image data:', imageData);

      if (!imageData) {
        console.error('No image data found on the canvas');
        this.error = 'No image selected';
        this.isLoading = false;
        return;
      }

      console.log('Executing script with image data from canvas');
      const question_id = this.questionId;
      const exam_id = this.examId;
      const student_id = this.studentid;
      const question_number = this.questionindex + 1;

      // Await the ID from createPrediction before proceeding
      const prediction_id = await this.createPrediction(question_id, exam_id, student_id, question_number, imageData);

      // Proceed only if prediction_id is valid
      if (prediction_id !== undefined) {
        this.scriptService.runScript(imageData).subscribe({
          next: response => {
            const currentPageIndex = this.questionindex;

            // Ensure response.prediction exists and access the first prediction
            //const prediction = response.prediction ? response.prediction[0] : '';
            const prediction = response.prediction;
            this.predictionsDic[currentPageIndex] = prediction;

            // Now store the prediction with the actual ID
            this.storePrediction(prediction, question_id, exam_id, student_id, question_number, prediction_id);

            // Update the output for display
            this.output = prediction;
            this.error = '';
            this.isLoading = false;
            this.changeDetector.detectChanges();
          },
          error: err => {
            console.error('Error executing script:', err);
            this.output = '';
            this.error = err.error || 'An error occurred';
            this.isLoading = false;
            this.changeDetector.detectChanges();
          },
        });
      }
    }
  }

  storePrediction(
    prediction: string,
    question_id: number | undefined,
    exam_id: string | undefined,
    student_id: number | undefined,
    question_number: number,
    prediction_id: number | undefined,
  ): void {
    if (this.blocked) return; // Ensure storePrediction is not called twice
    this.blocked = true;
    console.log('I am in storePrediction');

    const predictionData: IPrediction = {
      id: prediction_id,
      studentId: student_id,
      examId: exam_id,
      questionNumber: question_number,
      questionId: question_id,
      text: prediction,
      jsonData: '{"key": "value"}',
      zonegeneratedid: 'ZoneID123',
    };

    this.predictionService.update(predictionData).subscribe({
      next: createdResponse => {
        console.log('Successfully stored prediction');
        this.currentPrediction = createdResponse.body;
        this.loadPrediction();
        this.blocked = false; // Unblock after successful creation
      },
      error: createError => {
        console.error('Error storing hardcoded prediction:', createError);
        this.blocked = false; // Unblock UI even on error
      },
    });
  }

  createPrediction(
    question_id: number | undefined,
    exam_id: string | undefined,
    student_id: number | undefined,
    question_number: number,
    image_data: string,
  ): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      if (this.blocked) {
        resolve(undefined); // Exit if already blocked
        return;
      }

      this.blocked = true;
      console.log('I am in createPrediction');
      const predictionData: IPrediction = {
        studentId: student_id,
        examId: exam_id,
        questionNumber: question_number,
        questionId: question_id,
        text: 'En attente',
        jsonData: '{"key": "value"}',
        zonegeneratedid: 'ZoneID123',
        imageData: image_data,
      };

      this.predictionService.create(predictionData).subscribe({
        next: createdResponse => {
          console.log('Successfully created prediction');
          this.currentPrediction = createdResponse.body;
          const id = createdResponse.body?.id;
          console.log('Created prediction id', id);
          this.blocked = false; // Unblock after prediction creation
          resolve(id);
        },
        error: createError => {
          console.error('Error creating prediction:', createError);
          this.blocked = false;
          reject(createError);
        },
      });
    });
  }

  async loadPrediction() {
    try {
      console.log('I am trying to load prediction');
      const predictionResponse = await firstValueFrom(this.predictionService.query({ questionId: this.questionId }));
      const predictions = predictionResponse.body || [];
      console.log('Predictions fetched from backend:', predictions.length);

      // Find the first matching prediction
      this.currentPrediction = predictions.find(pred => pred.studentId === this.studentid) || null;

      if (this.currentPrediction) {
        this.deleted = false;
        console.log('Loaded current prediction:', this.currentPrediction);
      } else {
        console.warn('No valid predictions found for the current question index.');
      }
    } catch (err) {
      console.error('Error loading prediction:', err);
      this.currentPrediction = null; // Explicitly reset on error
    }
  }

  // Method to delete a prediction
  deletePrediction(id: number): void {
    if (confirm('Are you sure you want to delete this prediction?')) {
      this.predictionService.delete(id).subscribe({
        next: () => {
          this.deleted = true;
          this.currentPrediction = null;
          console.log(`Deleted prediction with id: ${id}`);
        },
        error: err => {
          console.error(`Error deleting prediction with id ${id}:`, err);
          alert(`Failed to delete prediction with id ${id}. Please try again.`);
        },
      });
    }
  }
}
