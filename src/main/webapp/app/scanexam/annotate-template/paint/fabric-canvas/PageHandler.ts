/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/member-ordering */
import { fabric } from 'fabric';
import { EventHandlerService } from '../event-handler.service';

export type AnnotationPageRect = {
  page: number;
  pos1: { x: any; y: any };
  pos2: { x: any; y: any };
};

export class PageHandler {
  private ctx!: CanvasRenderingContext2D;
  isActive = false;
  pos!: { x: number; y: number };
  isDrawing!: boolean;
  currentAnnotationId!: string;

  private annotationCanvas!: HTMLCanvasElement;
  private canvas!: any;
  private pdfCanvas!: HTMLCanvasElement;
  noteImg!: HTMLImageElement;

  constructor(public pageViewer: any, public page: number, public eventHandler: EventHandlerService) {
    // this.updateCanvas(pageViewer);
    //    window.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    //    window.addEventListener('touchend', this.mouseUpHandler.bind(this));
  }

  mapToPageRect(rect: DOMRect): AnnotationPageRect | undefined {
    if (!this.pageViewer.textLayer) {
      return;
    }
    const pageRect = this.pageViewer.textLayer.textLayerDiv.getBoundingClientRect();

    if (!(rect.y >= pageRect.top && rect.y <= pageRect.bottom)) {
      return;
    }

    if (rect.x <= pageRect.x) {
      return;
    }

    if (rect.x <= pageRect.x) {
      return;
    }
    if (rect.x + rect.width >= pageRect.x + pageRect.width) {
      return;
    }

    // console.log({ pageRect, rect });
    // const { xOffset, yOffset } = getPosOfElement(this.pageViewer.canvas);
    const xOffset = pageRect.x;
    const yOffset = pageRect.y;

    // const n = 2;
    const pos1 = this.cursorToReal({
      x: rect.x - xOffset,
      y: rect.y - yOffset,
    });

    const pos2 = this.cursorToReal({
      x: rect.x + rect.width - xOffset,
      y: rect.y + rect.height - yOffset,
    });

    return { page: this.page, pos1, pos2 };
  }

  // showTops() {
  //   let el: HTMLElement = this.annotationCanvas;
  //   while (el) {
  //     const str = `${el.localName}:${el.className} ${el.offsetTop}`;
  //     console.log(str);
  //     el = el.parentElement;
  //   }
  // }

  cursorToReal(e: { x: any; y: any }) {
    const z = this.pageViewer.viewport.convertToPdfPoint(e.x, e.y);

    return { x: z[0], y: z[1] };
  }

  realToCanvas(pos: { x: number; y: number }) {
    const z = this.pageViewer.viewport.convertToViewportPoint(pos.x, pos.y);
    return {
      x: z[0] * this.pageViewer.outputScale.sx,
      y: z[1] * this.pageViewer.outputScale.sy,
    };
  }

  updateCanvas(pageViewer: any): fabric.Canvas {
    // Add the event listeners for mousedown, mousemove, and mouseup

    // console.log(' UPDATE CANVAS ');

    //    this.detachPen();

    if (this.annotationCanvas && this.annotationCanvas.parentNode) {
      this.annotationCanvas.parentNode.removeChild(this.annotationCanvas);
    }
    this.pageViewer = pageViewer;
    this.pdfCanvas = this.pageViewer.canvas;
    this.annotationCanvas = document.createElement('CANVAS') as HTMLCanvasElement;

    this.annotationCanvas.width = this.pdfCanvas.width;
    this.annotationCanvas.height = this.pdfCanvas.height;
    this.annotationCanvas.style.width = this.pdfCanvas.style.width;
    this.annotationCanvas.style.height = this.pdfCanvas.style.height;

    this.pdfCanvas.style.position = 'absolute';
    this.pdfCanvas.style.touchAction = 'none';
    this.annotationCanvas.style.position = 'absolute';
    this.annotationCanvas.style.touchAction = 'none';
    this.annotationCanvas.id = 'mycanvas' + this.page;

    // this.canvas.style['z-index'] = '30';
    // this.pdfCanvas.style['z-index'] = '20';

    this.pdfCanvas.parentElement!.appendChild(this.annotationCanvas);

    const canvas = new fabric.Canvas(this.annotationCanvas, {
      selection: false,
      preserveObjectStacking: true,
    });
    (canvas as any).page = this.page;

    this.eventHandler.canvas = canvas;
    this.eventHandler.allcanvas.push(canvas);

    this.eventHandler.extendToObjectWithId();
    this.canvas = canvas;
    fabric.Object.prototype.objectCaching = false;

    /* var rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 50,
        height: 50,
        fill: '#FF454F',
        opacity: 0.5,
        transparentCorners: true,
        borderColor: "gray",
        cornerColor: "gray",
        cornerSize: 5
      });
      canvas.add(rect);
      canvas.renderAll();
      console.log(this);*/

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
  }

  private onCanvasMouseDown(event: { e: Event }) {
    this.eventHandler.canvas = this.canvas;
    this.eventHandler.mouseDown(event.e);
    this.avoidDragAndClickEventsOfOtherUILibs(event.e);
  }
  private onCanvasMouseMove(event: { e: Event }) {
    this.eventHandler.canvas = this.canvas;
    this.eventHandler.mouseMove(event.e);
  }
  private onCanvasMouseUp() {
    this.eventHandler.canvas = this.canvas;
    this.eventHandler.mouseUp();
  }
  private onSelectionCreated(e: any) {
    this.eventHandler.canvas = this.canvas;

    this.eventHandler.objectSelected(e.selected[0]);
  }
  private onSelectionUpdated(e: any) {
    this.eventHandler.canvas = this.canvas;

    this.eventHandler.objectSelected(e.selected[0]);
  }
  private onObjectMoving(e: any) {
    this.eventHandler.canvas = this.canvas;
    this.eventHandler.objectMoving(e.target.id, e.target.type, e.target.left, e.target.top);
  }
  private onObjectScaling(e: any) {
    console.error('scale');
    this.eventHandler.canvas = this.canvas;
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

  // Copy source contents to annotation canvas.

  // console.log(this.canvas);

  public clear() {
    // eslint-disable-next-line no-console
    const context = this.annotationCanvas.getContext('2d');
    context!.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);

    const ctx = this.annotationCanvas.getContext('2d');

    ctx!.drawImage(this.pdfCanvas, 0, 0);
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
}
