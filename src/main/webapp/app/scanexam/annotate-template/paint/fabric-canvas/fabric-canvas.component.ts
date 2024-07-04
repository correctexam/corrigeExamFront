/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  NgxExtendedPdfViewerService,
  PageRenderedEvent,
  ScrollModeType,
  NgxExtendedPdfViewerModule,
  PDFNotificationService,
  TextLayerRenderedEvent,
} from 'ngx-extended-pdf-viewer';
import { EventHandlerService } from '../event-handler.service';
import { DrawingTools } from '../models';
// import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { IExam } from 'app/entities/exam/exam.model';
import { ZoneService } from '../../../../entities/zone/service/zone.service';
import { IZone } from 'app/entities/zone/zone.model';
import { QuestionService } from '../../../../entities/question/service/question.service';
import { Subject, firstValueFrom } from 'rxjs';
import { Question } from 'app/entities/question/question.model';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { PreferenceService } from 'app/scanexam/preference-page/preference.service';
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//  suppressScrollX: true,
// };
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { DOCUMENT, NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { SummaryTemplateComponent } from '../../summary/summary-template.component';

export type CustomZone = IZone & { type: DrawingTools };

@Component({
  selector: 'jhi-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss'],
  providers: [
    NgxExtendedPdfViewerService,
    //    {
    //      provide: PERFECT_SCROLLBAR_CONFIG,
    //      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    //    },
  ],
  standalone: true,
  imports: [SummaryTemplateComponent, BlockUIModule, ProgressSpinnerModule, NgIf, NgxExtendedPdfViewerModule],
})
export class FabricCanvasComponent implements OnInit, OnDestroy {
  @Input()
  public content: any;

  @Input()
  public exam!: IExam;
  @Input()
  public numeroEvent!: Subject<string>;
  public zones: { [page: number]: CustomZone[] } = {};
  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  public examId = -1;
  public title = 'gradeScopeFree';
  // For locking the page during the pdf rendering
  protected blocked = false;
  public processpdf = false;

  constructor(
    public eventHandler: EventHandlerService,
    private activatedRoute: ActivatedRoute,
    private zoneService: ZoneService,
    private questionService: QuestionService,
    private examService: ExamService,
    private preferenceService: PreferenceService,
    private pdfViewerService: NgxExtendedPdfViewerService,
    private pdfNotificationService: PDFNotificationService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    //    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    pdfDefaultOptions.defaultCacheSize = 100;
    //    pdfDefaultOptions.textLayerMode = 0;
  }
  ngOnDestroy(): void {
    this.content = null;
    this.processpdf = false;

    this.eventHandler.cleanCanvassCache();
  }

  public ngOnInit(): void {
    this.eventHandler.reinit(this.exam, this.zones);
    this.activatedRoute.paramMap.subscribe(params => {
      this.examId = parseInt(params.get('examid') ?? '-1', 10);

      // Reacting on a change in a question
      this.numeroEvent.subscribe(numero => {
        this.eventHandler.addQuestion(parseInt(numero, 10));
      });
      //      this.pdfNotificationService.onPDFJSInit.subscribe(()=> {
      this.endInit().then(() => {
        this.processpdf = true;
        //      });
      });
    });
  }

  private async endInit(): Promise<void> {
    if (this.exam.namezoneId !== undefined) {
      const z = await firstValueFrom(this.zoneService.find(this.exam.namezoneId));
      const ezone = z.body as CustomZone;
      ezone.type = DrawingTools.NOMBOX;
      this.renderZone(ezone);
      // });
    }
    if (this.exam.firstnamezoneId !== undefined) {
      const z = await firstValueFrom(this.zoneService.find(this.exam.firstnamezoneId));
      const ezone = z.body as CustomZone;
      ezone.type = DrawingTools.PRENOMBOX;
      this.renderZone(ezone);
    }
    if (this.exam.idzoneId !== undefined) {
      const z = await firstValueFrom(this.zoneService.find(this.exam.idzoneId));
      const ezone = z.body as CustomZone;
      ezone.type = DrawingTools.INEBOX;
      this.renderZone(ezone);
    }
    const qs = await firstValueFrom(this.questionService.query({ examId: this.exam.id! }));

    if (qs.body?.length !== undefined && qs.body?.length > 0) {
      for (const q of qs.body) {
        if (q.id !== undefined) {
          this.eventHandler.questions.set(q.id, q);
        }
        const z = await firstValueFrom(this.zoneService.find(q.zoneId!));
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.QUESTIONBOX;
        this.renderZone(ezone);
      }
    }
  }

  private renderZone(zone: CustomZone): void {
    if (zone.pageNumber) {
      this.eventHandler.addZoneRendering(zone.pageNumber, zone);
    }
  }

  public pageRendered(evt: PageRenderedEvent): void {
    const page = evt.pageNumber;
    if (this.eventHandler.pages[page] === undefined) {
      this.eventHandler.initPage(page, evt.source);

      // Requires to update the canvas for each page if the pdf contains metadata to process
      if (this.eventHandler.getCanvasForPage(page) === undefined) {
        this.eventHandler.pages[page].updateCanvas(evt.source, this.document);
      }
      if (this.zones[page] !== undefined) {
        this.zones[page].forEach(z => {
          switch (z.type) {
            case DrawingTools.NOMBOX:
              this.eventHandler.createRedBox('scanexam.nomuc1', z, page);
              break;

            case DrawingTools.PRENOMBOX: {
              this.eventHandler.createRedBox('scanexam.prenomuc1', z, page);
              break;
            }
            case DrawingTools.INEBOX: {
              this.eventHandler.createRedBox('scanexam.ineuc1', z, page);
              break;
            }
            case DrawingTools.QUESTIONBOX: {
              this.eventHandler.createRedQuestionBox(z, page);
              break;
            }
          }
        });
      }
      if (this.pdfViewerService.isRenderQueueEmpty()) {
        this.loadingPdfMetadata(evt.source.scale);
      }
    } else {
      this.eventHandler.pages[page].updateCanvas(evt.source, this.document);

      if (this.zones[page] !== undefined) {
        this.zones[page].forEach(z => {
          switch (z.type) {
            case DrawingTools.NOMBOX:
              this.eventHandler.createRedBox('scanexam.nomuc1', z, page);
              break;

            case DrawingTools.PRENOMBOX: {
              this.eventHandler.createRedBox('scanexam.prenomuc1', z, page);
              break;
            }
            case DrawingTools.INEBOX: {
              this.eventHandler.createRedBox('scanexam.ineuc1', z, page);
              break;
            }
            case DrawingTools.QUESTIONBOX: {
              this.eventHandler.createRedQuestionBox(z, page);
              break;
            }
          }
        });
      }
      const c = this.eventHandler.getCanvasForPage(page);
      if (c === undefined) {
        if (this.pdfViewerService.isRenderQueueEmpty()) {
          this.loadingPdfMetadata(evt.source.scale);
        }
      }
    }
    if (this.pdfViewerService.isRenderQueueEmpty()) {
      this.blocked = false;
    }
  }

  foo(e: TextLayerRenderedEvent): void {
    e.source.textLayer?.div.remove();
  }

  pageRender(): void {
    this.blocked = true;
    if (this.runningTimer) {
      this.stopTimer();
      this.runningTimer = false;
    }
    this.timer = setTimeout(() => {
      if (this.blocked) {
        this.blocked = false;
      }
      this.runningTimer = false;
    }, 3000);
  }
  timer: any = 0;
  runningTimer = false;

  stopTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
  }

  goToQuestion(q: Question): void {
    if (q.zoneDTO?.pageNumber && q.zoneDTO?.yInit !== undefined && this.eventHandler.pages?.[1]) {
      this.eventHandler.selectQuestionView(q);
      const p = q.zoneDTO.pageNumber;
      const y = (q.zoneDTO.yInit! * this.eventHandler.pages[1].pageViewer.canvas.clientHeight) / 100000;
      this.scrollPageandTop(p, y);
    } else if (q.zoneId !== undefined) {
      this.zoneService.find(q.zoneId).subscribe(z => {
        const zoneDTO = z.body;
        if (zoneDTO?.pageNumber && zoneDTO?.yInit !== undefined && this.eventHandler.pages?.[1]) {
          const p = zoneDTO.pageNumber;
          const y = (zoneDTO.yInit! * this.eventHandler.pages[1].pageViewer.canvas.clientHeight) / 100000;
          this.scrollPageandTop(p, y);
        }
      });
      this.eventHandler.selectQuestionView(q);
    }
  }
  scrollPageandTop(page: number, top: number): void {
    this.pdfViewerService.scrollPageIntoView(page, { top, left: 0 });
  }

  public async loadingPdfMetadata(pdfScale: number): Promise<void> {
    const rects = await this.getCustomPdfProperties();
    const qs: Record<number, Array<Rect>> = {};
    let qnum = 0;
    const promises: Array<Promise<void>> = [];
    const zoomRatio = window.devicePixelRatio;

    rects.forEach(rect => {
      const rectFixed = scaleRect(rect, zoomRatio);

      switch (rectFixed.type) {
        case DrawingTools.INEBOX:
          if (this.exam.idzoneId === undefined) {
            promises.push(
              firstValueFrom(this.zoneService.create(this.createZone(rectFixed, pdfScale))).then(z1 => {
                this.exam.idzoneId = z1.body!.id!;
                this.renderZone(z1.body as CustomZone);
                this.eventHandler.createRedBox('scanexam.ineuc1', z1.body!, rectFixed.p);
              }),
            );
          }
          break;

        case DrawingTools.PRENOMBOX:
          if (this.exam.firstnamezoneId === undefined) {
            promises.push(
              firstValueFrom(this.zoneService.create(this.createZone(rectFixed, pdfScale))).then(z1 => {
                this.exam.firstnamezoneId = z1.body!.id!;
                this.renderZone(z1.body as CustomZone);
                this.eventHandler.createRedBox('scanexam.prenomuc1', z1.body!, rectFixed.p);
              }),
            );
          }
          break;

        case DrawingTools.NOMBOX:
          if (this.exam.namezoneId === undefined) {
            promises.push(
              firstValueFrom(this.zoneService.create(this.createZone(rectFixed, pdfScale))).then(z1 => {
                this.exam.namezoneId = z1.body!.id!;
                this.renderZone(z1.body as CustomZone);
                this.eventHandler.createRedBox('scanexam.nomuc1', z1.body!, rectFixed.p);
              }),
            );
          }
          break;

        case DrawingTools.QUESTIONBOX:
          qnum = rectFixed.q!;
          if (qs[qnum] === undefined) {
            qs[qnum] = [];
          }
          qs[qnum][rectFixed.subq! - 1] = rectFixed;
          break;
      }
    });

    // Once all the queries done, updating the exam
    Promise.all(promises).then(() => {
      this.updateExam();
    });

    const arrayquestions = Array.from(this.eventHandler.questions.values());
    for (const [key, value] of Object.entries(qs)) {
      qnum = parseInt(key, 10);

      if (arrayquestions.findIndex(q => q.numero === qnum) === -1) {
        value
          .filter(subq => subq !== undefined)
          .forEach(subq => {
            this.zoneService.create(this.createZone(subq, pdfScale)).subscribe(resz => {
              const zone = resz.body as CustomZone;
              zone.type = DrawingTools.QUESTIONBOX;
              const pref = this.preferenceService.getPreferenceForQuestion();
              const q = new Question();
              q.zoneId = zone.id!;
              q.examId = this.exam.id;
              q.typeId = pref.typeId;
              q.numero = subq.q;
              q.point = pref.point;
              q.step = pref.step;
              q.gradeType = pref.gradeType;
              if (subq.t === 'qcm') {
                q.typeId = 3;
              }
              this.questionService.create(q).subscribe(resq => {
                if (resq.body?.id !== undefined) {
                  this.eventHandler.questions.set(resq.body.id, resq.body);
                  this.renderZone(zone);
                  if (this.eventHandler.pages[subq.p] !== undefined) {
                    this.eventHandler.createRedQuestionBox(zone, subq.p);
                  }
                }
              });
            });
          });
      }
    }
  }

  private createZone(rect: Rect, scale: number): IZone {
    const ppc = 37.795275591;
    const canvas =
      this.eventHandler.getCanvasForPage(rect.p) !== undefined
        ? this.eventHandler.getCanvasForPage(rect.p)
        : this.eventHandler.getCanvasForPage(1);
    if (canvas === undefined) {
      return {
        pageNumber: rect.p,
        xInit: 0,
        yInit: 0,
        width: 1000,
        height: 1000,
      };
    }

    const width = canvas.width!;
    const height = canvas.height!;

    return {
      pageNumber: rect.p,
      xInit: Math.trunc(Math.floor((rect.x * ppc * this.eventHandler.coefficient) / width) * scale),
      yInit: Math.trunc(
        (Math.floor(rect.y * ppc * this.eventHandler.coefficient) / height -
          Math.floor(rect.h * ppc * this.eventHandler.coefficient) / height) *
          scale,
      ),
      width: Math.trunc(Math.floor((rect.w * ppc * this.eventHandler.coefficient) / width) * scale),
      height: Math.trunc((Math.floor(rect.h * ppc * this.eventHandler.coefficient) / height) * scale),
    };
  }

  private updateExam(): void {
    this.examService.update(this.exam).subscribe(e => {
      this.exam = e.body!;
    });
  }

  public async getCustomPdfProperties(): Promise<Array<Rect>> {
    const md = await (window as any).PDFViewerApplication.pdfDocument.getMetadata();
    const info = md.info;

    if (info.Custom === undefined) {
      return Promise.resolve([]);
    }

    return Object.keys(info.Custom)
      .map(key => toRect(key, info.Custom[key]))
      .filter((rect): rect is Rect => rect !== undefined);
  }
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
  type: DrawingTools;
  t?: string;
  q: number | undefined;
  subq: number | undefined;
}

function scaleRect(rect: Rect, ratio: number): Rect {
  return {
    x: rect.x,
    y: rect.y * ratio,
    w: rect.w,
    h: rect.h * ratio,
    p: rect.p,
    type: rect.type,
    q: rect.q,
    t: rect.t,
    subq: rect.subq,
  };
  // return rect;
}

function toRect(key: string, value: unknown): Rect | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  try {
    const r = JSON.parse(value) as Rect;
    const infos = key.split('-');
    const type = getDrawingTool(infos[1] ?? '');
    const q = parseInt(infos[2] ?? '', 10);
    const subq = parseInt(infos[3] ?? '', 10);

    if (
      type !== undefined &&
      infos[0] === 'correctexam' &&
      Number.isFinite(r.p) &&
      Number.isFinite(r.x) &&
      Number.isFinite(r.y) &&
      Number.isFinite(r.w) &&
      Number.isFinite(r.h)
    ) {
      return { ...r, type, q: Number.isFinite(q) ? q : undefined, subq: Number.isFinite(subq) ? subq : undefined };
    }
  } catch (ignore: unknown) {
    // nothing to do
  }
  return undefined;
}

function getDrawingTool(str: string): DrawingTools | undefined {
  switch (str) {
    case 'answer':
      return DrawingTools.QUESTIONBOX;
    case 'firstname':
      return DrawingTools.PRENOMBOX;
    case 'lastname':
      return DrawingTools.NOMBOX;
    case 'stdid':
      return DrawingTools.INEBOX;
  }

  return undefined;
}
