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
import { FabricShapeService } from './shape.service';
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
} from './models';
import { Injectable } from '@angular/core';
import { CustomFabricGroup } from './models';
import { IZone } from '../../../entities/zone/zone.model';
import { ZoneService } from '../../../entities/zone/service/zone.service';
import { ExamService } from '../../../entities/exam/service/exam.service';
import { IExam } from '../../../entities/exam/exam.model';
import { IQuestion, Question } from '../../../entities/question/question.model';
import { QuestionService } from '../../../entities/question/service/question.service';
import { PageHandler } from './fabric-canvas/PageHandler';
import { TranslateService } from '@ngx-translate/core';
import { PreferenceService } from '../../preference-page/preference.service';
import { CustomZone } from './fabric-canvas/fabric-canvas.component';
import { ConfirmationService } from 'primeng/api';

const RANGE_AROUND_CENTER = 20;

@Injectable({
  providedIn: 'root',
})
export class EventHandlerService {
  public imageDataUrl!: string;
  public canvas!: fabric.Canvas;
  public allcanvas: fabric.Canvas[] = [];
  private _selectedTool: DrawingTools = DrawingTools.SELECT;
  private previousTop!: number;
  private previousLeft!: number;
  private previousScaleX!: number;
  private previousScaleY!: number;
  public modelViewpping = new Map<string, number>();
  public nextQuestionNumero = 1;
  pages: { [page: number]: PageHandler } = {};
  zonesRendering: { [page: number]: CustomZone[] } = {};
  private cb!: (qid: number | undefined) => void;
  confService!: ConfirmationService;

  set selectedTool(t: DrawingTools) {
    this.allcanvas.forEach(e => {
      e.discardActiveObject();
      e.renderAll();
    });
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
      this.translateService.get('scanexam.removeAllAnnotation').subscribe(name => {
        this.confService.confirm({
          message: name,
          accept: () => {
            //      const background = this.canvas.backgroundImage;
            this.allcanvas.forEach(c => {
              c.getObjects().forEach(o => this.canvas.remove(o));
              c.clear();
              c.renderAll();
            });
            this.modelViewpping.forEach((e, id1) => {
              this.zoneService.delete(e).subscribe();
            });
            this.modelViewpping.clear();
          },
        });
      });
    }
  }
  get selectedTool(): DrawingTools {
    return this._selectedTool;
  }
  _selectedColour: DrawingColours = DrawingColours.BLACK;
  set selectedColour(c: DrawingColours) {
    this._selectedColour = c;
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }
  get selectedColour(): DrawingColours {
    return this._selectedColour;
  }
  selectedThickness: DrawingThickness = DrawingThickness.THIN;
  private _isMouseDown = false;
  public _elementUnderDrawing:
    | CustomFabricEllipse
    | CustomFabricRect
    | CustomFabricGroup
    | CustomFabricPath
    | CustomFabricLine
    | CustomFabricGroup
    | CustomFabricPolygon
    | undefined;
  private _initPositionOfElement!: Pointer;

  private _exam!: IExam;
  set exam(c: IExam) {
    this._exam = c;
  }

  addZoneRendering(page: number, tzones: CustomZone) {
    if (!this.zonesRendering[page]) {
      this.zonesRendering[page] = [];
      this.zonesRendering[page].push(tzones);
    } else {
      this.zonesRendering[page].push(tzones);
    }
  }

  setCurrentQuestionNumber(number: string) {
    if (this.currentSelected !== undefined) {
      (this.currentSelected as any).text = 'Question ' + number;
      this.currentSelected = undefined;
      this.allcanvas.forEach(e => {
        e.discardActiveObject();
        e.renderAll();
      });
      this.cb(undefined);

      // this.canvas.discardActiveObject();
      // this.canvas.renderAll();

      //   this.selectedTool = DrawingTools.SELECT
    }
  }

  drawingToolObserver!: (d: DrawingTools) => void;

  constructor(
    private fabricShapeService: FabricShapeService,
    private zoneService: ZoneService,
    private examService: ExamService,
    private questionService: QuestionService,
    private translateService: TranslateService,
    private preferenceService: PreferenceService
  ) {}

  registerSelectedToolObserver(f: (d: DrawingTools) => void): any {
    this.drawingToolObserver = f;
  }

  setConfirmationService(confService: ConfirmationService): void {
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
          pointer
        );
        break;
      case DrawingTools.NOMBOX:
      case DrawingTools.PRENOMBOX:
      case DrawingTools.INEBOX:
      case DrawingTools.RECTANGLE:
        this._elementUnderDrawing = this.fabricShapeService.createRectangle(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          DrawingColours.RED,
          pointer
        );
        break;
      case DrawingTools.QUESTIONBOX:
        this._elementUnderDrawing = this.fabricShapeService.createRectangle(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          DrawingColours.GREEN,
          pointer
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
          pointer
        );
        break;
      case DrawingTools.DASHED_LINE:
        this._elementUnderDrawing = this.fabricShapeService.createLine(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          [5, 5],
          pointer
        );
        break;
      case DrawingTools.POLYGON:
        if (!this._elementUnderDrawing) {
          this._elementUnderDrawing = this.fabricShapeService.createPolygon(
            this.canvas,
            this.selectedThickness,
            this._selectedColour,
            pointer
          );
        } else {
          if (
            this.fabricShapeService.isClickNearPolygonCenter(this._elementUnderDrawing as CustomFabricPolygon, pointer, RANGE_AROUND_CENTER)
          ) {
            this._elementUnderDrawing = this.fabricShapeService.finishPolygon(
              this.canvas,
              this._elementUnderDrawing as CustomFabricPolygon
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
        });
        break;
    }
  }

  mouseMove(e: Event) {
    if (!this._isMouseDown) {
      return;
    }
    const pointer = this.canvas.getPointer(e);
    switch (this._selectedTool) {
      case DrawingTools.ELLIPSE:
        this.fabricShapeService.formEllipse(this._elementUnderDrawing as CustomFabricEllipse, this._initPositionOfElement, pointer);
        break;
      case DrawingTools.NOMBOX:
      case DrawingTools.PRENOMBOX:
      case DrawingTools.INEBOX:
      case DrawingTools.QUESTIONBOX:
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
          pointer
        );
        break;
    }
    this.canvas.renderAll();
  }

  mouseUp() {
    this._isMouseDown = false;
    if (this._selectedTool === DrawingTools.PENCIL) {
      this._elementUnderDrawing = this.fabricShapeService.finishPath(this.canvas, this._elementUnderDrawing as CustomFabricPath);
    } else if (this._selectedTool === DrawingTools.NOMBOX) {
      this.translateService.get('scanexam.nomuc1').subscribe(name => {
        this._elementUnderDrawing = this.fabricShapeService.createBox(
          this.canvas,
          this._elementUnderDrawing as CustomFabricRect,
          name,
          DrawingColours.BLUE
        );

        const z: IZone = {
          pageNumber: (this.canvas as any).page,
          xInit: Math.trunc(
            (this._elementUnderDrawing.left! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth
          ),
          yInit: Math.trunc(
            (this._elementUnderDrawing.top! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight
          ),
          width: Math.trunc(
            (this._elementUnderDrawing.width! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth
          ),
          height: Math.trunc(
            (this._elementUnderDrawing.height! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight
          ),
        };
        const uid = this._elementUnderDrawing.id;
        this.zoneService.create(z).subscribe(z1 => {
          const ezone = z1.body! as CustomZone;
          ezone.type = DrawingTools.NOMBOX;
          this.addZoneRendering(z1.body!.pageNumber!, ezone);
          this.modelViewpping.set(uid, z1.body!.id!);
          this._exam.namezoneId = z1.body!.id!;
          this.examService.update(this._exam).subscribe(e => {
            this.exam = e.body!;
            this.selectedTool = DrawingTools.SELECT;
          });
        });
      });
    } else if (this._selectedTool === DrawingTools.PRENOMBOX) {
      this.translateService.get('scanexam.prenomuc1').subscribe(name => {
        this._elementUnderDrawing = this.fabricShapeService.createBox(
          this.canvas,
          this._elementUnderDrawing as CustomFabricRect,
          name,
          DrawingColours.BLUE
        );
        const z: IZone = {
          pageNumber: (this.canvas as any).page,
          xInit: Math.trunc(
            (this._elementUnderDrawing.left! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth
          ),
          yInit: Math.trunc(
            (this._elementUnderDrawing.top! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight
          ),
          width: Math.trunc(
            (this._elementUnderDrawing.width! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth
          ),
          height: Math.trunc(
            (this._elementUnderDrawing.height! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight
          ),
        };
        const uid = this._elementUnderDrawing.id;
        this.zoneService.create(z).subscribe(z1 => {
          const ezone = z1.body! as CustomZone;
          ezone.type = DrawingTools.PRENOMBOX;
          this.addZoneRendering(z1.body!.pageNumber!, ezone);

          this.modelViewpping.set(uid, z1.body!.id!);
          this._exam.firstnamezoneId = z1.body!.id!;
          this.examService.update(this._exam).subscribe(e => {
            this.exam = e.body!;
            this.selectedTool = DrawingTools.SELECT;
          });
        });
      });
    } else if (this._selectedTool === DrawingTools.INEBOX) {
      this.translateService.get('scanexam.ineuc1').subscribe(name => {
        this._elementUnderDrawing = this.fabricShapeService.createBox(
          this.canvas,
          this._elementUnderDrawing as CustomFabricRect,
          name,
          DrawingColours.BLUE
        );
        const z: IZone = {
          pageNumber: (this.canvas as any).page,
          xInit: Math.trunc(
            (this._elementUnderDrawing.left! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth
          ),
          yInit: Math.trunc(
            (this._elementUnderDrawing.top! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight
          ),
          width: Math.trunc(
            (this._elementUnderDrawing.width! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth
          ),
          height: Math.trunc(
            (this._elementUnderDrawing.height! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight
          ),
        };
        const uid = this._elementUnderDrawing.id;
        this.zoneService.create(z).subscribe(z1 => {
          const ezone = z1.body! as CustomZone;
          ezone.type = DrawingTools.INEBOX;
          this.addZoneRendering(z1.body!.pageNumber!, ezone);

          this.modelViewpping.set(uid, z1.body!.id!);
          this._exam.idzoneId = z1.body!.id!;
          this.examService.update(this._exam).subscribe(e => {
            this.exam = e.body!;
            this.selectedTool = DrawingTools.SELECT;
          });
        });
      });
    } else if (this._selectedTool === DrawingTools.QUESTIONBOX) {
      const numero = this.nextQuestionNumero;
      this.nextQuestionNumero = this.nextQuestionNumero + 1;
      this.translateService.get('scanexam.questionuc1').subscribe(name => {
        this._elementUnderDrawing = this.fabricShapeService.createBox(
          this.canvas,
          this._elementUnderDrawing as CustomFabricRect,
          name + numero,
          DrawingColours.BLUE
        );

        const z: IZone = {
          pageNumber: (this.canvas as any).page,
          xInit: Math.trunc(
            (this._elementUnderDrawing.left! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth
          ),
          yInit: Math.trunc(
            (this._elementUnderDrawing.top! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight
          ),
          width: Math.trunc(
            (this._elementUnderDrawing.width! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth
          ),
          height: Math.trunc(
            (this._elementUnderDrawing.height! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight
          ),
        };
        const uid = this._elementUnderDrawing.id;
        this.zoneService.create(z).subscribe(z1 => {
          const ezone = z1.body! as CustomZone;
          ezone.type = DrawingTools.QUESTIONBOX;
          this.addZoneRendering(z1.body!.pageNumber!, ezone);
          const pref = this.preferenceService.getPreferenceForQuestion();
          this.modelViewpping.set(uid, z1.body!.id!);

          const q = new Question();
          q.zoneId = z1.body!.id!;
          q.examId = this._exam.id;
          q.typeId = pref.typeId;
          q.numero = numero;
          q.point = pref.point;
          q.step = pref.step;
          q.gradeType = pref.gradeType;
          this.questionService.create(q).subscribe(e => {
            this.selectedTool = DrawingTools.SELECT;
            this.cb(z1.body!.id!);
          });
        });
      });
    }
    if (this._selectedTool !== DrawingTools.POLYGON) {
      this._elementUnderDrawing = undefined;
    }
    if (this._selectedTool !== DrawingTools.SELECT) {
      this.canvas.renderAll();
    } else {
      this.allcanvas
        .filter(c => c !== this.canvas)
        .forEach(c => {
          c.discardActiveObject();
          c.renderAll();
        });
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

  currentSelected: fabric.Object | undefined;

  objectSelected(object: CustomFabricObject): void {
    this.cb(undefined);
    this.previousLeft = object.left!;
    this.previousTop = object.top!;
    this.previousScaleX = object.scaleX!;
    this.previousScaleY = object.scaleY!;
    switch (this._selectedTool) {
      case DrawingTools.SELECT:
        if (object.type === FabricObjectType.GROUP) {
          if (((object as CustomFabricGroup).getObjects()[1] as any).text.startsWith('Question')) {
            this.cb(this.modelViewpping.get(object.id));
            this.currentSelected = (object as CustomFabricGroup).getObjects()[1];
          }
        }

        break;

      case DrawingTools.ERASER:
        if (object.type === FabricObjectType.ELLIPSE) {
          const otherEllipses = this.getOtherEllipses(object.id);
          otherEllipses.forEach(e => this.canvas.remove(e));
        }
        this.zoneService.delete(this.modelViewpping.get(object.id)!).subscribe();
        this.modelViewpping.delete(object.id);
        this.canvas.remove(object);

        break;
      case DrawingTools.FILL:
        this.fabricShapeService.fillShape(object, this._selectedColour);
        break;
    }
  }

  objectMoving(id: string, type: FabricObjectType, newLeft: number, newTop: number) {
    const l = newLeft;
    const t = newTop;
    const nid = id;
    this.zoneService
      .partialUpdate({
        id: this.modelViewpping.get(nid),
        xInit: Math.trunc((l! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth),
        yInit: Math.trunc((t! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight),
      })
      .subscribe();

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
    this.zoneService
      .partialUpdate({
        id: this.modelViewpping.get(id),
        xInit: Math.trunc((l! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth),
        yInit: Math.trunc((t! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight),
        width: Math.trunc((w! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientWidth),
        height: Math.trunc((h! * 100000) / this.pages[(this.canvas as any).page].pageViewer.canvas.clientHeight),
      })
      .subscribe();
    /* this.zoneService.objectScaling({
      left : Math.trunc(newCoords.left * 100),
      top : Math.trunc(newCoords.top * 100),
      x : newScales.x,
      y : newScales.y
    },
    this.modelViewpping.get(id)!).subscribe(z => console.log(z.body)  )*/

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

  registerQuestionCallBack(cb: (qid: number | undefined) => void) {
    this.cb = cb;
  }
}
