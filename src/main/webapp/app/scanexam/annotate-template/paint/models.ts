/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import fabric from 'fabric';
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
  NOMBOX = 'NOMBOX',
  PRENOMBOX = 'PRENOMBOX',
  INEBOX = 'INEBOX',
  QUESTIONBOX = 'QUESTIONBOX',
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
  idbase: number;
}
export type CustomFabricObject = fabric.Object & CustomFabricProps;
export type CustomFabricRect = fabric.Rect & CustomFabricProps;
export type CustomFabricGroup = fabric.Group & CustomFabricProps;
export type CustomFabricEllipse = fabric.Ellipse & CustomFabricProps;
export type CustomFabricLine = fabric.Line & CustomFabricProps;
export type CustomFabricPolygon = fabric.Polygon & CustomFabricProps;
export type CustomFabricIText = fabric.IText & { id: string; idbase: number };
export type CustomFabricPath = fabric.Path & { id: string; idbase: number };

export enum FabricObjectType {
  RECT = 'rect',
  ELLIPSE = 'ellipse',
  I_TEXT = 'i-text',
  LINE = 'line',
  POLYGON = 'polygon',
  PATH = 'path',
  GROUP = 'group',
  NOM = 'nom',
  PRENOM = 'prenom',
  INE = 'ine',
  QUESTION = 'question',
}
