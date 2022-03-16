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
import { CustomFabricObject, DrawingTools, DrawingColours } from '../models';
import { PageHandler } from './PageHandler';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import PerfectScrollbar from 'perfect-scrollbar';
import { IExam } from 'app/entities/exam/exam.model';
import { ZoneService } from '../../../../entities/zone/service/zone.service';
import { IZone } from 'app/entities/zone/zone.model';
import { FabricShapeService } from '../shape.service';
import { QuestionService } from '../../../../entities/question/service/question.service';
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
  pages: { [page: number]: PageHandler } = {};
  zones: { [page: number]: CustomZone[] } = {};

  title = 'gradeScopeFree';
  public scrollbar: any = undefined;

  constructor(
    private pdfService: NgxExtendedPdfViewerService,
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
        if (!this.zones[z.body!.page!]) {
          this.zones[ezone.page!] = [];
        }
        this.zones[ezone.page!].push(ezone);
      });
    }
    if (this.exam.firstnamezoneId !== undefined) {
      this.zoneService.find(this.exam.firstnamezoneId!).subscribe(z => {
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.PRENOMBOX;
        if (!this.zones[z.body!.page!]) {
          this.zones[ezone.page!] = [];
        }
        this.zones[ezone.page!].push(ezone);
      });
    }
    if (this.exam.idzoneId !== undefined) {
      this.zoneService.find(this.exam.idzoneId!).subscribe(z => {
        const ezone = z.body as CustomZone;
        ezone.type = DrawingTools.INEBOX;
        if (!this.zones[z.body!.page!]) {
          this.zones[ezone.page!] = [];
        }
        this.zones[ezone.page!].push(ezone);
      });
    }
    this.questionService.query({ examId: this.exam.id! }).subscribe(qs => {
      qs.body?.forEach(q => {
        this.zoneService.find(q.zoneId!).subscribe(z => {
          const ezone = z.body as CustomZone;
          ezone.type = DrawingTools.QUESTIONBOX;
          if (!this.zones[z.body!.page!]) {
            this.zones[ezone.page!] = [];
          }
          this.zones[ezone.page!].push(ezone);
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
    if (!this.pages[page]) {
      const pageHandler = new PageHandler(evt.source, page, this.eventHandler);
      this.pages[page] = pageHandler;
    }

    const canvas = this.pages[page].updateCanvas(evt.source);
    if (this.zones[page] !== undefined) {
      this.zones[page].forEach(z => {
        switch (z.type) {
          case DrawingTools.NOMBOX: {
            const r = this.fabricShapeService.createBoxFromScratch(
              canvas,
              {
                x: z.xInit! / 100,
                y: z.yInit! / 100,
              },
              z.width! / 100,
              z.height! / 100,
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
                x: z.xInit! / 100,
                y: z.yInit! / 100,
              },
              z.width! / 100,
              z.height! / 100,
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
                x: z.xInit! / 100,
                y: z.yInit! / 100,
              },
              z.width! / 100,
              z.height! / 100,
              'INE',
              DrawingColours.RED
            );
            this.eventHandler.modelViewpping.set(r.id, z.id!);
            break;
          }
          case DrawingTools.QUESTIONBOX: {
            const r = this.fabricShapeService.createBoxFromScratch(
              canvas,
              {
                x: z.xInit! / 100,
                y: z.yInit! / 100,
              },
              z.width! / 100,
              z.height! / 100,
              'Question',
              DrawingColours.GREEN
            );
            this.eventHandler.modelViewpping.set(r.id, z.id!);
            break;
          }
        }
      });
    }
  }

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
  }
}
