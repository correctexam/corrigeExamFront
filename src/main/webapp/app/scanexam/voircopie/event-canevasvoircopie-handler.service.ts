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
      console.log((c as any).zoneid);
      this.commentsService.query({ zonegeneratedid: (c as any).zoneid }).subscribe(e1 => {
        if (!(e1!.body === undefined || e1!.body?.length === 0)) {
          fabric.loadSVGFromString(e1!.body![0].jsonData!, (objects, options) => {
            // const obj = fabric.util.groupSVGElements(objects, options);
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

  constructor(private fabricShapeService: FabricShapeService, public commentsService: CommentsService) {}

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
