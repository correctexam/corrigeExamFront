/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
import { AfterViewInit, Component, Inject, Input, NgZone } from '@angular/core';
import { NgxExtendedPdfViewerService, ScrollModeType } from 'ngx-extended-pdf-viewer';
import { EventHandlerService } from '../event-handler.service';
import { DrawingTools, DrawingColours } from '../models';
import { PageHandler } from './PageHandler';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import PerfectScrollbar from 'perfect-scrollbar';
import { IExam } from 'app/entities/exam/exam.model';
import { ZoneService } from '../../../../entities/zone/service/zone.service';
import { IZone } from 'app/entities/zone/zone.model';
import { FabricShapeService } from '../shape.service';
import { QuestionService } from '../../../../entities/question/service/question.service';
import { Subject } from 'rxjs';
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
export class FabricCanvasComponent implements AfterViewInit {
  @Input()
  content: any;
  @Input()
  exam!: IExam;

  @Input()
  numeroEvent!: Subject<string>;

  zones: { [page: number]: CustomZone[] } = {};

  title = 'gradeScopeFree';
  public scrollbar: any = undefined;

  constructor(
    private eventHandler: EventHandlerService,
    private ngZone: NgZone,
    @Inject(PERFECT_SCROLLBAR_CONFIG)
    public config: PerfectScrollbarConfigInterface,
    public zoneService: ZoneService,
    public fabricShapeService: FabricShapeService,
    public questionService: QuestionService
  ) {}

  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  ngOnInit(): void {
    this.eventHandler.exam = this.exam;
    if (this.exam.namezoneId !== undefined) {
      this.zoneService.find(this.exam.namezoneId!).subscribe(z => {
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.NOMBOX;
        if (!this.zones[z.body!.pageNumber!]) {
          this.zones[ezone.pageNumber!] = [];
        }
        this.zones[ezone.pageNumber!].push(ezone);
      });
    }
    if (this.exam.firstnamezoneId !== undefined) {
      this.zoneService.find(this.exam.firstnamezoneId!).subscribe(z => {
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.PRENOMBOX;
        if (!this.zones[z.body!.pageNumber!]) {
          this.zones[ezone.pageNumber!] = [];
        }
        this.zones[ezone.pageNumber!].push(ezone);
      });
    }
    if (this.exam.idzoneId !== undefined) {
      this.zoneService.find(this.exam.idzoneId!).subscribe(z => {
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.INEBOX;
        if (!this.zones[z.body!.pageNumber!]) {
          this.zones[ezone.pageNumber!] = [];
        }
        this.zones[ezone.pageNumber!].push(ezone);
      });
    }
    this.questionService.query({ examId: this.exam.id! }).subscribe(qs => {
      qs.body?.forEach(q => {
        this.zoneService.find(q.zoneId!).subscribe(z => {
          const ezone = z.body as CustomZone;
          ezone.type = DrawingTools.QUESTIONBOX;
          if (!this.zones[z.body!.pageNumber!]) {
            this.zones[ezone.pageNumber!] = [];
          }
          this.zones[ezone.pageNumber!].push(ezone);
        });
      });
    });
  }
  public ngAfterViewInit(): void {
    const container = document.querySelector('#viewerContainer');
    this.scrollbar = new PerfectScrollbar(container!, this.config);

    const sidebar = document.querySelector('#thumbnailView') as HTMLElement;
    if (sidebar) {
      this.scrollbar = new PerfectScrollbar(sidebar, this.config);
    }
  }

  pageRendered(evt: any) {
    const page = evt.pageNumber;
    if (!this.eventHandler.pages[page]) {
      const pageHandler = new PageHandler(evt.source, page, this.eventHandler);
      this.eventHandler.pages[page] = pageHandler;
    }

    const canvas = this.eventHandler.pages[page].updateCanvas(evt.source);
    if (this.zones[page] !== undefined) {
      this.zones[page].forEach(z => {
        switch (z.type) {
          case DrawingTools.NOMBOX: {
            const r = this.fabricShapeService.createBoxFromScratch(
              canvas,
              {
                x: (z.xInit! * this.eventHandler.pages[page].pageViewer.canvas.clientWidth) / 100000,
                y: (z.yInit! * this.eventHandler.pages[page].pageViewer.canvas.clientHeight) / 100000,
              },
              (z.width! * this.eventHandler.pages[page].pageViewer.canvas.clientWidth) / 100000,
              (z.height! * this.eventHandler.pages[page].pageViewer.canvas.clientHeight) / 100000,
              'Nom',
              DrawingColours.RED
            );
            this.eventHandler.modelViewpping.set(r.id, z.id!);
            break;
          }
          case DrawingTools.PRENOMBOX: {
            const r = this.fabricShapeService.createBoxFromScratch(
              canvas,
              {
                x: (z.xInit! * this.eventHandler.pages[page].pageViewer.canvas.clientWidth) / 100000,
                y: (z.yInit! * this.eventHandler.pages[page].pageViewer.canvas.clientHeight) / 100000,
              },
              (z.width! * this.eventHandler.pages[page].pageViewer.canvas.clientWidth) / 100000,
              (z.height! * this.eventHandler.pages[page].pageViewer.canvas.clientHeight) / 100000,
              'Prénom',
              DrawingColours.RED
            );
            this.eventHandler.modelViewpping.set(r.id, z.id!);
            break;
          }
          case DrawingTools.INEBOX: {
            const r = this.fabricShapeService.createBoxFromScratch(
              canvas,
              {
                x: (z.xInit! * this.eventHandler.pages[page].pageViewer.canvas.clientWidth) / 100000,
                y: (z.yInit! * this.eventHandler.pages[page].pageViewer.canvas.clientHeight) / 100000,
              },
              (z.width! * this.eventHandler.pages[page].pageViewer.canvas.clientWidth) / 100000,
              (z.height! * this.eventHandler.pages[page].pageViewer.canvas.clientHeight) / 100000,
              'INE',
              DrawingColours.RED
            );
            this.eventHandler.modelViewpping.set(r.id, z.id!);
            break;
          }
          case DrawingTools.QUESTIONBOX: {
            this.questionService.query({ zoneId: z.id }).subscribe(e => {
              if (e.body !== undefined && e.body!.length > 0) {
                const r = this.fabricShapeService.createBoxFromScratch(
                  canvas,
                  {
                    x: (z.xInit! * this.eventHandler.pages[page].pageViewer.canvas.clientWidth) / 100000,
                    y: (z.yInit! * this.eventHandler.pages[page].pageViewer.canvas.clientHeight) / 100000,
                  },
                  (z.width! * this.eventHandler.pages[page].pageViewer.canvas.clientWidth) / 100000,
                  (z.height! * this.eventHandler.pages[page].pageViewer.canvas.clientHeight) / 100000,
                  'Question ' + e.body![0].numero,
                  DrawingColours.GREEN
                );
                this.eventHandler.modelViewpping.set(r.id, z.id!);
                if (this.eventHandler.nextQuestionNumero <= e.body![0].numero!) {
                  this.eventHandler.nextQuestionNumero = this.eventHandler.nextQuestionNumero + 1;
                }
              }
            });

            break;
          }
        }
      });
    }
  }
}
