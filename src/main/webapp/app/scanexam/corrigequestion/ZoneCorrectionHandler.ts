/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/member-ordering */
import { TPointerEvent, Canvas as fCanvas, FabricObject } from 'fabric';
import { EventCanevascorrectionHandlerService } from './event-canevascorrection-handler.service';

export type AnnotationPageRect = {
  page: number;
  pos1: { x: any; y: any };
  pos2: { x: any; y: any };
};

export class ZoneCorrectionHandler {
  private ctx!: CanvasRenderingContext2D;
  isActive = false;
  pos!: { x: number; y: number };
  isDrawing!: boolean;
  currentAnnotationId!: string;

  private annotationCanvas!: HTMLCanvasElement;
  private canvas: fCanvas | undefined;
  private canvasInitialCanvas!: HTMLCanvasElement;
  noteImg!: HTMLImageElement;

  constructor(
    public zoneid: string,
    public eventHandler: EventCanevascorrectionHandlerService,
    public respid: number | undefined,
  ) {}

  updateCanvas(canvas1: any): fCanvas {
    if (this.annotationCanvas && this.annotationCanvas.parentNode) {
      this.annotationCanvas.parentNode.removeChild(this.annotationCanvas);
      if (this.canvas !== undefined) {
        this.canvas.removeListeners();
        (this.canvas as any)['wrapperEl'].parentNode.removeChild((this.canvas as any)['wrapperEl']);
      }
    }

    this.canvasInitialCanvas = canvas1;
    this.annotationCanvas = document.createElement('CANVAS') as HTMLCanvasElement;

    this.annotationCanvas.width = this.canvasInitialCanvas.width;
    this.annotationCanvas.height = this.canvasInitialCanvas.height;
    this.annotationCanvas.style.width = this.canvasInitialCanvas.style.width;
    this.annotationCanvas.style.height = this.canvasInitialCanvas.style.height;

    this.canvasInitialCanvas.style.position = 'absolute';
    this.canvasInitialCanvas.style.touchAction = 'none';
    this.annotationCanvas.style.position = 'absolute';
    this.annotationCanvas.style.touchAction = 'none';
    this.annotationCanvas.id = 'mycanvas' + this.zoneid;

    this.canvasInitialCanvas.parentElement!.appendChild(this.annotationCanvas);

    const canvas = new fCanvas(this.annotationCanvas, {
      selection: false,
      preserveObjectStacking: true,
    });
    (canvas as any).zoneid = this.zoneid;
    (canvas as any).respid = this.respid;

    this.eventHandler.allcanvas.push(canvas);
    this.eventHandler.canvas = canvas;

    this.eventHandler.extendToObjectWithId();
    this.canvas = canvas;
    // this.eventHandler.commentsService.query();
    FabricObject.prototype.objectCaching = false;
    this.addEventListeners(canvas);
    return canvas;
  }

  private addEventListeners(canvas: any) {
    canvas.on('mouse:down', (e: any) => this.onCanvasMouseDown(e));

    canvas.on('mouse:move', (e: any) => this.onCanvasMouseMove(e));
    canvas.on('mouse:up', () => this.onCanvasMouseUp());
    canvas.on('selection:created', (e: any) => this.onSelectionCreated(e as any));
    canvas.on('selection:updated', (e: any) => this.onSelectionUpdated(e as any));
    canvas.on('object:moving', (e: any) => this.onObjectMoving(e as any));
    canvas.on('object:scaling', (e: any) => this.onObjectScaling(e as any));
    canvas.on('object:modified', () => this.onObjectModified());
  }

  private onCanvasMouseDown(event: { e: TPointerEvent }) {
    this.eventHandler.canvas = this.canvas!;
    this.eventHandler.mouseDown(event.e);
    this.avoidDragAndClickEventsOfOtherUILibs(event.e);
  }
  private onCanvasMouseMove(event: { e: TPointerEvent }) {
    this.eventHandler.canvas = this.canvas!;
    this.eventHandler.mouseMove(event.e);
  }
  private onCanvasMouseUp() {
    this.eventHandler.canvas = this.canvas!;
    this.eventHandler.mouseUp();
  }
  private onObjectModified() {
    this.eventHandler.canvas = this.canvas!;
    this.eventHandler.objectModified();
  }

  private onSelectionCreated(e: any) {
    this.eventHandler.canvas = this.canvas!;

    this.eventHandler.objectSelected(e.selected[0]);
  }
  private onSelectionUpdated(e: any) {
    this.eventHandler.canvas = this.canvas!;

    this.eventHandler.objectSelected(e.selected[0]);
  }
  private onObjectMoving(e: any) {
    this.eventHandler.canvas = this.canvas!;
    this.eventHandler.objectMoving(e.target.id, e.target.type, e.target.left, e.target.top);
  }
  private onObjectScaling(e: any) {
    this.eventHandler.canvas = this.canvas!;
    this.eventHandler.objectScaling(
      e.target.id,
      e.target.type,
      { x: e.target.scaleX, y: e.target.scaleY },
      { left: e.target.left, top: e.target.top },
    );
  }

  private avoidDragAndClickEventsOfOtherUILibs(e: Event) {
    e.stopPropagation();
  }

  public clear() {
    const context = this.annotationCanvas.getContext('2d');
    context!.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);
    const ctx = this.annotationCanvas.getContext('2d');
    ctx!.drawImage(this.canvasInitialCanvas, 0, 0);
  }

  visible(yes: boolean) {
    if (!this.annotationCanvas) {
      return;
    }
    if (yes) {
      this.annotationCanvas.style.display = 'block';
    } else {
      this.annotationCanvas.style.display = 'none';
    }
  }

  detachPen() {
    if (this.annotationCanvas) {
      this.annotationCanvas.style.cursor = 'default';
      this.annotationCanvas.onmousedown = null;
      this.annotationCanvas.onpointerup = null;
    }
  }
  changeAllCursor(erase: boolean): void {
    if (this.annotationCanvas) {
      this.annotationCanvas.style.cursor = 'default';
    }
    if (this.canvas !== undefined) {
      if (erase) {
        this.canvas.moveCursor = 'url("content/images/trash.svg"), auto';
        this.canvas.hoverCursor = 'url("content/images/trash.svg"), auto';
      } else {
        this.canvas.moveCursor = 'move';
        this.canvas.hoverCursor = 'move';
      }
    }
  }
}
