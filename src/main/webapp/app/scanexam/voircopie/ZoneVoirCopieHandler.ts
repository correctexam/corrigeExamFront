/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/member-ordering */
import * as fabric from 'fabric';
import { EventCanevasVoirCopieHandlerService } from './event-canevasvoircopie-handler.service';

export class ZoneVoirCopieHandler {
  private annotationCanvas!: HTMLCanvasElement;
  private canvasInitialCanvas!: HTMLCanvasElement;
  canvas: fabric.Canvas | undefined;

  constructor(
    public zoneid: string,
    public eventHandler: EventCanevasVoirCopieHandlerService,
    public respid: number | undefined,
  ) {}

  updateCanvas(canvas1: any): fabric.Canvas {
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

    const canvas = new fabric.Canvas(this.annotationCanvas, {
      selection: false,
      preserveObjectStacking: true,
    });
    (canvas as any).zoneid = this.zoneid;
    (canvas as any).respid = this.respid;

    this.eventHandler.allcanvas.push(canvas);
    this.eventHandler.canvas = canvas;
    this.canvas = canvas;

    this.eventHandler.extendToObjectWithId();
    fabric.FabricObject.prototype.objectCaching = false;
    return canvas;
  }

  public clear() {
    const context = this.annotationCanvas.getContext('2d');
    context!.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);
    const ctx = this.annotationCanvas.getContext('2d');
    ctx!.drawImage(this.canvasInitialCanvas, 0, 0);
  }
}
