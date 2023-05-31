/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/member-ordering */
import { fabric } from 'fabric';
import { EventHandlerService } from '../event-handler.service';
import { IEvent, Transform } from 'fabric/fabric-impl';

type AnnotationPageRect = {
  page: number;
  pos1: { x: number; y: number };
  pos2: { x: number; y: number };
};

interface CanvasModifiedEvent extends IEvent {
  action: 'drag' | 'scale';
  transform: Transform;
  target: any;
}

export interface PagedCanvas extends fabric.Canvas {
  page: number;
}

export class PageHandler {
  private annotationCanvas!: HTMLCanvasElement;
  private canvas!: PagedCanvas;
  private pdfCanvas!: HTMLCanvasElement;

  public constructor(public pageViewer: any, private page: number, private eventHandler: EventHandlerService) {
    // this.updateCanvas(pageViewer);
    //    window.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    //    window.addEventListener('touchend', this.mouseUpHandler.bind(this));
  }

  public mapToPageRect(rect: DOMRect): AnnotationPageRect | undefined {
    if (!this.pageViewer.textLayer) {
      return;
    }
    const pageRect = this.pageViewer.textLayer.textLayerDiv.getBoundingClientRect() as DOMRect;

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

  public cursorToReal(e: { x: number; y: number }): { x: number; y: number } {
    const z = this.pageViewer.viewport.convertToPdfPoint(e.x, e.y);

    return { x: z[0], y: z[1] };
  }

  public realToCanvas(pos: { x: number; y: number }): { x: number; y: number } {
    const z = this.pageViewer.viewport.convertToViewportPoint(pos.x, pos.y);
    return {
      x: z[0] * this.pageViewer.outputScale.sx,
      y: z[1] * this.pageViewer.outputScale.sy,
    };
  }

  public updateCanvas(pageViewer: any): PagedCanvas {
    // Add the event listeners for mousedown, mousemove, and mouseup

    // console.log(' UPDATE CANVAS ');

    //    this.detachPen();

    if (this.annotationCanvas?.parentNode) {
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
    this.annotationCanvas.id = 'mycanvas' + String(this.page);

    // this.canvas.style['z-index'] = '30';
    // this.pdfCanvas.style['z-index'] = '20';

    this.pdfCanvas.parentElement!.appendChild(this.annotationCanvas);

    const canvas: PagedCanvas = new fabric.Canvas(this.annotationCanvas, {
      selection: false,
      preserveObjectStacking: true,
    }) as PagedCanvas;
    canvas.page = this.page;

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

  private addEventListeners(canvas: PagedCanvas): void {
    canvas.on('mouse:down', e => this.onCanvasMouseDown(e));
    canvas.on('mouse:move', e => this.onCanvasMouseMove(e));
    canvas.on('mouse:up', () => this.onCanvasMouseUp());
    canvas.on('selection:created', e => this.onSelectionCreated(e));
    canvas.on('selection:updated', e => this.onSelectionUpdated(e));
    canvas.on('object:modified', e => this.onObjectModified(e as CanvasModifiedEvent));
  }

  private onCanvasMouseDown(event: IEvent<MouseEvent>): void {
    this.eventHandler.canvas = this.canvas;
    this.eventHandler.mouseDown(event.e);
    this.avoidDragAndClickEventsOfOtherUILibs(event.e);
  }

  private onCanvasMouseMove(event: IEvent<MouseEvent>): void {
    this.eventHandler.canvas = this.canvas;
    this.eventHandler.mouseMove(event.e);
  }

  private onCanvasMouseUp(): void {
    this.eventHandler.canvas = this.canvas;
    this.eventHandler.mouseUp();
  }

  private onSelectionCreated(e: any): void {
    this.eventHandler.canvas = this.canvas;

    this.eventHandler.objectSelected(e.selected[0]);
  }

  private onSelectionUpdated(e: any): void {
    this.eventHandler.canvas = this.canvas;

    this.eventHandler.objectSelected(e.selected[0]);
  }

  private onObjectModified(e: CanvasModifiedEvent): void {
    if (e.action === 'drag') {
      this.eventHandler.canvas = this.canvas;
      this.eventHandler.objectMoving(e.target.id, e.target.type, e.target.left, e.target.top);
    } else {
      this.eventHandler.canvas = this.canvas;
      this.eventHandler.objectScaling(
        e.target.id,
        e.target.type,
        { x: e.target.scaleX, y: e.target.scaleY },
        { left: e.target.left, top: e.target.top }
      );
    }
  }

  private avoidDragAndClickEventsOfOtherUILibs(e: Event): void {
    e.stopPropagation();
  }

  // Copy source contents to annotation canvas.

  public clear(): void {
    const context = this.annotationCanvas.getContext('2d');
    context!.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);

    const ctx = this.annotationCanvas.getContext('2d');

    ctx!.drawImage(this.pdfCanvas, 0, 0);
  }

  public visible(yes: boolean): void {
    if (!this.annotationCanvas) {
      return;
    }
    if (yes) {
      this.annotationCanvas.style.display = 'block';
    } else {
      this.annotationCanvas.style.display = 'none';
    }
  }

  public detachPen(): void {
    if (this.annotationCanvas) {
      this.annotationCanvas.style.cursor = 'default';
      this.annotationCanvas.onmousedown = null;
      this.annotationCanvas.onpointerup = null;
    }
  }
}
