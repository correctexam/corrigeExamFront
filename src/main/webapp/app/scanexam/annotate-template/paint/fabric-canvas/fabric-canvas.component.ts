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
import { QuestionTypeService } from 'app/entities/question-type/service/question-type.service';
import { IdentityZoneKind } from 'app/entities/exam/service/exam.service';
import { MetadataRect, metadataRectToZone, PageSizeCm, pageSizeCm, parsePdfZoneMetadata, questionTypeFor } from '../../pdf-zone-metadata';
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//  suppressScrollX: true,
// };
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { DOCUMENT } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { DeleteQuestionRequest, SummaryTemplateComponent } from '../../summary/summary-template.component';

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
  imports: [SummaryTemplateComponent, BlockUIModule, ProgressSpinnerModule, NgxExtendedPdfViewerModule],
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
    private questionTypeService: QuestionTypeService,
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
    if (this.exam.namezoneId !== undefined && this.exam.namezoneId !== null) {
      const z = await firstValueFrom(this.zoneService.find(this.exam.namezoneId));
      const ezone = z.body as CustomZone;
      ezone.type = DrawingTools.NOMBOX;
      this.renderZone(ezone);
      // });
    }
    if (this.exam.firstnamezoneId !== undefined && this.exam.firstnamezoneId !== null) {
      const z = await firstValueFrom(this.zoneService.find(this.exam.firstnamezoneId));
      const ezone = z.body as CustomZone;
      ezone.type = DrawingTools.PRENOMBOX;
      this.renderZone(ezone);
    }

    if (this.exam.idzoneId !== undefined && this.exam.idzoneId !== null) {
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
        (this.eventHandler.pages[page] as any).updateCanvas(evt.source, this.document);
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
        this.loadingPdfMetadata().catch((e: unknown) => console.error('Zones of the template metadata not created', e));
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
          this.loadingPdfMetadata().catch((e: unknown) => console.error('Zones of the template metadata not created', e));
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
    /*    this.blocked = true;
    console.error('page rendered',this.runningTimer)
    if (this.runningTimer) {
      this.stopTimer();
      this.runningTimer = false;
    }
    this.timer = setTimeout(() => {
      if (this.blocked) {
        this.blocked = false;
        console.error('blocked true')
      }
      this.runningTimer = false;
    }, 300);*/
  }
  /**  timer: any = 0;
  runningTimer = false;*/

  /* stopTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
  }*/

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
  /**
   * Deletes the zone of a question from the summary panel (issue #655).
   */
  deleteQuestion(request: DeleteQuestionRequest): void {
    this.eventHandler.deleteQuestionZone(request.question).finally(() => request.done());
  }

  scrollPageandTop(page: number, top: number): void {
    this.pdfViewerService.scrollPageIntoView(page, { top, left: 0 });
  }

  /**
   * Zones described in the information dictionary of the template PDF (`correctexam-*` entries, see
   * `pdf-zone-metadata.ts`), created when the template is opened: identity zones the exam does not have yet, answer
   * zones and questions whose number does not exist yet. Positions come from the size of the PDF page, never from
   * the screen; question types are found by name.
   */
  public async loadingPdfMetadata(): Promise<void> {
    const app = this.pdfNotificationService.onPDFJSInitSignal();
    if (!app) {
      return;
    }
    const pdfDocument = app.pdfDocument;
    const rects = parsePdfZoneMetadata(((await pdfDocument.getMetadata()).info as { Custom?: unknown }).Custom);
    if (rects.length === 0) {
      return;
    }
    const sizes = new Map<number, PageSizeCm>();
    const zoneOf = async (rect: MetadataRect): Promise<IZone> => {
      let size = sizes.get(rect.p);
      if (size === undefined) {
        const viewport = (await pdfDocument.getPage(rect.p)).getViewport({ scale: 1 });
        size = pageSizeCm(viewport.width, viewport.height);
        sizes.set(rect.p, size);
      }
      return metadataRectToZone(rect, size);
    };
    const qs: Record<number, MetadataRect[]> = {};
    const promises: Promise<void>[] = [];
    const identity = (rect: MetadataRect, kind: IdentityZoneKind, label: string, assign: (id: number) => void): void => {
      promises.push(
        zoneOf(rect)
          .then(zone => firstValueFrom(this.zoneService.create(zone)))
          .then(async z1 => {
            assign(z1.body!.id!);
            await firstValueFrom(this.examService.setIdentityZone(this.exam.id!, kind, z1.body!.id!));
            this.renderZone(z1.body as CustomZone);
            this.eventHandler.createRedBox(label, z1.body!, rect.p);
          }),
      );
    };

    rects.forEach(rect => {
      switch (rect.type) {
        case DrawingTools.INEBOX:
          if (this.exam.idzoneId === undefined) {
            identity(rect, 'INE', 'scanexam.ineuc1', id => (this.exam.idzoneId = id));
          }
          break;
        case DrawingTools.PRENOMBOX:
          if (this.exam.firstnamezoneId === undefined) {
            identity(rect, 'FIRSTNAME', 'scanexam.prenomuc1', id => (this.exam.firstnamezoneId = id));
          }
          break;
        case DrawingTools.NOMBOX:
          if (this.exam.namezoneId === undefined) {
            identity(rect, 'NAME', 'scanexam.nomuc1', id => (this.exam.namezoneId = id));
          }
          break;
        case DrawingTools.QUESTIONBOX:
          (qs[rect.q!] ??= [])[rect.subq! - 1] = rect;
          break;
      }
    });

    // Each identity zone is saved on its own (T24): no full update of the exam, which could erase another zone
    Promise.all(promises).catch((e: unknown) => console.error('Identity zones of the template not all saved', e));

    const arrayquestions = Array.from(this.eventHandler.questions.values());
    const missing = Object.entries(qs).filter(([key]) => arrayquestions.findIndex(q => q.numero === parseInt(key, 10)) === -1);
    if (missing.length === 0) {
      return;
    }
    // ids of the question types differ between databases: found by name, as in the question properties
    const types = (await firstValueFrom(this.questionTypeService.query())).body ?? [];
    const pref = this.preferenceService.getPreferenceForQuestion();
    for (const [, value] of missing) {
      for (const subq of value.filter(r => r !== undefined)) {
        const typeId = questionTypeFor(subq, types, pref.typeId);
        if (typeId === undefined) {
          console.error(`Question ${subq.q}: question type ${subq.t === 'qcm' ? 'QCM' : 'manual'} missing from the database`);
          continue;
        }
        const zone = (await firstValueFrom(this.zoneService.create(await zoneOf(subq)))).body as CustomZone;
        zone.type = DrawingTools.QUESTIONBOX;
        const q = new Question();
        q.zoneId = zone.id!;
        q.examId = this.exam.id;
        q.typeId = typeId;
        q.numero = subq.q;
        q.point = pref.point;
        q.step = pref.step;
        q.gradeType = pref.gradeType;
        q.canBeNegative = false;
        q.canExceedTheMax = false;
        q.mustBeIgnoreInGlobalScale = false;
        const resq = await firstValueFrom(this.questionService.create(q));
        if (resq.body?.id !== undefined) {
          this.eventHandler.questions.set(resq.body.id, resq.body);
          this.renderZone(zone);
          if (this.eventHandler.pages[subq.p] !== undefined) {
            this.eventHandler.createRedQuestionBox(zone, subq.p);
          }
        }
      }
    }
  }
}
