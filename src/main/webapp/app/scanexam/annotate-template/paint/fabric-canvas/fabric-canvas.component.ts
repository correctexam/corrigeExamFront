/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { NgxExtendedPdfViewerService, PageRenderedEvent, ScrollModeType } from 'ngx-extended-pdf-viewer';
import { EventHandlerService } from '../event-handler.service';
import { DrawingTools } from '../models';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { IExam } from 'app/entities/exam/exam.model';
import { ZoneService } from '../../../../entities/zone/service/zone.service';
import { IZone } from 'app/entities/zone/zone.model';
import { QuestionService } from '../../../../entities/question/service/question.service';
import { Subject } from 'rxjs';
import { IQuestion, Question } from 'app/entities/question/question.model';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { PreferenceService } from 'app/scanexam/preference-page/preference.service';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

export type CustomZone = IZone & { type: DrawingTools };

@Component({
  selector: 'jhi-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss'],
  providers: [
    NgxExtendedPdfViewerService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class FabricCanvasComponent implements OnInit {
  @Input()
  public content: any;
  @Input()
  public exam!: IExam;
  @Input()
  public numeroEvent!: Subject<string>;
  public zones: { [page: number]: CustomZone[] } = {};
  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  public questions: Map<number, IQuestion> = new Map();
  public examId = -1;
  public title = 'gradeScopeFree';

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventHandler: EventHandlerService,
    private zoneService: ZoneService,
    private questionService: QuestionService,
    private examService: ExamService,
    private preferenceService: PreferenceService,
    private pdfViewerService: NgxExtendedPdfViewerService
  ) {}

  public ngOnInit(): void {
    this.eventHandler.reinit(this.exam, this.zones);

    this.eventHandler.registerOnQuestionAddRemoveCallBack((qid, add) => {
      if (add) {
        this.getQuestion(qid);
      } else {
        this.questions.delete(qid);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.eventHandler.nextQuestionNumeros = Array.from(this.questions).map(([key, value]) => value.numero!);
      }
    });

    this.activatedRoute.paramMap.subscribe(params => {
      this.examId = parseInt(params.get('examid') ?? '-1', 10);

      // Reacting on a change in a question
      this.numeroEvent.subscribe(numero => {
        this.getQuestion(parseInt(numero, 10));
      });
    });

    if (this.exam.namezoneId !== undefined) {
      this.zoneService.find(this.exam.namezoneId).subscribe(z => {
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.NOMBOX;
        this.renderZone(ezone);
      });
    }
    if (this.exam.firstnamezoneId !== undefined) {
      this.zoneService.find(this.exam.firstnamezoneId).subscribe(z => {
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.PRENOMBOX;
        this.renderZone(ezone);
      });
    }
    if (this.exam.idzoneId !== undefined) {
      this.zoneService.find(this.exam.idzoneId).subscribe(z => {
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.INEBOX;
        this.renderZone(ezone);
      });
    }
    this.questionService.query({ examId: this.exam.id! }).subscribe(qs => {
      qs.body?.forEach(q => {
        if (q.id !== undefined) {
          this.questions.set(q.id, q);
        }
        this.zoneService.find(q.zoneId!).subscribe(z => {
          const ezone = z.body as CustomZone;
          ezone.type = DrawingTools.QUESTIONBOX;
          this.renderZone(ezone);
        });
      });
    });
  }

  private renderZone(zone: CustomZone): void {
    if (zone.pageNumber) {
      this.eventHandler.addZoneRendering(zone.pageNumber, zone);
    }
  }

  /**
   * Getting the questions corresponding to the given number (REST query) and adding them to `questions`
   */
  private getQuestion(numero: number): void {
    this.questionService.query({ examId: this.examId, numero }).subscribe(qs => {
      qs.body?.forEach(q => {
        if (q.id !== undefined) {
          this.questions.set(q.id, q);
        }
      });
      this.eventHandler.nextQuestionNumeros = Array.from(this.questions).map(([, value]) => value.numero!);
    });
  }

  public pageRendered(evt: PageRenderedEvent): void {
    const page = evt.pageNumber;

    this.eventHandler.initPage(page, evt.source);

    // Requires to update the canvas for each page if the pdf contains metadata to process
    if (this.eventHandler.getCanvasForPage(page) === undefined) {
      this.eventHandler.pages[page].updateCanvas(evt.source);
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

    // Loading the metadata after having rendered all the pages
    // to have all the canvases up to date.
    if (this.pdfViewerService.isRenderQueueEmpty()) {
      this.loadingPdfMetadata();
    }
  }

  public async loadingPdfMetadata(): Promise<void> {
    const rects = await this.getCustomPdfProperties();
    const qs: Record<number, Array<Rect>> = {};
    let qnum = 0;

    rects.forEach(rect => {
      switch (rect.type) {
        case DrawingTools.INEBOX:
          if (this.exam.idzoneId === undefined) {
            this.zoneService.create(this.createZone(rect)).subscribe(z1 => {
              this.exam.idzoneId = z1.body!.id!;
              // maybe only one time if one modification
              this.updateExam();
              this.renderZone(z1.body as CustomZone);
              this.eventHandler.createRedBox('scanexam.ineuc1', z1.body!, rect.p);
            });
          }
          break;

        case DrawingTools.PRENOMBOX:
          if (this.exam.firstnamezoneId === undefined) {
            this.zoneService.create(this.createZone(rect)).subscribe(z1 => {
              this.exam.firstnamezoneId = z1.body!.id!;
              // maybe only one time if one modification
              this.updateExam();
              this.renderZone(z1.body as CustomZone);
              this.eventHandler.createRedBox('scanexam.prenomuc1', z1.body!, rect.p);
            });
          }
          break;

        case DrawingTools.NOMBOX:
          if (this.exam.namezoneId === undefined) {
            this.zoneService.create(this.createZone(rect)).subscribe(z1 => {
              this.exam.namezoneId = z1.body!.id!;
              // maybe only one time if one modification
              this.updateExam();
              this.renderZone(z1.body as CustomZone);
              this.eventHandler.createRedBox('scanexam.nomuc1', z1.body!, rect.p);
            });
          }
          break;

        case DrawingTools.QUESTIONBOX:
          qnum = rect.q!;
          if (qs[qnum] === undefined) {
            qs[qnum] = [];
          }
          qs[qnum][rect.subq! - 1] = rect;
          break;
      }
    });

    const arrayquestions = Array.from(this.questions.values());
    for (const [key, value] of Object.entries(qs)) {
      qnum = parseInt(key, 10);

      if (arrayquestions.findIndex(q => q.numero === qnum) === -1) {
        value
          .filter(subq => subq !== undefined)
          .forEach(subq => {
            this.zoneService.create(this.createZone(subq)).subscribe(resz => {
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

              this.questionService.create(q).subscribe(resq => {
                if (resq.body?.id !== undefined) {
                  this.questions.set(resq.body.id, q);
                  this.renderZone(zone);
                  this.eventHandler.createRedQuestionBox(zone, subq.p);
                }
              });
            });
          });
      }
    }
  }

  private createZone(rect: Rect): IZone {
    const ppc = 37.795275591;
    const canvas = this.eventHandler.getCanvasForPage(rect.p);

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
      xInit: Math.trunc(Math.floor((rect.x * ppc * this.eventHandler.coefficient) / width)),
      yInit: Math.trunc(
        Math.floor(rect.y * ppc * this.eventHandler.coefficient) / height -
          Math.floor(rect.h * ppc * this.eventHandler.coefficient) / height
      ),
      width: Math.trunc(Math.floor((rect.w * ppc * this.eventHandler.coefficient) / width)),
      height: Math.trunc(Math.floor(rect.h * ppc * this.eventHandler.coefficient) / height),
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
  q: number | undefined;
  subq: number | undefined;
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
