/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable no-new */

/* eslint-disable @typescript-eslint/member-ordering */

import {
  Canvas as fCanvas,
  TPointerEvent,
  loadSVGFromString,
  FabricImage as fImage,
  FabricObject,
  IText,
  BaseBrush,
  PencilBrush,
} from 'fabric';
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
import { SVG, extend as SVGextend, Element as SVGElement, G, Text } from '@svgdotjs/svg.js';
import { Platform } from '@angular/cdk/platform';
import { svgadapter } from '../svg.util';
import { constants } from 'os';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PreferenceService } from '../preference-page/preference.service';
import * as fabric from 'fabric';

const RANGE_AROUND_CENTER = 20;

@Injectable({
  providedIn: 'root',
})
export class EventCanevascorrectionHandlerService {
  public imageDataUrl!: string;
  public _canvas!: fCanvas;
  private confService!: ConfirmationService;
  public svgselect: string = '';

  get canvas(): fCanvas {
    return this._canvas;
  }
  set canvas(c: fCanvas) {
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
          const s2 = draw.svg(svgadapter);
          loadSVGFromString(s2).then(r => {
            // const obj = fabric.util.fabricShapeService(objects, options);
            if (r.objects.length > 0) {
              r.objects.forEach(obj => {
                if (obj !== null) {
                  if (obj.type === 'text') {
                    obj = this.convertToIText(obj);
                    (obj as any).firstText = (obj as any).text;
                    (obj as any).textState = 'original';
                  }
                  c.add(obj);
                }
              });
              c.renderAll();
              if (
                this._selectedTool === DrawingTools.SELECT ||
                this._selectedTool === DrawingTools.ERASER ||
                this._selectedTool === DrawingTools.FILL
              ) {
                c.forEachObject(obj => {
                  obj.selectable = true;
                });
              } else {
                c.forEachObject(obj => {
                  obj.selectable = false;
                });
              }
            }
          });
        }
      });
    }
  }
  currentComment: IComments | null = null;
  public allcanvas: fCanvas[] = [];
  private _selectedTool: DrawingTools = DrawingTools.PENCIL;
  private previousTop!: number;
  private previousLeft!: number;
  private previousScaleX!: number;
  private previousScaleY!: number;
  public modelViewpping = new Map<string, number>();
  //  zones: { [zoneNumber: number]: ZoneCorrectionHandler } = {};
  public scale = 1;

  set selectedTool(t: DrawingTools) {
    if (this.canvas !== undefined && this.canvas !== null) {
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    }
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
      this.canvas.isDrawingMode = false;
    } else if (this._selectedTool === DrawingTools.PENCIL) {
      this.canvas.isDrawingMode = true;
      this.objectsSelectable(false);
    } else {
      this.canvas.isDrawingMode = false;
      this.objectsSelectable(false);
    }
    if (this.selectedTool === DrawingTools.GARBAGE) {
      //      const background = this.canvas.backgroundImage;
      this.removeAll();
    } else if (this.selectedTool === DrawingTools.ERASER) {
      const ps = [...this.allcanvas.keys()];
      this.allcanvas.forEach(c => {
        if (c !== undefined) {
          if (this.platform.FIREFOX) {
            c.moveCursor = 'url("content/images/trash1.png"), auto';
            c.hoverCursor = 'url("content/images/trash1.png"), auto';
          } else {
            c.moveCursor = 'url("content/images/trash.svg"), auto';
            c.hoverCursor = 'url("content/images/trash.svg"), auto';
          }
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
  public set selectedColour(c: DrawingColours) {
    this._selectedColour = c;
    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = c;
    }
    this.canvas.discardActiveObject();

    this.canvas.renderAll();
  }
  public get selectedColour(): DrawingColours {
    return this._selectedColour;
  }
  _selectedThickness: DrawingThickness = DrawingThickness.MEDIUM;
  public get selectedThickness(): DrawingThickness {
    return this._selectedThickness;
  }
  public set selectedThickness(d: DrawingThickness) {
    this._selectedThickness = d;
    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.width = d;
    }
  }

  selectedFontsize: number = 20;

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
    private platform: Platform,
    private translateService: TranslateService,
    public preferenceService: PreferenceService,
  ) {}

  removeAll(): void {
    this.translateService.get('scanexam.removeAllAnnotation4studentsheet').subscribe(name => {
      this.confService.confirm({
        message: name,
        accept: () => {
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
          this.selectedTool = DrawingTools.SELECT;
        },
        reject: () => {
          this.selectedTool = DrawingTools.SELECT;
        },
      });
    });
  }

  convertToIText(obj: any) {
    const text = obj.text;
    const textobj = obj.toObject();
    delete textobj.text;
    delete textobj.type;

    textobj.fontSize = obj.fontSize;
    textobj.fontFamily = obj.fontFamily;
    textobj.fontStyle = obj.fontStyle;
    textobj.fontWeight = obj.fontWeight;
    const itext = new IText(text, textobj);
    itext.styles = {};
    return itext;
  }

  registerSelectedToolObserver(f: (d: DrawingTools) => void): any {
    this.drawingToolObserver = f;
  }

  public setConfirmationService(confService: ConfirmationService): void {
    this.confService = confService;
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
        const f_img = new fImage(img);
        this.canvas.setWidth(f_img.width!);
        this.canvas.setHeight(f_img.height!);
        this.canvas.backgroundImage = f_img;
        // this.canvas.
        //        this.canvas.setBackgroundImage(f_img, resolve);
        resolve();
      };
      img.onerror = () => {
        reject();
      };
      img.src = this.imageDataUrl;
    });
  }

  async updateComments() {
    if (this.currentComment === null) {
      const e1 = await firstValueFrom(this.commentsService.query({ zonegeneratedid: (this.canvas as any).zoneid }));
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

  async updateAllComments(canvas: fCanvas) {
    if (canvas === this.canvas) {
      return this.updateComments();
    } else {
      const e1 = await firstValueFrom(this.commentsService.query({ zonegeneratedid: (canvas as any).zoneid }));
      //        .pipe()
      //        .toPromise();
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

  mouseDown(e: TPointerEvent) {
    this._isMouseDown = true;
    // TO check
    const pointer = this.canvas.getScenePoint(e);
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
      /*    case DrawingTools.PENCIL:
        // this.canvas.freeDrawingBrush = new PencilBrush(this.canvas);
        this._elementUnderDrawing = this.fabricShapeService.createPath(this.canvas, this.selectedThickness, this._selectedColour, pointer);
        break;*/
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
        // eslint-disable-next-line no-case-declarations
        const fabicText = this.fabricShapeService.createIText(this.canvas, {
          thickness: this.selectedThickness / 2,
          colour: this._selectedColour,
          pointer,
          fontSize: this.selectedFontsize,
        });
        this.canvas.setActiveObject(fabicText);
        fabicText.selectAll();
        fabicText.enterEditing();
        //      (fabicText as any).hiddenTextarea.focus();
        break;

      case DrawingTools.CUSTOMSVG:
        if (this.svgselect !== '') {
          const s = this.preferenceService.getAllDefaultSVGCustomComments().get(this.svgselect);
          if (s) {
            loadSVGFromString(s).then(r => {
              if (r.objects.length > 0) {
                const objs: any[] = r.objects;
                if (r.objects.length > 1) {
                  const group = new fabric.Group(objs, {
                    top: pointer.y,
                    left: pointer.y,
                    originX: 'left',
                    originY: 'top',
                    selectable: true,
                    //    hasRotatingPoint: false,
                    lockRotation: true,
                  });
                  const max = group.width > group.height ? group.width : group.height;
                  let scale = 40 / max;
                  if (group.height * scale < 20) {
                    scale = 20 / group.height;
                  }
                  group.scale(scale);
                  group.setX(pointer.x - (group.width * scale) / 2);
                  group.setY(pointer.y - (group.height * scale) / 2);

                  this.canvas.add(group);
                } else {
                  let obj = r.objects[0];
                  if (obj !== null) {
                    if (obj.type === 'text') {
                      obj = this.convertToIText(obj);
                      (obj as any).firstText = (obj as any).text;
                      (obj as any).textState = 'original';
                    }
                    const max = obj.width > obj.height ? obj.width : obj.height;
                    let scale = 40 / max;

                    if (obj.height * scale < 20) {
                      scale = 20 / obj.height;
                    }

                    obj.scale(scale);
                    obj.setX(pointer.x - (obj.width * scale) / 2);
                    obj.setY(pointer.y - (obj.height * scale) / 2);
                    this.canvas.add(obj);
                  }
                }

                r.objects.forEach(obj => {
                  if (obj !== null) {
                    if (obj.type === 'text') {
                      obj = this.convertToIText(obj);
                      (obj as any).firstText = (obj as any).text;
                      (obj as any).textState = 'original';
                    }
                  }
                });
                this.canvas.renderAll();
              }
            });
          }
        }

        break;
    }
  }

  onPathCreated(path: any) {
    //    console.error(path)
    this.updateComments().then(e2 =>
      e2.subscribe(e1 => {
        this.currentComment = e1.body;
      }),
    );
  }

  async mouseMove(e: TPointerEvent) {
    if (!this._isMouseDown) {
      return;
    }
    //    const pointer = this.canvas.getPointer(e);
    // TO check
    const pointer = this.canvas.getScenePoint(e);
    switch (this._selectedTool) {
      case DrawingTools.ELLIPSE:
        this.fabricShapeService.formEllipse(this._elementUnderDrawing as CustomFabricEllipse, this._initPositionOfElement, pointer);
        break;
      case DrawingTools.RECTANGLE:
        this.fabricShapeService.formRectangle(this._elementUnderDrawing as CustomFabricRect, this._initPositionOfElement, pointer);
        break;
      /*      case DrawingTools.PENCIL:
        this.fabricShapeService.formPath(this._elementUnderDrawing as CustomFabricPath, pointer);
        break;*/
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

    //    console.error('will render all')

    this.canvas.renderAll();
  }

  mouseUp() {
    this._isMouseDown = false;
    /*    if (this._selectedTool === DrawingTools.PENCIL) {
      this._elementUnderDrawing = this.fabricShapeService.finishPath(this.canvas, this._elementUnderDrawing as CustomFabricPath);
      this.updateComments().then(e2 =>
        e2.subscribe(e1 => {
          this.currentComment = e1.body;
        }),
      );
    }*/
    if (this._selectedTool === DrawingTools.TEXT) {
      this.updateComments().then(e2 =>
        e2.subscribe(e1 => {
          this.currentComment = e1.body;
        }),
      );
    }
    if (this._selectedTool === DrawingTools.CUSTOMSVG) {
      this.updateComments().then(e2 =>
        e2.subscribe(e1 => {
          this.currentComment = e1.body;
          this.selectedTool = DrawingTools.SELECT;
          this.svgselect = '';
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
    const originalToObject = FabricObject.prototype.toObject;
    const myAdditional: any[] = ['id'];
    FabricObject.prototype.toObject = function (additionalProperties) {
      return originalToObject.call(this, myAdditional.concat(additionalProperties));
    };
    /*    fabric.FabricObject.prototype.toObject = (function (toObject) {
      return function (this: CustomFabricObject) {

        return fabric.util..extend(toObject.call(this), {
          id: this.id,
        });
      };
    })(fabric.Object.prototype.toObject);*/
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
    /*    this.updateComments().then(e2 =>
      e2.subscribe(e1 => {
        this.currentComment = e1.body!;
      }),
    );*/

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

  objectModified() {
    switch (this._selectedTool) {
      case DrawingTools.TEXT:
        this.selectedTool = DrawingTools.SELECT;
        break;
      default:
        break;
    }
    this.updateComments().then(e2 =>
      e2.subscribe(e1 => {
        this.currentComment = e1.body!;
      }),
    );
  }

  objectScaling(id: string, type: FabricObjectType, newScales: { x: number; y: number }, newCoords: { left: number; top: number }) {
    const o1 = this.canvas.getObjects().filter(o => (o as any).id === id)[0];
    const l = o1.aCoords?.tl.x;
    const t = o1.aCoords?.tl.y;
    const w = o1.aCoords?.br.x! - o1.aCoords?.tl.x!;
    const h = o1.aCoords?.br.y! - o1.aCoords?.tl.y!;
    /*  this.updateComments().then(e2 =>
      e2.subscribe(e1 => {
        this.currentComment = e1.body!;
      }),
    );*/

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
    if (this.canvas !== undefined && this.canvas !== null) {
      this.canvas.forEachObject(obj => {
        obj.selectable = isSelectable;
      });
    }
  }

  private getOtherEllipses(notIncludedId: string): CustomFabricEllipse[] {
    return this.canvas
      .getObjects(FabricObjectType.ELLIPSE)
      .filter(e => (e as CustomFabricEllipse).id !== notIncludedId) as CustomFabricEllipse[];
  }
}
