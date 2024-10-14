/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/member-ordering */
import { TPointerEvent, FabricImage as fImage, FabricObject } from 'fabric';
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
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { Platform } from '@angular/cdk/platform';

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
  private currentSelected: FabricObject | undefined;
  private imageDataUrl!: string;
  private zonesRendering: { [page: number]: CustomZone[] } = {};
  private _elementUnderDrawing:
    | CustomFabricEllipse
    | CustomFabricRect
    | CustomFabricGroup
    | CustomFabricPath
    | CustomFabricLine
    | CustomFabricPolygon
    | undefined;
  private _initPositionOfElement!: Pointer;
  private _exam!: IExam;
  private _selectedTool: DrawingTools = DrawingTools.SELECT;
  private previousTop!: number;
  private previousLeft!: number;
  private previousScaleX!: number;
  private previousScaleY!: number;
  private _isMouseDown = false;
  private _selectedColour: DrawingColours = DrawingColours.BLACK;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private drawingToolObserver: (d: DrawingTools) => void = () => {};
  private confService!: ConfirmationService;
  private modelViewpping = new Map<string, number>();
  /** Used to notify about newly selected or unselected question */
  private _selectedQuestion: Subject<IQuestion | undefined> = new Subject();

  public constructor(
    private fabricShapeService: FabricShapeService,
    private zoneService: ZoneService,
    private examService: ExamService,
    private questionService: QuestionService,
    private translateService: TranslateService,
    private preferenceService: PreferenceService,
    private platform: Platform,
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
      this._selectedTool === DrawingTools.SELECT || this._selectedTool === DrawingTools.ERASER || this._selectedTool === DrawingTools.FILL,
    );

    if (this.selectedTool === DrawingTools.GARBAGE) {
      this.removeAll();
    } else if (this.selectedTool === DrawingTools.ERASER) {
      const ps = [...this.allcanvas.keys()];
      ps.forEach(p => {
        if (this.pages[p] !== undefined) {
          this.pages[p].changeAllCursor(true);
        }
      });
    } else {
      const ps = [...this.allcanvas.keys()];
      ps.forEach(p => {
        if (this.pages[p] !== undefined) {
          this.pages[p].changeAllCursor(false);
        }
      });
    }
  }

  private removeAll(): void {
    this.zoneService.countStudentResponseForExam(this._exam.id!).subscribe(e1 => {
      const nbreStudentResponse = e1.body;

      this.translateService.get('scanexam.removeAllAnnotation', { nbreStudentResponse }).subscribe(name => {
        this.confService.confirm({
          message: name,
          accept: () => {
            this.removeAllAction();
          },
          reject: () => {
            this.selectedTool = DrawingTools.SELECT;
          },
        });
      });
    });
  }

  removeAllAction(): void {
    this.allcanvas.forEach(c => {
      c.getObjects().forEach(o => this.canvas.remove(o));
      c.clear();
      c.renderAll();
    });

    this.examService.deleteAllZone(this._exam.id!).subscribe();
    this.modelViewpping.clear();
    this.questions.clear();
    this.zonesRendering = [];
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
        const f_img = new fImage(img);
        this.canvas.setWidth(f_img.width!);
        this.canvas.setHeight(f_img.height!);
        this.canvas.backgroundImage = f_img;

        //        this.canvas.setBackgroundImage(f_img, resolve);
      };
      img.onerror = () => {
        reject();
      };
      img.src = this.imageDataUrl;
    });
  }

  public mouseDown(e: TPointerEvent): void {
    this._isMouseDown = true;
    //    const pointer = this.canvas.getPointer(e);
    const pointer = this.canvas.getScenePoint(e);
    this._initPositionOfElement = { x: pointer.x, y: pointer.y };

    switch (this._selectedTool) {
      case DrawingTools.SELECT:
        Array.from(this.allcanvas.values())
          .filter(c => c !== this.canvas)
          .forEach(c => {
            c.discardActiveObject();
            c.renderAll();
          });
        break;
      case DrawingTools.ELLIPSE:
        this._elementUnderDrawing = this.fabricShapeService.createEllipse(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          pointer,
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
          pointer,
        );
        break;
      case DrawingTools.QUESTIONBOX:
        this._elementUnderDrawing = this.fabricShapeService.createRectangle(
          this.canvas,
          this.selectedThickness,
          this._selectedColour,
          DrawingColours.GREEN,
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
          if (this.fabricShapeService.isClickNearPolygonCenter(this._elementUnderDrawing as CustomFabricPolygon, pointer, 20)) {
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
        });
        break;
    }
  }

  public mouseMove(e: TPointerEvent): void {
    if (!this._isMouseDown) {
      return;
    }
    const pointer = this.canvas.getScenePoint(e);
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
          pointer,
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

    /* if (this._selectedTool === DrawingTools.SELECT) {
      Array.from(this.allcanvas.values())
        .filter(c => c !== this.canvas)
        .forEach(c => {
          c.discardActiveObject();
          c.renderAll();
        });
    } else {*/
    this.canvas.renderAll();
    // }
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
    qnum: number,
  ): void {
    this._elementUnderDrawing = this.fabricShapeService.createBox(
      this.canvas,
      this._elementUnderDrawing as CustomFabricRect,
      boxName,
      DrawingColours.BLUE,
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

          // Adding the question to the canvas and selecting it
          this.eraseAddQuestion(z1.body!.id!, true).then(() => {
            this.selectQuestion(customObject);
            this.canvas.setActiveObject(customObject);
            this.canvas.renderAll();
          });
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
          DrawingColours.RED,
        );
        this.modelViewpping.set(r.id, zone.id!);
      });
    }
  }

  public createRedQuestionBox(zone: IZone, page: number): void {
    const canvas = this.allcanvas.get(page);
    if (canvas !== undefined) {
      this.translateService.get('scanexam.questionuc1').subscribe((name: string) => {
        this.questionService.query({ zoneId: zone.id }).subscribe(e => {
          if (e.body !== null && e.body.length > 0) {
            const r = this.fabricShapeService.createBoxFromScratch(
              canvas,
              {
                x: (zone.xInit! * this.pages[page].pageViewer.canvas.clientWidth) / this.coefficient,
                y: (zone.yInit! * this.pages[page].pageViewer.canvas.clientHeight) / this.coefficient,
              },
              (zone.width! * this.pages[page].pageViewer.canvas.clientWidth) / this.coefficient,
              (zone.height! * this.pages[page].pageViewer.canvas.clientHeight) / this.coefficient,
              name + String(e.body[0].numero),
              DrawingColours.GREEN,
            );
            this.modelViewpping.set(r.id, zone.id!);
          }
        });
      });
    }
  }

  public initPage(page: number, pageViewer: any): void {
    if (this.pages[page] === undefined) {
      this.pages[page] = new PageHandler(pageViewer, page, this, this.platform);
    }
  }

  public extendToObjectWithId(): void {
    const originalToObject = FabricObject.prototype.toObject;
    const myAdditional: any[] = ['id'];
    FabricObject.prototype.toObject = function (additionalProperties) {
      return originalToObject.call(this, myAdditional.concat(additionalProperties));
    };
  }

  /**
   * Triggers unselection of objects
   */
  public unselectObject(): void {
    //  this.allcanvas.forEach((v,k)=> console.error(k,v?.selection))

    // No more question selected
    this._selectedQuestion.next(undefined);
  }

  /**
   * Selects the given question (if it is a question)
   * @returns True if the question is selected, false otherwise
   */
  private selectQuestion(object: CustomFabricObject): void {
    const id = this.modelViewpping.get(object.id);
    // Finding the question corresponding to the zone id from the cache
    const question = typeof id === 'number' ? [...this.questions.values()].find(q => q.zoneId === id) : undefined;

    if (question !== undefined && this.isAQuestion(object)) {
      // // Getting all the questions with the same number (one question divided into several parts)
      // let questions = [...this.questions.values()].filter(q => q.numero === question.numero);
      // // Need to put the truely selected question at first position in the array
      // questions = [question, ...questions.filter(q => q.id !== question.id)];
      // Notifying that this bunch of questions is selected

      this.currentSelected = (object as CustomFabricGroup).getObjects()[1];
      this._selectedQuestion.next(question);
    }
  }

  public objectSelected(object: CustomFabricObject): void {
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
  private async eraseObject(object: FabricObject): Promise<void> {
    const customObject = object as CustomFabricObject;
    // Getting the zone id
    const zid = this.modelViewpping.get(customObject.id);

    if (zid !== undefined) {
      if (this.isAQuestion(object)) {
        // TODO check the number of AnswerFor This Question I more than one add a check
        const nbrAnswer = await firstValueFrom(this.zoneService.countStudentResponseForZone(zid));
        if (nbrAnswer.body === 0) {
          await this.eraseAddQuestion(zid, false);
          await firstValueFrom(this.zoneService.delete(zid));
          this.modelViewpping.delete(customObject.id);
          await this.eraseObjectI(object);
        } else {
          this.translateService.get('scanexam.removeAnnotationQuestion').subscribe(name => {
            this.confService.confirm({
              message: name,
              accept: () => {
                this.eraseAddQuestion(zid, false).then(() => {
                  firstValueFrom(this.zoneService.delete(zid)).then(() => {
                    this.modelViewpping.delete(customObject.id);
                    this.eraseObjectI(object);
                  });
                });
              },
              reject: () => {
                this.selectedTool = DrawingTools.SELECT;
              },
            });
          });
        }
      } else {
        this.zoneService.delete(zid).subscribe();
        this.modelViewpping.delete(customObject.id);
        await this.eraseObjectI(object);
      }
    } else {
      await this.eraseObjectI(object);
    }
  }

  async eraseObjectI(object: FabricObject): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (object.type === FabricObjectType.GROUP) {
      const custObj = object as CustomFabricGroup;
      for (const o of custObj.getObjects()) {
        await this.eraseObject(o);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
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
  private isAQuestion(object: FabricObject): boolean {
    return (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
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
      // 'return' for chaining the promises
      if (add) {
        return this.addQuestion(res.body?.[0]?.numero!);
      }
      return new Promise(resolve => {
        this.questions.delete(res.body?.[0]?.id!);
        resolve();
      });
    });
  }

  /**
   * Getting the questions corresponding to the given number (REST query) and adding them to `questions`
   */
  public async addQuestion(numero: number): Promise<void> {
    return firstValueFrom(this.questionService.query({ examId: this._exam.id!, numero })).then(qs => {
      qs.body?.forEach(q => {
        if (q.id !== undefined) {
          this.questions.set(q.id, q);
        }
      });
    });
  }

  /**
   * Updates the cache of question using the given question.
   */
  public updateQuestion(q: IQuestion): void {
    this.questions.set(q.id!, q);
  }

  public objectMoving(id: string, type: FabricObjectType, newLeft: number, newTop: number): void {
    let l = newLeft;
    let t = newTop;
    const nid = id;
    const height = this.canvas.getActiveObject() ? this.canvas.getActiveObject()!.height! : 0;
    const width = this.canvas.getActiveObject() ? this.canvas.getActiveObject()!.width! : 0;
    if (l < 0) {
      if (this.canvas.getActiveObject() !== undefined) {
        this.canvas.getActiveObject()!.left = 0;
      }
      l = 0;
    } else if (l > this.pages[this.canvas.page].pageViewer.canvas.clientWidth - width) {
      l = this.pages[this.canvas.page].pageViewer.canvas.clientWidth - width;
      if (this.canvas.getActiveObject() !== undefined) {
        this.canvas.getActiveObject()!.left = this.pages[this.canvas.page].pageViewer.canvas.clientWidth - width;
      }
    }
    if (t < 0) {
      t = 0;
      if (this.canvas.getActiveObject() !== undefined) {
        this.canvas.getActiveObject()!.top = 0;
      }
    } else if (t > this.pages[this.canvas.page].pageViewer.canvas.clientHeight - height) {
      t = this.pages[this.canvas.page].pageViewer.canvas.clientHeight - height;
      if (this.canvas.getActiveObject() !== undefined) {
        this.canvas.getActiveObject()!.top = this.pages[this.canvas.page].pageViewer.canvas.clientHeight - height;
      }
    }

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
    newCoords: { left: number; top: number },
  ): void {
    const o1 = this.canvas.getObjects().filter(o => (o as any).id === id)[0];

    let l = o1.aCoords?.tl.x!;
    let w = o1.aCoords?.br.x! - o1.aCoords?.tl.x!;
    let t = o1.aCoords?.tl.y!;
    let h = o1.aCoords?.br.y! - o1.aCoords?.tl.y!;

    if (l < 0) {
      l = 0;

      if (this.canvas.getActiveObject() !== undefined) {
        this.canvas.getActiveObject()!.left = 0;
        w = o1.aCoords?.br.x!;
        this.canvas.getActiveObject()!.scaleX = w / this.canvas.getActiveObject()!.width!;
      }
    }

    if (t < 0) {
      t = 0;
      if (this.canvas.getActiveObject() !== undefined) {
        this.canvas.getActiveObject()!.top = 0;
        h = o1.aCoords?.br.y!;
        this.canvas.getActiveObject()!.scaleY = h / this.canvas.getActiveObject()!.height!;
      }
    }

    if (l + w > this.pages[this.canvas.page].pageViewer.canvas.clientWidth) {
      w = this.pages[this.canvas.page].pageViewer.canvas.clientWidth - l;
      if (this.canvas.getActiveObject() !== undefined) {
        this.canvas.getActiveObject()!.scaleX = w / this.canvas.getActiveObject()!.width!;
      }
    }
    if (t + h > this.pages[this.canvas.page].pageViewer.canvas.clientHeight) {
      h = this.pages[this.canvas.page].pageViewer.canvas.clientHeight - t;
      if (this.canvas.getActiveObject() !== undefined) {
        this.canvas.getActiveObject()!.scaleY = h / this.canvas.getActiveObject()!.height!;
      }
    }
    this.zoneService
      .partialUpdate({
        id: this.modelViewpping.get(id),
        xInit: Math.trunc((l * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientWidth),
        yInit: Math.trunc((t * this.coefficient) / this.pages[this.canvas.page].pageViewer.canvas.clientHeight),
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

  cleanCanvassCache(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.allcanvas !== undefined) {
      //   this.selectedTool = DrawingTools.PENCIL;
      this.currentSelected = undefined;
      this._elementUnderDrawing = undefined;

      this.allcanvas.forEach(c => {
        c.getObjects().forEach(o => this.canvas.remove(o));
        c.clear();
        c.renderAll();
      });

      this.modelViewpping.clear();
      this.zonesRendering = [];

      this.allcanvas.clear();
      this.questions.clear();
      this.pages = {};
    }
  }

  public reinit(exam: IExam, zones: { [page: number]: CustomZone[] }): void {
    // Requires to flush all the cached canvases to compute new ones
    this.cleanCanvassCache();
    this._exam = exam;
    this.zonesRendering = zones;
    this.allcanvas.clear();
    this.currentSelected = undefined;
    this._elementUnderDrawing = undefined;
    this._selectedTool = DrawingTools.SELECT;
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

  /**
   * An observable for being notified on question selection change.
   * Returns an array since several questions can have the same number (numero).
   * But the first question of the array (if not empty) is the truely selected question.
   * Can be empty is nothing is selected.
   */
  public getSelectedQuestion(): Observable<IQuestion | undefined> {
    return this._selectedQuestion;
  }

  public selectQuestionView(q: IQuestion): void {
    this._selectedQuestion.next(q);
  }
}
