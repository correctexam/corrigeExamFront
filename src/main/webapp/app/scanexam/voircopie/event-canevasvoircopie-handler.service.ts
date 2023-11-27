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
import { CustomFabricObject } from '../annotate-template/paint/models';
import { Injectable } from '@angular/core';
import { IComments } from '../../entities/comments/comments.model';
import { CommentsService } from '../../entities/comments/service/comments.service';
import { SVG, extend as SVGextend, Element as SVGElement, G, Text } from '@svgdotjs/svg.js';
import { svgadapter } from '../svg.util';

@Injectable({
  providedIn: 'root',
})
export class EventCanevasVoirCopieHandlerService {
  public _canvas!: fabric.Canvas;
  get canvas(): fabric.Canvas {
    return this._canvas;
  }
  set canvas(c: fabric.Canvas) {
    const prev = this._canvas;
    this._canvas = c;

    if (c !== prev) {
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
          fabric.loadSVGFromString(s2, (objects, options) => {
            // const obj = fabric.util.groupSVGElements(objects, options);
            if (objects.length > 0) {
              objects.forEach(obj => {
                obj.selectable = false;
                c.add(obj);
              });
              c.renderAll();
            }
          });
        }
      });
    }
  }
  currentComment: IComments | null = null;
  public allcanvas: fabric.Canvas[] = [];
  public scale = 1;

  constructor(
    private fabricShapeService: FabricShapeService,
    public commentsService: CommentsService,
  ) {}

  extendToObjectWithId(): void {
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (this: CustomFabricObject) {
        return fabric.util.object.extend(toObject.call(this), {
          id: this.id,
        });
      };
    })(fabric.Object.prototype.toObject);
  }
}
