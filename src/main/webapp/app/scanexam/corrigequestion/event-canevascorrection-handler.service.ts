/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { fabric } from 'fabric';
import { FabricShapeService } from '../annotate-template/paint/shape.service';
import {
  CustomFabricEllipse,
  CustomFabricLine,
  CustomFabricObject,
  CustomFabricPath,
  CustomFabricPolygon,
  CustomFabricRect,
  DrawingColours,
  DrawingThickness,
  DrawingTools,
  FabricObjectType,
  Pointer,
} from '../annotate-template/paint/models';
import { Injectable } from '@angular/core';
import { CustomFabricGroup } from '../annotate-template/paint/models';
import { IComments } from '../../entities/comments/comments.model';
import { CommentsService } from '../../entities/comments/service/comments.service';
import { SVG, extend as SVGextend, Element as SVGElement, G } from '@svgdotjs/svg.js';

const RANGE_AROUND_CENTER = 20;

@Injectable({
  providedIn: 'root',
})
export class EventCanevascorrectionHandlerService {
  public imageDataUrl!: string;
  public _canvas!: fabric.Canvas;
  get canvas(): fabric.Canvas {
    return this._canvas;
  }
  set canvas(c: fabric.Canvas) {
    const prev = this._canvas;
    this._canvas = c;
    if (c !== prev && c.getObjects().length === 0) {
      this.currentComment = null;
      this.commentsService.query({ zonegeneratedid: (c as any).zoneid }).subscribe(e1 => {
        if (!(e1!.body === undefined || e1!.body?.length === 0)) {
          const svg = e1!.body![0].jsonData!;
          let draw = SVG(svg);
          if (svg.startsWith('<?xml')) {
            draw = SVG(svg.split('\n').splice(2).join('\n'));
          }
          draw.scale(this.scale, this.scale, 0, 0);
          fabric.loadSVGFromString(draw.svg(), (objects, options) => {
            // const obj = fabric.util.groupSVGElements(objects, options);
            c.clear();
            if (objects.length > 0) {
              objects.forEach(obj => c.add(obj));
              c.renderAll();
            }
          });
        }
      });
    }
  }
  currentComment: IComments | null = null;
  public allcanvas: fabric.Canvas[] = [];
  private _selectedTool: DrawingTools = DrawingTools.PENCIL;
  private previousTop!: number;
  private previousLeft!: number;
  private previousScaleX!: number;
  private previousScaleY!: number;
  public modelViewpping = new Map<string, number>();
  //  zones: { [zoneNumber: number]: ZoneCorrectionHandler } = {};
  public scale = 1;
  set selectedTool(t: DrawingTools) {
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    if (this.drawingToolObserver) {
      this.drawingToolObserver(t);
    }
    this._selectedTool = t;
    if (
      this._selectedTool === DrawingTools.SELECT ||
      this._selectedTool === DrawingTools.ERASER ||
      this._selectedTool === DrawingTools.FILL
    ) {
      this.objectsSelectable(true);
    } else {
      this.objectsSelectable(false);
    }
    if (this.selectedTool === DrawingTools.GARBAGE) {
      //      const background = this.canvas.backgroundImage;
      this.allcanvas.forEach(c => {
        c.getObjects().forEach(o => this.canvas.remove(o));
        c.clear();
        c.renderAll();
        this.updateAllComments(c).then(e2 =>
          e2.subscribe(e1 => {
            if (c === this.canvas) {
              this.currentComment = e1.body!;
            }
          }),
        );
      });
      this.modelViewpping.clear();
    } else if (this.selectedTool === DrawingTools.ERASER) {
      const ps = [...this.allcanvas.keys()];
      this.allcanvas.forEach(c => {
        if (c !== undefined) {
          c.moveCursor = 'url("content/images/trash.svg"), auto';
          c.hoverCursor = 'url("content/images/trash.svg"), auto';
        }
      });
    } else {
      this.allcanvas.forEach(c => {
        if (c !== undefined) {
          c.moveCursor = 'move';
          c.hoverCursor = 'move';
        }
      });
    }
  }
  get selectedTool(): DrawingTools {
    return this._selectedTool;
  }
  _selectedColour: DrawingColours = DrawingColours.RED;
  set selectedColour(c: DrawingColours) {
    this._selectedColour = c;
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }
  get selectedColour(): DrawingColours {
    return this._selectedColour;
  }
  selectedThickness: DrawingThickness = DrawingThickness.MEDIUM;
  private _isMouseDown = false;
  public _elementUnderDrawing:
    | CustomFabricEllipse
    | CustomFabricRect
    | CustomFabricGroup
    | CustomFabricPath
    | CustomFabricLine
    | CustomFabricPolygon
    | undefined;
  private _initPositionOfElement!: Pointer;

  drawingToolObserver!: (d: DrawingTools) => void;

  constructor(
    private fabricShapeService: FabricShapeService,
    public commentsService: CommentsService,
  ) {}

  registerSelectedToolObserver(f: (d: DrawingTools) => void): any {
    this.drawingToolObserver = f;
  }

  addBGImageSrcToCanvas(): Promise<void> {
    if (!this.imageDataUrl) {
      new Promise((resolve, reject) => {
        resolve(undefined);
      });
    }
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        const f_img = new fabric.Image(img);
        this.canvas.setWidth(f_img.width!);
        this.canvas.setHeight(f_img.height!);
        this.canvas.setBackgroundImage(f_img, resolve);
      };
      img.onerror = () => {
        reject();
      };
      img.src = this.imageDataUrl;
    });
  }

  mouseDown(e: Event) {
    this._isMouseDown = true;
    const pointer = this.canvas.getPointer(e);
    this._initPositionOfElement = { x: pointer.x, y: pointer.y };

    switch (this._selectedTool) {
      case DrawingTools.ELLIPSE:
        this._elementUnderDrawing = this.fabricShapeService.createEllipse(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          pointer,
        );
        break;
      case DrawingTools.RECTANGLE:
        this._elementUnderDrawing = this.fabricShapeService.createRectangle(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          DrawingColours.RED,
          pointer,
        );
        break;
      case DrawingTools.PENCIL:
        this._elementUnderDrawing = this.fabricShapeService.createPath(this.canvas, this.selectedThickness, this._selectedColour, pointer);
        break;
      case DrawingTools.LINE:
        this._elementUnderDrawing = this.fabricShapeService.createLine(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          [5, 0],
          pointer,
        );
        break;
      case DrawingTools.DASHED_LINE:
        this._elementUnderDrawing = this.fabricShapeService.createLine(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          [5, 5],
          pointer,
        );
        break;
      case DrawingTools.POLYGON:
        if (!this._elementUnderDrawing) {
          this._elementUnderDrawing = this.fabricShapeService.createPolygon(
            this.canvas,
            this.selectedThickness,
            this._selectedColour,
            pointer,
          );
        } else {
          if (
            this.fabricShapeService.isClickNearPolygonCenter(this._elementUnderDrawing as CustomFabricPolygon, pointer, RANGE_AROUND_CENTER)
          ) {
            this._elementUnderDrawing = this.fabricShapeService.finishPolygon(
              this.canvas,
              this._elementUnderDrawing as CustomFabricPolygon,
            );
            this._elementUnderDrawing = undefined;
          } else {
            this.fabricShapeService.addPointToPolygon(this._elementUnderDrawing as CustomFabricPolygon, pointer);
          }
        }
        break;
      case DrawingTools.TEXT:
        this.fabricShapeService.createIText(this.canvas, {
          thickness: this.selectedThickness / 2,
          colour: this._selectedColour,
          pointer,
          fontSize: 20,
        });
        break;
    }
  }

  async updateComments() {
    if (this.currentComment === null) {
      const e1 = await this.commentsService
        .query({ zonegeneratedid: (this.canvas as any).zoneid })
        .pipe()
        .toPromise();
      if (e1!.body === undefined || e1!.body?.length === 0) {
        const draw = SVG(this.canvas.toSVG().split('\n').splice(2).join('\n'));
        draw.scale(1.0 / this.scale, 1.0 / this.scale, 0, 0);
        const c = { jsonData: draw.svg(), zonegeneratedid: (this.canvas as any).zoneid };
        return this.commentsService.create(c);
      } else {
        const draw = SVG(this.canvas.toSVG().split('\n').splice(2).join('\n'));
        draw.scale(1.0 / this.scale, 1.0 / this.scale, 0, 0);
        e1!.body![0].jsonData = draw.svg(); // this.canvas.toSVG();
        return this.commentsService.update(e1!.body![0]);
      }
    } else {
      const draw = SVG(this.canvas.toSVG().split('\n').splice(2).join('\n'));
      draw.scale(1.0 / this.scale, 1.0 / this.scale, 0, 0);
      this.currentComment.jsonData = draw.svg();
      return this.commentsService.update(this.currentComment);
    }
  }

  async updateAllComments(canvas: fabric.Canvas) {
    if (canvas === this.canvas) {
      return this.updateComments();
    } else {
      const e1 = await this.commentsService
        .query({ zonegeneratedid: (canvas as any).zoneid })
        .pipe()
        .toPromise();
      if (e1!.body === undefined || e1!.body?.length === 0) {
        const draw = SVG(canvas.toSVG().split('\n').splice(2).join('\n'));
        draw.scale(1.0 / this.scale, 1.0 / this.scale, 0, 0);
        const c = { jsonData: draw.svg(), zonegeneratedid: (canvas as any).zoneid };
        return this.commentsService.create(c);
      } else {
        const draw = SVG(canvas.toSVG().split('\n').splice(2).join('\n'));
        draw.scale(1 / this.scale, 1.0 / this.scale, 0, 0);
        e1!.body![0].jsonData = draw.svg(); // this.canvas.toSVG();
        return this.commentsService.update(e1!.body![0]);
      }
    }
  }

  async mouseMove(e: Event) {
    if (!this._isMouseDown) {
      return;
    }
    const pointer = this.canvas.getPointer(e);
    switch (this._selectedTool) {
      case DrawingTools.ELLIPSE:
        this.fabricShapeService.formEllipse(this._elementUnderDrawing as CustomFabricEllipse, this._initPositionOfElement, pointer);
        break;
      case DrawingTools.RECTANGLE:
        this.fabricShapeService.formRectangle(this._elementUnderDrawing as CustomFabricRect, this._initPositionOfElement, pointer);
        break;
      case DrawingTools.PENCIL:
        this.fabricShapeService.formPath(this._elementUnderDrawing as CustomFabricPath, pointer);
        break;
      case DrawingTools.LINE:
      case DrawingTools.DASHED_LINE:
        this.fabricShapeService.formLine(this._elementUnderDrawing as CustomFabricLine, pointer);
        break;
      case DrawingTools.POLYGON:
        this.fabricShapeService.formFirstLineOfPolygon(
          this._elementUnderDrawing as CustomFabricPolygon,
          this._initPositionOfElement,
          pointer,
        );
        break;
    }
    this.canvas.renderAll();
  }

  mouseUp() {
    this._isMouseDown = false;
    if (this._selectedTool === DrawingTools.PENCIL) {
      this._elementUnderDrawing = this.fabricShapeService.finishPath(this.canvas, this._elementUnderDrawing as CustomFabricPath);
      this.updateComments().then(e2 =>
        e2.subscribe(e1 => {
          this.currentComment = e1.body;
        }),
      );
    }

    if (this._selectedTool !== DrawingTools.POLYGON) {
      this._elementUnderDrawing = undefined;
    }
    if (this._selectedTool !== DrawingTools.SELECT) {
      this.canvas.renderAll();
    }
  }

  extendToObjectWithId(): void {
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (this: CustomFabricObject) {
        return fabric.util.object.extend(toObject.call(this), {
          id: this.id,
        });
      };
    })(fabric.Object.prototype.toObject);
  }

  objectSelected(object: CustomFabricObject): void {
    this.previousLeft = object.left!;
    this.previousTop = object.top!;
    this.previousScaleX = object.scaleX!;
    this.previousScaleY = object.scaleY!;
    switch (this._selectedTool) {
      case DrawingTools.SELECT:
        break;

      case DrawingTools.ERASER:
        if (object.type === FabricObjectType.ELLIPSE) {
          const otherEllipses = this.getOtherEllipses(object.id);
          otherEllipses.forEach(e => this.canvas.remove(e));
        }
        // this.zoneService.delete(this.modelViewpping.get(object.id)!).subscribe();
        this.modelViewpping.delete(object.id);
        this.canvas.remove(object);
        this.canvas.renderAll();
        this.updateComments().then(e2 =>
          e2.subscribe(e1 => {
            this.currentComment = e1.body!;
          }),
        );

        break;
      case DrawingTools.FILL:
        this.fabricShapeService.fillShape(object, this._selectedColour);
        this.canvas.renderAll();
        this.updateComments().then(e2 =>
          e2.subscribe(e1 => {
            this.currentComment = e1.body!;
          }),
        );

        break;
    }
  }

  objectMoving(id: string, type: FabricObjectType, newLeft: number, newTop: number) {
    const l = newLeft;
    const t = newTop;
    const nid = id;
    this.updateComments().then(e2 =>
      e2.subscribe(e1 => {
        this.currentComment = e1.body!;
      }),
    );

    if (type !== FabricObjectType.ELLIPSE) {
      return;
    }
    const diffX = newLeft - this.previousLeft;
    const diffY = newTop - this.previousTop;
    this.previousLeft = newLeft;
    this.previousTop = newTop;

    const otherEllipses = this.getOtherEllipses(id);
    otherEllipses.forEach(e => {
      e.left! += diffX;
      e.top! += diffY;
    });
  }

  objectScaling(id: string, type: FabricObjectType, newScales: { x: number; y: number }, newCoords: { left: number; top: number }) {
    const o1 = this.canvas.getObjects().filter(o => (o as any).id === id)[0];
    const l = o1.aCoords?.tl.x;
    const t = o1.aCoords?.tl.y;
    const w = o1.aCoords?.br.x! - o1.aCoords?.tl.x!;
    const h = o1.aCoords?.br.y! - o1.aCoords?.tl.y!;
    this.updateComments().then(e2 =>
      e2.subscribe(e1 => {
        this.currentComment = e1.body!;
      }),
    );

    if (type !== FabricObjectType.ELLIPSE) {
      return;
    }
    const scaleDiffX = newScales.x - this.previousScaleX;
    const scaleDiffY = newScales.y - this.previousScaleY;
    this.previousScaleX = newScales.x;
    this.previousScaleY = newScales.y;

    const otherEllipses = this.getOtherEllipses(id);
    otherEllipses.forEach(e => {
      e.scaleX! += scaleDiffX!;
      e.scaleY! += scaleDiffY!;
    });
    this.objectMoving(id, type, newCoords.left, newCoords.top);
  }

  private objectsSelectable(isSelectable: boolean) {
    this.canvas.forEachObject(obj => {
      obj.selectable = isSelectable;
    });
  }

  private getOtherEllipses(notIncludedId: string): CustomFabricEllipse[] {
    return this.canvas
      .getObjects(FabricObjectType.ELLIPSE)
      .filter(e => (e as CustomFabricEllipse).id !== notIncludedId) as CustomFabricEllipse[];
  }
}
