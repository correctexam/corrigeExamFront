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
import { CustomFabricObject } from '../models';
import { PageHandler } from './PageHandler';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import PerfectScrollbar from 'perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
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
  title = 'gradeScopeFree';
  public scrollbar: any = undefined;

  constructor(
    private pdfService: NgxExtendedPdfViewerService,
    private eventHandler: EventHandlerService,
    private ngZone: NgZone,
    @Inject(PERFECT_SCROLLBAR_CONFIG)
    public config: PerfectScrollbarConfigInterface
  ) {}

  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  ngOnInit(): void {}
  public ngAfterViewInit(): void {
    const container = document.querySelector('#viewerContainer');
    this.scrollbar = new PerfectScrollbar(container!, this.config);

    const sidebar = document.querySelector('#thumbnailView') as HTMLElement;
    if (sidebar) {
      this.scrollbar = new PerfectScrollbar(sidebar, this.config);
    }
  }

  pages: { [page: number]: PageHandler } = {};

  pageRendered(evt: any) {
    const page = evt.pageNumber;
    if (!this.pages[page]) {
      const pageHandler = new PageHandler(evt.source, page, this.eventHandler);
      this.pages[page] = pageHandler;
    }

    this.pages[page].updateCanvas(evt.source);
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
