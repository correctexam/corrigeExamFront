/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/member-ordering */
import { fabric } from 'fabric';
import {
  CustomFabricEllipse,
  CustomFabricIText,
  CustomFabricLine,
  CustomFabricObject,
  CustomFabricPath,
  CustomFabricPolygon,
  CustomFabricRect,
  DrawingColours,
  DrawingThickness,
  FabricObjectType,
  Pointer,
} from './models';
import { v4 as uuid } from 'uuid';

const DEFAULT_OPACITY = 0.2;
const FILLED_WITH_COLOUR_OPACITY = 0.4;

export class FabricShapeService {
  fillShape(object: CustomFabricObject, colour: DrawingColours) {
    switch (object.type) {
      case FabricObjectType.RECT:
      case FabricObjectType.ELLIPSE:
      case FabricObjectType.POLYGON:
        object.fill = this.setOpacity(colour, FILLED_WITH_COLOUR_OPACITY);
        break;
      case FabricObjectType.LINE:
      case FabricObjectType.PATH:
        object.stroke = colour;
        break;
      case FabricObjectType.I_TEXT:
        object.stroke = colour;
        object.fill = colour;
    }
  }

  private setOpacity(colour: DrawingColours, to: number): string {
    const opacityOfRGBA = new RegExp('(\\d\\.\\d|\\d)\\)');
    return colour.replace(opacityOfRGBA, `${to})`);
  }

  isClickNearPolygonCenter(polygon: CustomFabricPolygon, pointer: Pointer, range: number): boolean {
    const centerXOfPolygon = (Math.max(...polygon.points!.map(p => p.x)) + Math.min(...polygon.points!.map(p => p.x))) / 2;
    const centerYOfPolygon = (Math.max(...polygon.points!.map(p => p.y)) + Math.min(...polygon.points!.map(p => p.y))) / 2;
    return Math.abs(pointer.x - centerXOfPolygon) <= range && Math.abs(pointer.y - centerYOfPolygon) <= range;
  }

  // Creators

  createEllipse(canvas: fabric.Canvas, thickness: DrawingThickness, colour: DrawingColours, pointer: Pointer): CustomFabricEllipse {
    const ellipse = new fabric.Ellipse({
      left: pointer.x,
      top: pointer.y,
      strokeWidth: thickness,
      stroke: colour,
      fill: this.setOpacity(DrawingColours.WHITE, DEFAULT_OPACITY),
      originX: 'left',
      originY: 'top',
      rx: 0,
      ry: 0,
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomFabricEllipse;
    ellipse.id = uuid();
    canvas.add(ellipse);
    return ellipse;
  }

  createRectangle(canvas: fabric.Canvas, thickness: DrawingThickness, colour: DrawingColours, pointer: Pointer): CustomFabricRect {
    const rect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      strokeWidth: thickness,
      stroke: colour,
      fill: this.setOpacity(DrawingColours.RED, DEFAULT_OPACITY),
      width: 0,
      height: 0,
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomFabricRect;
    rect.id = uuid();
    canvas.add(rect);
    //    canvas.renderAll();
    return rect;
  }

  createPath(
    canvas: fabric.Canvas,
    selectedThickness: DrawingThickness,
    selectedColour: DrawingColours,
    pointer: Pointer
  ): CustomFabricPath {
    const path = new fabric.Path(`M ${pointer.x} ${pointer.y}`, {
      strokeWidth: selectedThickness,
      stroke: selectedColour,
      fill: '',
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomFabricPath;
    path.id = uuid();
    canvas.add(path);
    return path;
  }

  createLine(
    canvas: fabric.Canvas,
    selectedThickness: DrawingThickness,
    selectedColour: DrawingColours,
    dashArray: number[],
    pointer: Pointer
  ): CustomFabricLine {
    const line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: selectedThickness,
      stroke: selectedColour,
      fill: this.setOpacity(DrawingColours.WHITE, DEFAULT_OPACITY),
      strokeDashArray: dashArray,
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomFabricLine;
    line.id = uuid();
    canvas.add(line);
    return line;
  }

  createPolygon(
    canvas: fabric.Canvas,
    selectedThickness: DrawingThickness,
    selectedColour: DrawingColours,
    pointer: Pointer
  ): CustomFabricPolygon {
    const polygon = new fabric.Polygon([pointer], {
      strokeWidth: selectedThickness,
      stroke: selectedColour,
      fill: this.setOpacity(DrawingColours.WHITE, DEFAULT_OPACITY),
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomFabricPolygon;
    polygon.id = uuid();
    canvas.add(polygon);
    return polygon;
  }

  createIText(
    canvas: fabric.Canvas,
    opts: {
      content?: string;
      thickness?: DrawingThickness;
      colour?: DrawingColours;
      pointer: { x: number; y: number };
      fontSize?: number;
    }
  ): CustomFabricIText {
    const iText = new fabric.IText(opts.content || 'Text', {
      strokeWidth: opts.thickness || DrawingThickness.THIN / 2,
      stroke: opts.colour || DrawingColours.BLACK,
      fill: opts.colour || DrawingColours.BLACK,
      fontSize: opts.fontSize || 15,
      left: opts.pointer.x,
      top: opts.pointer.y,
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomFabricIText;
    iText.id = uuid();
    canvas.add(iText);
    return iText;
  }

  // Formers

  formEllipse(ellipse: CustomFabricEllipse, initPos: Pointer, pointer: Pointer) {
    ellipse.set({
      rx: Math.abs((initPos.x - pointer.x) / 2),
      ry: Math.abs((initPos.y - pointer.y) / 2),
    });
    ellipse.setCoords();
  }

  formRectangle(rect: CustomFabricRect, initPos: Pointer, pointer: Pointer) {
    rect.set({
      width: Math.abs(initPos.x - pointer.x),
      height: Math.abs(initPos.y - pointer.y),
    });
    rect.set({ left: Math.min(pointer.x, initPos.x) });
    rect.set({ top: Math.min(pointer.y, initPos.y) });
    rect.setCoords();
  }

  formPath(path: CustomFabricPath, pointer: Pointer) {
    const newLine = ['L', pointer.x, pointer.y];
    path.path!.push(newLine as any);
  }

  formLine(line: CustomFabricLine, pointer: Pointer) {
    line.set({ x2: pointer.x, y2: pointer.y });
    line.setCoords();
  }

  formFirstLineOfPolygon(polygon: CustomFabricPolygon, initialPointer: Pointer, pointer: Pointer) {
    polygon.points = [new fabric.Point(initialPointer.x, initialPointer.y), new fabric.Point(pointer.x, pointer.y)];
  }

  addPointToPolygon(polygon: CustomFabricPolygon, pointer: Pointer) {
    polygon.points!.push(new fabric.Point(pointer.x, pointer.y));
  }

  // Finishers

  finishPath(canvas: fabric.Canvas, path: CustomFabricPath): CustomFabricPath {
    canvas.remove(path);
    const newPath = new fabric.Path(path.path, {
      strokeWidth: path.strokeWidth,
      stroke: path.stroke,
      fill: '',
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomFabricPath;
    newPath.id = path.id;
    canvas.add(newPath);
    return newPath;
  }

  finishPolygon(canvas: fabric.Canvas, polygon: CustomFabricPolygon): CustomFabricPolygon {
    canvas.remove(polygon);
    const newPolygon = new fabric.Polygon(polygon.points!, {
      strokeWidth: polygon.strokeWidth,
      stroke: polygon.stroke,
      fill: this.setOpacity(DrawingColours.WHITE, DEFAULT_OPACITY),
      selectable: false,
      hasRotatingPoint: false,
    }) as CustomFabricPolygon;
    newPolygon.id = polygon.id;
    canvas.add(newPolygon);
    return newPolygon;
  }
}
