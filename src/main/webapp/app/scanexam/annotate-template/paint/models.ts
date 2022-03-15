import { fabric } from 'fabric';
export enum DrawingColours {
  BLACK = 'rgba(0,0,0,1)',
  WHITE = 'rgba(255,255,255,1)',
  RED = 'rgba(255,0,0,1)',
  GREEN = 'rgba(0,255,0,1)',
  BLUE = 'rgba(0,0,255,1)',
  YELLOW = 'rgba(255,255,0,1)',
}

export enum DrawingThickness {
  THIN = 1,
  MEDIUM = 3,
  THICK = 5,
}

export enum DrawingTools {
  SELECT = 'SELECT',
  ERASER = 'ERASER',
  ELLIPSE = 'ELLIPSE',
  RECTANGLE = 'RECTANGLE',
  PENCIL = 'PENCIL',
  LINE = 'LINE',
  DASHED_LINE = 'DASHED_LINE',
  POLYGON = 'POLYGON',
  FILL = 'FILL',
  TEXT = 'TEXT',
  GARBAGE = 'GARBAGE',
}

export interface Pointer {
  x: number;
  y: number;
}

interface CustomFabricProps {
  id: string;
}
export type CustomFabricObject = fabric.Object & CustomFabricProps;
export type CustomFabricRect = fabric.Rect & CustomFabricProps;
export type CustomFabricEllipse = fabric.Ellipse & CustomFabricProps;
export type CustomFabricLine = fabric.Line & CustomFabricProps;
export type CustomFabricPolygon = fabric.Polygon & CustomFabricProps;
export type CustomFabricIText = fabric.IText & { id: string };
export type CustomFabricPath = fabric.Path & { id: string };

export enum FabricObjectType {
  RECT = 'rect',
  ELLIPSE = 'ellipse',
  I_TEXT = 'i-text',
  LINE = 'line',
  POLYGON = 'polygon',
  PATH = 'path',
}
