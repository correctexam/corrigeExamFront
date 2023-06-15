/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/member-ordering */
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
import { PageHandler, PagedCanvas } from './fabric-canvas/PageHandler';
import { TranslateService } from '@ngx-translate/core';
import { PreferenceService } from '../../preference-page/preference.service';
import { CustomZone } from './fabric-canvas/fabric-canvas.component';
import { ConfirmationService } from 'primeng/api';
import { IText } from 'fabric/fabric-impl';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventHandlerService {
  public readonly coefficient = 100000;
  public selectedThickness: DrawingThickness = DrawingThickness.THIN;
  public canvas!: PagedCanvas;
  public allcanvas: Map<number, PagedCanvas> = new Map();
  public pages: { [page: number]: PageHandler } = {};
  public questions: Map<number, IQuestion> = new Map();
  private currentSelected: fabric.Object | undefined;
  private imageDataUrl!: string;
  private zonesRendering: { [page: number]: CustomZone[] } = {};
  private _elementUnderDrawing:
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
  private _selectedTool: DrawingTools = DrawingTools.SELECT;
  private previousTop!: number;
  private previousLeft!: number;
  private previousScaleX!: number;
  private previousScaleY!: number;
  private cb!: (qid: number | undefined) => void;
  private _isMouseDown = false;
  private _selectedColour: DrawingColours = DrawingColours.BLACK;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private drawingToolObserver: (d: DrawingTools) => void = () => {};
  private confService!: ConfirmationService;
  private modelViewpping = new Map<string, number>();

  public constructor(
    private fabricShapeService: FabricShapeService,
    private zoneService: ZoneService,
    private examService: ExamService,
    private questionService: QuestionService,
    private translateService: TranslateService,
    private preferenceService: PreferenceService
  ) {}

  public set exam(c: IExam) {
    this._exam = c;
  }

  public set selectedColour(c: DrawingColours) {
    this._selectedColour = c;
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  public get selectedColour(): DrawingColours {
    return this._selectedColour;
  }

  public get selectedTool(): DrawingTools {
    return this._selectedTool;
  }

  public set selectedTool(t: DrawingTools) {
    this.allcanvas.forEach(e => {
      e.discardActiveObject();
      e.renderAll();
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this.drawingToolObserver(t);
    this._selectedTool = t;
    this.objectsSelectable(
      this._selectedTool === DrawingTools.SELECT || this._selectedTool === DrawingTools.ERASER || this._selectedTool === DrawingTools.FILL
    );

    if (this.selectedTool === DrawingTools.GARBAGE) {
      this.removeAll();
    }
  }

  private removeAll(): void {
    this.translateService.get('scanexam.removeAllAnnotation').subscribe(name => {
      this.confService.confirm({
        message: name,
        accept: () => {
          this.allcanvas.forEach(c => {
            c.getObjects().forEach(o => this.canvas.remove(o));
            c.clear();
            c.renderAll();
          });

          this.examService.deleteAllZone(this._exam.id!).subscribe();
          this.modelViewpping.clear();
          this.questions.clear();
          this.zonesRendering = [];
        },
      });
    });
  }

  public addZoneRendering(page: number, tzones: CustomZone): void {
    if (this.zonesRendering[page] === undefined) {
      this.zonesRendering[page] = [];
      this.zonesRendering[page].push(tzones);
    } else {
      this.zonesRendering[page].push(tzones);
    }
  }

  public setCurrentQuestionNumber(number: string): void {
    if (this.currentSelected !== undefined) {
      (this.currentSelected as any).text = 'Question ' + number;

      // this.currentSelected = undefined;
      this.allcanvas.forEach(e => {
        e.renderAll();
      });
    }
  }

  public registerSelectedToolObserver(f: (d: DrawingTools) => void): void {
    this.drawingToolObserver = f;
  }

  public setConfirmationService(confService: ConfirmationService): void {
    this.confService = confService;
  }

  public addBGImageSrcToCanvas(): Promise<void> {
    if (!this.imageDataUrl) {
      return new Promise(resolve => {
        resolve(undefined);
      });
    }
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      // eslint-disable-next-line @typescript-eslint/require-await
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

  public mouseDown(e: Event): void {
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
          if (this.fabricShapeService.isClickNearPolygonCenter(this._elementUnderDrawing as CustomFabricPolygon, pointer, 20)) {
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

  public mouseMove(e: Event): void {
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

  public mouseUp(): void {
    const num = this.getNextQuestionNumero();

    this._isMouseDown = false;

    switch (this._selectedTool) {
      case DrawingTools.PENCIL:
        this._elementUnderDrawing = this.fabricShapeService.finishPath(this.canvas, this._elementUnderDrawing as CustomFabricPath);
        break;

      case DrawingTools.NOMBOX:
        this.translateService.get('scanexam.nomuc1').subscribe((name: string) => {
          this.createBlueBox(DrawingTools.NOMBOX, name, num);
        });
        break;

      case DrawingTools.PRENOMBOX:
        this.translateService.get('scanexam.prenomuc1').subscribe((name: string) => {
          this.createBlueBox(DrawingTools.PRENOMBOX, name, num);
        });
        break;

      case DrawingTools.INEBOX:
        this.translateService.get('scanexam.ineuc1').subscribe((name: string) => {
          this.createBlueBox(DrawingTools.INEBOX, name, num);
        });
        break;

      case DrawingTools.QUESTIONBOX:
        this.translateService.get('scanexam.questionuc1').subscribe((name: string) => {
          this.createBlueBox(DrawingTools.QUESTIONBOX, name + String(num), num);
        });
        break;
    }

    if (this._selectedTool !== DrawingTools.POLYGON) {
      this._elementUnderDrawing = undefined;
    }

    if (this._selectedTool === DrawingTools.SELECT) {
      Array.from(this.allcanvas.values())
        .filter(c => c !== this.canvas)
        .forEach(c => {
          c.discardActiveObject();
          c.renderAll();
        });
    } else {
      this.canvas.renderAll();
    }
  }

  private createZone(obj: CustomFabricObject): IZone {
    return {
      pageNumber: this.canvas.page,
      xInit: Math.trunc((obj.left! * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientWidth),
      yInit: Math.trunc((obj.top! * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientHeight),
      width: Math.trunc((obj.width! * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientWidth),
      height: Math.trunc((obj.height! * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientHeight),
    };
  }

  private createBlueBox(
    type: DrawingTools.NOMBOX | DrawingTools.PRENOMBOX | DrawingTools.INEBOX | DrawingTools.QUESTIONBOX,
    boxName: string,
    qnum: number
  ): void {
    this._elementUnderDrawing = this.fabricShapeService.createBox(
      this.canvas,
      this._elementUnderDrawing as CustomFabricRect,
      boxName,
      DrawingColours.BLUE
    );

    const customObject = this._elementUnderDrawing;
    const z = this.createZone(this._elementUnderDrawing);
    const uid = this._elementUnderDrawing.id;

    this.zoneService.create(z).subscribe(z1 => {
      const ezone = z1.body! as CustomZone;
      ezone.type = type;
      this.addZoneRendering(z1.body!.pageNumber!, ezone);
      this.modelViewpping.set(uid, z1.body!.id!);

      switch (type) {
        case DrawingTools.NOMBOX:
          this._exam.namezoneId = z1.body!.id!;
          break;
        case DrawingTools.INEBOX:
          this._exam.idzoneId = z1.body!.id!;
          break;
        case DrawingTools.PRENOMBOX:
          this._exam.firstnamezoneId = z1.body!.id!;
          break;
      }

      if (type === DrawingTools.QUESTIONBOX) {
        const pref = this.preferenceService.getPreferenceForQuestion();
        const q = new Question();
        q.zoneId = z1.body!.id!;
        q.examId = this._exam.id;
        q.typeId = pref.typeId;
        q.numero = qnum;
        q.point = pref.point;
        q.step = pref.step;
        q.gradeType = pref.gradeType;

        this.questionService.create(q).subscribe(() => {
          this.selectedTool = DrawingTools.SELECT;
          this.cb(z1.body?.id);

          // Selecting the new question
          if (this.selectQuestion(customObject)) {
            this.eraseAddQuestion(z1.body!.id!, true);
            this.canvas.setActiveObject(customObject);
            this.canvas.renderAll();
          }
        });
      } else {
        this.examService.update(this._exam).subscribe(e => {
          this._exam = e.body!;
          this.selectedTool = DrawingTools.SELECT;
        });
      }
    });
  }

  public getCanvasForPage(page: number): PagedCanvas | undefined {
    return this.allcanvas.get(page);
  }

  public createRedBox(translationToken: string, zone: IZone, page: number): void {
    const c = this.getCanvasForPage(page);

    if (c !== undefined) {
      this.translateService.get(translationToken).subscribe(e => {
        const r = this.fabricShapeService.createBoxFromScratch(
          c,
          /*          {
            x: (zone.xInit! * c.width!) / this.coefficient,
            y: (zone.yInit! * c.height!) / this.coefficient,
          },
          (zone.width! * c.width!) / this.coefficient,
          (zone.height! * c.height!) / this.coefficient,*/
          {
            x: (zone.xInit! * this.pages[page].pageViewer.canvas.clientWidth) / this.coefficient,
            y: (zone.yInit! * this.pages[page].pageViewer.canvas.clientHeight) / this.coefficient,
          },
          (zone.width! * this.pages[page].pageViewer.canvas.clientWidth) / this.coefficient,
          (zone.height! * this.pages[page].pageViewer.canvas.clientHeight) / this.coefficient,

          e,
          DrawingColours.RED
        );
        this.modelViewpping.set(r.id, zone.id!);
      });
    }
  }

  public createRedQuestionBox(zone: IZone, page: number): void {
    const canvas = this.allcanvas.get(page);

    this.translateService.get('scanexam.questionuc1').subscribe((name: string) => {
      this.questionService.query({ zoneId: zone.id }).subscribe(e => {
        if (e.body !== null && e.body.length > 0) {
          const r = this.fabricShapeService.createBoxFromScratch(
            canvas!,
            {
              x: (zone.xInit! * this.pages[page].pageViewer.canvas.clientWidth) / this.coefficient,
              y: (zone.yInit! * this.pages[page].pageViewer.canvas.clientHeight) / this.coefficient,
            },
            (zone.width! * this.pages[page].pageViewer.canvas.clientWidth) / this.coefficient,
            (zone.height! * this.pages[page].pageViewer.canvas.clientHeight) / this.coefficient,
            name + String(e.body[0].numero),
            DrawingColours.GREEN
          );
          this.modelViewpping.set(r.id, zone.id!);
        }
      });
    });
  }

  public initPage(page: number, pageViewer: any): void {
    if (this.pages[page] === undefined) {
      this.pages[page] = new PageHandler(pageViewer, page, this);
    }
  }

  public extendToObjectWithId(): void {
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (this: CustomFabricObject): fabric.Object {
        return fabric.util.object.extend(toObject.call(this), {
          id: this.id,
        }) as fabric.Object;
      };
    })(fabric.Object.prototype.toObject);
  }

  /**
   * Selects the given question (if it is a question)
   * @returns True if the question is selected, false otherwise
   */
  private selectQuestion(object: CustomFabricObject): boolean {
    if (this.isAQuestion(object)) {
      this.cb(this.modelViewpping.get(object.id));
      this.currentSelected = (object as CustomFabricGroup).getObjects()[1];
      return true;
    }
    return false;
  }

  public objectSelected(object: CustomFabricObject): void {
    this.cb(undefined);
    this.previousLeft = object.left!;
    this.previousTop = object.top!;
    this.previousScaleX = object.scaleX!;
    this.previousScaleY = object.scaleY!;
    switch (this._selectedTool) {
      case DrawingTools.SELECT:
        this.selectQuestion(object);
        break;

      case DrawingTools.ERASER:
        this.eraseObject(object);
        break;

      case DrawingTools.FILL:
        this.fabricShapeService.fillShape(object, this._selectedColour);
        break;
    }
  }

  /**
   * Erases the given object from the canvas
   */
  private eraseObject(object: fabric.Object): void {
    const customObject = object as CustomFabricObject;
    // Getting the zone id
    const zid = this.modelViewpping.get(customObject.id);

    if (zid !== undefined) {
      if (this.isAQuestion(object)) {
        this.eraseAddQuestion(zid, false).then(() => {
          this.zoneService.delete(zid).subscribe();
          this.modelViewpping.delete(customObject.id);
        });
      } else {
        this.zoneService.delete(zid).subscribe();
        this.modelViewpping.delete(customObject.id);
      }

      // Have to delete the question from the summary
    }

    if (object.type === FabricObjectType.GROUP) {
      const custObj = object as CustomFabricGroup;

      custObj.getObjects().forEach(o => {
        this.eraseObject(o);
      });
    }

    if (object.type === FabricObjectType.ELLIPSE) {
      const otherEllipses = this.getOtherEllipses((object as CustomFabricObject).id);
      otherEllipses.forEach(e => this.canvas.remove(e));
    }

    this.canvas.remove(object);
  }

  /**
   * States whether the given object is a question
   * @returns True if it is a question.
   */
  private isAQuestion(object: fabric.Object): boolean {
    return (
      object.type === FabricObjectType.GROUP &&
      (((object as CustomFabricGroup).getObjects()[1] as IText).text?.startsWith('Question') ?? false)
    );
  }

  /**
   * Adds or remove the question that corresponds to the given zone id.
   * @param zoneId The id of the zone that contains the question
   * @param add True: add the question. Otherwise, removes the question.
   */
  private async eraseAddQuestion(zoneId: number, add: boolean): Promise<void> {
    return firstValueFrom(this.questionService.query({ zoneId })).then(res => {
      if (add) {
        this.addQuestion(res.body?.[0]?.numero!);
      } else {
        this.questions.delete(res.body?.[0]?.id!);
      }
    });
  }

  /**
   * Getting the questions corresponding to the given number (REST query) and adding them to `questions`
   */
  public addQuestion(numero: number): void {
    this.questionService.query({ examId: this._exam.id!, numero }).subscribe(qs => {
      qs.body?.forEach(q => {
        if (q.id !== undefined) {
          this.questions.set(q.id, q);
        }
      });
    });
  }

  public objectMoving(id: string, type: FabricObjectType, newLeft: number, newTop: number): void {
    const l = newLeft;
    const t = newTop;
    const nid = id;
    this.zoneService
      .partialUpdate({
        id: this.modelViewpping.get(nid),
        xInit: Math.trunc((l * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientWidth),
        yInit: Math.trunc((t * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientHeight),
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

  public objectScaling(
    id: string,
    type: FabricObjectType,
    newScales: { x: number; y: number },
    newCoords: { left: number; top: number }
  ): void {
    const o1 = this.canvas.getObjects().filter(o => (o as any).id === id)[0];
    const l = o1.aCoords?.tl.x;
    const t = o1.aCoords?.tl.y;
    const w = o1.aCoords?.br.x! - o1.aCoords?.tl.x!;
    const h = o1.aCoords?.br.y! - o1.aCoords?.tl.y!;
    this.zoneService
      .partialUpdate({
        id: this.modelViewpping.get(id),
        xInit: Math.trunc((l! * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientWidth),
        yInit: Math.trunc((t! * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientHeight),
        width: Math.trunc((w * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientWidth),
        height: Math.trunc((h * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientHeight),
      })
      .subscribe();

    if (type !== FabricObjectType.ELLIPSE) {
      return;
    }
    const scaleDiffX = newScales.x - this.previousScaleX;
    const scaleDiffY = newScales.y - this.previousScaleY;
    this.previousScaleX = newScales.x;
    this.previousScaleY = newScales.y;

    const otherEllipses = this.getOtherEllipses(id);
    otherEllipses.forEach(e => {
      e.scaleX! += scaleDiffX;
      e.scaleY! += scaleDiffY;
    });
    this.objectMoving(id, type, newCoords.left, newCoords.top);
  }

  private objectsSelectable(isSelectable: boolean): void {
    this.canvas.forEachObject(obj => {
      obj.selectable = isSelectable;
    });
  }

  private getOtherEllipses(notIncludedId: string): CustomFabricEllipse[] {
    return this.canvas
      .getObjects(FabricObjectType.ELLIPSE)
      .map(e => e as CustomFabricEllipse)
      .filter(e => e.id !== notIncludedId);
  }

  public registerQuestionCallBack(cb: (qid: number | undefined) => void): void {
    this.cb = cb;
  }

  public reinit(exam: IExam, zones: { [page: number]: CustomZone[] }): void {
    // Requires to flush all the cached canvases to compute new ones
    this.allcanvas = new Map();
    this.currentSelected = undefined;
    this._elementUnderDrawing = undefined;
    this._selectedTool = DrawingTools.SELECT;
    this._exam = exam;
    this.zonesRendering = zones;
    this.questions.clear();
  }

  public getNextQuestionNumero(): number {
    const next = new Set(Array.from(this.questions.values()).map(value => value.numero!));
    let i = 1;
    while (next.has(i)) {
      i = i + 1;
    }
    return i;
  }
}
