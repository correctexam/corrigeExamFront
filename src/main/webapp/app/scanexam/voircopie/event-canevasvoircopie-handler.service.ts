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
import { Canvas as fCanvas, loadSVGFromString, FabricObject } from 'fabric';
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
  public _canvas!: fCanvas;
  get canvas(): fCanvas {
    return this._canvas;
  }
  set canvas(c: fCanvas) {
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
          loadSVGFromString(s2).then(obj1 => {
            // const obj = fabric.util.groupSVGElements(objects, options);
            if (obj1.objects.length > 0) {
              obj1.objects.forEach(obj => {
                if (obj) {
                  obj.selectable = false;
                  c.add(obj);
                }
              });
              c.renderAll();
            }
          });
        }
      });
    }
  }
  currentComment: IComments | null = null;
  public allcanvas: fCanvas[] = [];
  public scale = 1;

  constructor(
    private fabricShapeService: FabricShapeService,
    public commentsService: CommentsService,
  ) {}

  extendToObjectWithId(): void {
    const originalToObject = FabricObject.prototype.toObject;
    const myAdditional: any[] = ['id'];
    FabricObject.prototype.toObject = function (additionalProperties) {
      return originalToObject.call(this, myAdditional.concat(additionalProperties));
    };
  }
}
