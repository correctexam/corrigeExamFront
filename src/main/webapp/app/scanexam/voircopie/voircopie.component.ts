/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */

import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
  HostListener,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { SwipeDirective, SwipeEvent } from '../swipe.directive';
import { NavigationPadComponent } from '../navigation-pad/navigation-pad.component';
import { NavigationAction } from '../navigation-pad/navigation-pad.model';
import { PreferenceService } from '../preference-page/preference.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { AlignImagesService } from '../services/align-images.service';
import { db } from '../db/dbstudent';
import { ImageZone, IPage } from '../associer-copies-etudiants/associer-copies-etudiants.model';
import { IZone } from 'app/entities/zone/zone.model';
import { IQuestion } from '../../entities/question/question.model';
import { IStudentResponse } from '../../entities/student-response/student-response.model';
import { EventCanevasVoirCopieHandlerService } from './event-canevasvoircopie-handler.service';
import { ZoneVoirCopieHandler } from './ZoneVoirCopieHandler';
import { GradeType } from '../../entities/enumerations/grade-type.model';
import { ITextComment } from '../../entities/text-comment/text-comment.model';
import { IGradedComment } from '../../entities/graded-comment/graded-comment.model';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { IHybridGradedCommentWithStepValue } from '../../entities/hybrid-graded-comment/hybrid-graded-comment.model';
import { ArraySortPipe } from '../sort';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { HasAnyAuthorityDirective } from '../../shared/auth/has-any-authority.directive';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonDirective } from 'primeng/button';
import { DecimalPipe } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { StudentSheetSource, StudentSheetSourceFactory } from '../student-portal/student-sheet-source';
import { IStudentSheetView } from '../student-portal/student-portal.model';
import { StudentSessionService } from '../student-portal/student-session.service';
import { parseCachedPage, questionNumerosOf, responseOf } from '../student-portal/student-sheet-view.util';

/**
 * Sheet of a student, question by question: through the UUID of a /copie link, or through the student portal
 * (/my/sheets/{sheetId}). Everything comes from one StudentSheetViewDTO and the pages of the sheet (ADR 0003).
 */
@Component({
  selector: 'jhi-voircopie',
  templateUrl: './voircopie.component.html',
  styleUrls: ['./voircopie.component.scss'],
  providers: [ConfirmationService, MessageService],
  standalone: true,
  imports: [
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
    GalleriaModule,
    PrimeTemplate,
    ButtonDirective,
    TooltipModule,
    PaginatorModule,
    RouterLink,
    HasAnyAuthorityDirective,
    ToggleSwitchModule,
    FormsModule,
    SliderModule,
    DecimalPipe,
    TranslateDirective,
    TranslatePipe,
    ArraySortPipe,
    SwipeDirective,
    NavigationPadComponent,
    MessageModule,
  ],
})
export class VoirCopieComponent implements OnInit, AfterViewInit {
  private readonly preferenceService = inject(PreferenceService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alignImagesService = inject(AlignImagesService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly eventHandler = inject(EventCanevasVoirCopieHandlerService);
  private readonly translateService = inject(TranslateService);
  private readonly sources = inject(StudentSheetSourceFactory);
  private readonly studentSession = inject(StudentSessionService);
  private readonly destroyRef = inject(DestroyRef);

  public href = '';

  @ViewChildren('nomImage')
  canvass!: QueryList<ElementRef>;
  showImage: boolean[] = [];
  nbreFeuilleParCopie: number | undefined;
  currentStudent = 0;
  selectionStudents: { name: string; firstname?: string | null }[] | undefined;
  questions: IQuestion[] | undefined;
  blocked = true;
  nbreQuestions = 1;
  currentNote = 0;
  noteSteps = 0;
  maxNote = 0;
  questionStep = 0;
  questionindex = 0;
  questionNumeros: Array<number> = [];
  resp: IStudentResponse | undefined;
  currentQuestion: IQuestion | undefined;
  noalign = false;
  factor = 1;
  source: StudentSheetSource | undefined;
  view: IStudentSheetView | undefined;
  /** The sheet could not be read (unknown link, closed portal session...). */
  loadError: 'notFound' | 'unavailable' | undefined;
  correctionLink: string | undefined;
  finalNote: number | null | undefined;
  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;
  currentHybridGradedComment4Question: IHybridGradedCommentWithStepValue[] | undefined;

  currentZoneVoirCopieHandler: ZoneVoirCopieHandler | undefined;
  scale = 1;
  windowWidth = 1;

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

  /** True in the student portal (links back to the list of sheets). */
  get inPortal(): boolean {
    return this.source?.persistentCache === false;
  }

  /** Answers, comments and grade are shown (false: exam published as the scanned sheet only). */
  get corrections(): boolean {
    return this.view?.corrections === true;
  }

  ngOnInit(): void {
    this.href = this.router.url;
    this.windowWidth = window.innerWidth;
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.blocked = true;
      this.currentNote = 0;
      this.noteSteps = 0;
      this.maxNote = 0;
      this.resp = undefined;
      this.currentTextComment4Question = [];
      this.currentGradedComment4Question = [];
      this.currentHybridGradedComment4Question = [];
      const source = this.sources.fromRoute(params);
      if (source === undefined) {
        this.fail('notFound');
        return;
      }
      this.questionindex = Math.max(0, +(params.get('questionno') ?? '1') - 1);
      this.load(source);
    });
  }

  /** Reads the view once per sheet (moving between questions only changes the route parameter). */
  private async load(source: StudentSheetSource): Promise<void> {
    if (this.source?.id !== source.id || this.view === undefined) {
      try {
        this.view = await firstValueFrom(source.view());
      } catch (e) {
        this.onReadError(e, source);
        return;
      }
    }
    this.source = source;
    this.loadError = undefined;
    const view = this.view;
    this.selectionStudents = view.students;
    this.currentStudent = view.sheetIndex;
    this.nbreFeuilleParCopie = view.pages;
    this.finalNote = view.corrections ? view.finalNote : undefined;
    this.correctionLink = '/answer/' + view.exam.id + '/' + (this.questionindex + 1) + '/' + (view.sheetIndex + 1);
    this.finalize();
    this.initEmail();
    this.populateBestSolutions();
  }

  private onReadError(e: unknown, source: StudentSheetSource): void {
    const status = e instanceof HttpErrorResponse ? e.status : 0;
    if (status === 401 && !source.persistentCache) {
      // Session of the portal expired on the server
      this.studentSession.close();
      this.router.navigate(['/my'], { queryParams: { expired: true } });
      return;
    }
    this.fail(status === 404 || status === 401 || status === 403 ? 'notFound' : 'unavailable');
  }

  private fail(error: 'notFound' | 'unavailable'): void {
    this.loadError = error;
    this.view = undefined;
    this.questions = [];
    this.blocked = false;
  }

  finalize(): void {
    this.images = [];
    this.blocked = false;
    const view = this.view!;
    this.questionNumeros = questionNumerosOf(view.questions);
    this.nbreQuestions = this.questionNumeros.length;
    if (this.questionindex >= this.nbreQuestions) {
      this.questionindex = Math.max(0, this.nbreQuestions - 1);
    }
    const numero = this.questionNumeros[this.questionindex];
    this.questions = view.questions.filter(q => q.numero === numero);
    this.showImage = new Array<boolean>(this.questions.length);
    if (this.questions.length === 0) {
      return;
    }
    this.noteSteps = this.questions[0].point! * this.questions[0].step!;
    this.questionStep = this.questions[0].step!;
    this.maxNote = this.questions[0].point!;
    this.currentQuestion = this.questions[0];
    this.resp = view.corrections ? responseOf(view.responses, this.questions) : undefined;
    if (this.resp === undefined) {
      this.currentNote = 0;
      this.currentTextComment4Question = [];
      this.currentGradedComment4Question = [];
      this.currentHybridGradedComment4Question = [];
      return;
    }
    this.currentNote = this.resp.note!;
    const first = this.questions[0];
    if (first.gradeType === GradeType.DIRECT && first.typeAlgoName !== 'QCM') {
      this.currentTextComment4Question = this.resp.textcomments ?? [];
    } else if (first.gradeType === GradeType.HYBRID && first.typeAlgoName !== 'QCM') {
      this.currentTextComment4Question = [];
      this.currentGradedComment4Question = [];
      this.currentHybridGradedComment4Question = (view.hybridComments[String(this.resp.id)] ?? []).map(c => ({ ...c }));
    } else {
      this.currentGradedComment4Question = this.resp.gradedcomments ?? [];
    }
  }

  ngAfterViewInit(): void {
    this.canvass.changes.subscribe(() => {
      this.reloadImage();
      this.changeDetector.detectChanges();
    });
  }

  reloadImage() {
    this.images = [];
    this.questions!.forEach((q, i) => {
      this.showImage[i] = false;
      this.loadZone(
        q.zoneDTO,
        b => {
          this.showImage[i] = b;
        },
        this.canvass.get(i),
        this.currentStudent,
        i,
      );
    });
  }

  checked(comment: ITextComment | IGradedComment): boolean {
    return (comment as any).checked;
  }

  getStyle(comment: ITextComment | IGradedComment): any {
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
  onPreviousQuestionKey(event: KeyboardEvent): void {
    event.preventDefault();
    this.previousQuestion();
  }

  @HostListener('window:keydown.shift.ArrowRight', ['$event'])
  onNextQuestionKey(event: KeyboardEvent): void {
    event.preventDefault();
    this.nextQuestion();
  }

  previousQuestion(): void {
    const q = this.questionindex;
    if (q > 0 && this.source) {
      this.router.navigateByUrl(this.source.questionLink(q));
    }
  }

  nextQuestion(): void {
    const q = this.questionindex + 2;
    if (q <= this.nbreQuestions && this.source) {
      this.router.navigateByUrl(this.source.questionLink(q));
    }
  }

  /** Glissement sur toute la page, selon la préférence de navigation tactile (issue #657). */
  get swipeOnPage(): boolean {
    return this.preferenceService.touchNavigation()().swipeOnPage;
  }

  /** Vue étudiant : seul le glissement horizontal navigue (gauche : question suivante), le vertical fait défiler. */
  onSwipeEnd(event: SwipeEvent): void {
    if (event.direction !== 'x') {
      return;
    }
    if (event.distance < 0) {
      this.nextQuestion();
    } else {
      this.previousQuestion();
    }
  }

  onNavigationPad(action: NavigationAction): void {
    if (action === 'nextQuestion' || action === 'nextStudent') {
      this.nextQuestion();
    } else {
      this.previousQuestion();
    }
  }

  changeQuestion($event: any): void {
    this.questionindex = $event.page;
    if (this.source) {
      this.router.navigateByUrl(this.source.questionLink(this.questionindex + 1));
    }
  }

  async loadZone(
    zone: IZone | undefined,
    showImageRef: (s: boolean) => void,
    imageRef: ElementRef<any> | undefined,
    currentStudent: number,
    index: number,
  ): Promise<IZone | undefined> {
    return new Promise<IZone | undefined>(resolve => {
      if (zone) {
        this.getAllImage4Zone(zone.pageNumber!, zone).then(
          p => {
            this.displayImage(p, imageRef, showImageRef, index);
            resolve(zone);
          },
          () => resolve(undefined),
        );
      } else {
        resolve(undefined);
      }
    });
  }

  displayImage(v: ImageZone, imageRef: ElementRef<any> | undefined, show: (s: boolean) => void, index: number): void {
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

      const numero = this.questionNumeros[this.questionindex];
      const zoneid = this.source!.id + '_' + numero + '_' + index;
      if (this.currentZoneVoirCopieHandler?.zoneid === zoneid) {
        this.currentZoneVoirCopieHandler.updateCanvas(imageRef.nativeElement);
      } else {
        const annotation = this.view?.annotations?.[numero + '_' + index];
        const zh = new ZoneVoirCopieHandler(zoneid, this.eventHandler, this.resp?.id, annotation);
        zh.updateCanvas(imageRef.nativeElement);
        this.currentZoneVoirCopieHandler = zh;
      }
    }
  }

  /** Zone of page `page` (from 1) of the sheet, cropped from the page of the cache. */
  async getAllImage4Zone(page: number, zone: IZone): Promise<ImageZone> {
    const body = await this.readPage(page);
    const image = parseCachedPage(body);
    this.images.push({
      src: image.pages,
      alt: 'Page ' + page,
      title: 'Exam',
    });
    return new Promise(resolve => this.loadImage1(image, page, zone, resolve));
  }

  /** Page of the sheet; with a /copie link the pages are kept in the IndexedDB of the browser, as before. */
  private async readPage(page: number): Promise<string> {
    const source = this.source!;
    if (!source.persistentCache) {
      return firstValueFrom(source.page(page, this.noalign));
    }
    // Same keys as before: exam and page in the scan (from 1)
    const examId = this.view!.exam.id;
    const pageInScan = this.currentStudent * this.nbreFeuilleParCopie! + page;
    const cached = this.noalign ? await db.getFirstNonAlignImage(examId, pageInScan) : await db.getFirstAlignImage(examId, pageInScan);
    if (cached !== undefined) {
      return cached.value;
    }
    const body = await firstValueFrom(source.page(page, this.noalign));
    const entry = { examId, pageNumber: pageInScan, value: body };
    await (this.noalign ? db.addNonAligneImage(entry) : db.addAligneImage(entry));
    return body;
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
      if (finalW + initX > v.image!.width) {
        finalW = v.image!.width - initX;
      }

      let initY =
        (zone.yInit! * v.height!) / 100000 - ((zone.height! * v.height! * this.factor) / 100000 - (zone.height! * v.height!) / 100000) / 2;
      if (initY < 0) {
        finalH = finalH + initY;
        initY = 0;
      }
      if (finalH + initY > v.image!.height) {
        finalH = v.image!.height - initY;
      }

      this.alignImagesService
        .imageCrop({
          image: v.image!.data.buffer,
          imageWidth: v.image!.width,
          imageHeight: v.image!.height,
          x: initX,
          y: initY,
          width: finalW,
          height: finalH,
        })
        .subscribe(res =>
          resolve({
            i: new ImageData(new Uint8ClampedArray(res), finalW, finalH),
            w: finalW,
            h: finalH,
          }),
        );
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

  email: string = '';

  initEmail(): void {
    const view = this.view;
    const emails = view?.contactEmails.filter(e => e !== '') ?? [];
    if (view === undefined || !view.corrections || emails.length === 0 || this.questions === undefined || this.questions.length === 0) {
      this.email = '';
      return;
    }
    const firsName = view.students[0]?.firstname ?? '';
    const lastName = view.students[0]?.name ?? '';
    const examName = view.exam.name;
    const questionNumero = this.questions[0].numero!;
    const url = window.location.href;
    let emailSubject: string;
    let emailBody: string;

    if (this.translateService.currentLang === 'fr') {
      emailSubject = "Retour sur l'examen ";
      emailBody = frenchMessageBody(firsName, lastName, examName, questionNumero, url);
    } else if (this.translateService.currentLang === 'pt') {
      emailSubject = 'Esclarecimentos sobre a avaliacao ';
      emailBody = portugueseMessageBody(firsName, lastName, examName, questionNumero, url);
    } else {
      emailSubject = 'Review of the on your exam ';
      emailBody = englishMessageBody(firsName, lastName, examName, questionNumero, url);
    }

    this.email = 'mailto:' + emails.join(',') + '?subject=' + emailSubject + examName + '&body=' + emailBody;
  }

  bestSolutions: string[] = [];

  /** Links to the starred answers to the question, by index: the other sheets stay unknown. */
  populateBestSolutions(): void {
    this.bestSolutions = [];
    const source = this.source;
    const numero = this.questionNumeros[this.questionindex];
    if (source === undefined || !this.corrections || numero === undefined) {
      return;
    }
    source
      .countBestAnswers(numero)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: count => (this.bestSolutions = Array.from({ length: count }, (_, i) => source.bestAnswerLink(numero, i))),
        error: () => (this.bestSolutions = []),
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.displayBasic = false;
    const old = this.windowWidth;
    this.windowWidth = event.target.innerWidth;
    if (old / event.target.innerWidth > 1.15 || old / event.target.innerWidth < 0.85) {
      this.reloadImage();
    }
  }

  showGalleria(): void {
    this.displayBasic = true;
  }
}

function englishMessageBody(firsName: string, lastName: string, examName: string, questionNumero: number, url: string) {
  return `Dear Prof,%0D%0A
My name is ${firsName} ${lastName},%0D%0A
I have the exam ${examName}. Looking at the answer key for this question ${questionNumero} available here (${url}), I could not understand my mistake.%0D%0A
%0D%0A%0D%0A
///EXPLAIN YOUR PROBLEM///%0D%0A
%0D%0A%0D%0A
Thank you in advance for the time taken to answer this email.%0D%0A
Best regards,%0D%0A
${firsName}
`;
}

function frenchMessageBody(firsName: string, lastName: string, examName: string, questionNumero: number, url: string) {
  return `Bonjour,%0D%0A
je m'appelle ${firsName} ${lastName},%0D%0A
J'ai passé l'examen ${examName}. En regardant le corrigé de la question ${questionNumero} accessible ici (${url}), je ne comprends pas mon erreur.%0D%0A
%0D%0A%0D%0A
///EXPLIQUER VOTRE PROBLEME///%0D%0A
%0D%0A%0D%0A
Merci par avance pour le temps pris pour répondre à cet email.%0D%0A
Cordialement,%0D%0A
${firsName}
`;
}

function portugueseMessageBody(firsName: string, lastName: string, examName: string, questionNumero: number, url: string) {
  return `Caro professor, %0D%0A

Eu me chamo ${firsName} ${lastName}  e fiz a prova ${examName}.
Após uma ampla e detalhada análise da correção da questão ${questionNumero}, disponível aqui (${url}), eu não consegui entender o meu erro.%0D%0A

%0D%0A%0D%0A
///EXPLIQUE SEU PROBLEMA///%0D%0A
%0D%0A%0D%0A

Desde já agradeço pelo tempo dedicado a responder este email.%0D%0A

Atenciosamente,%0D%0A
${firsName}
`;
}
