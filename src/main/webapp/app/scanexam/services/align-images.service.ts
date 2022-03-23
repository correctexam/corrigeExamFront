/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlignImagesService {
  worker!: Worker;
  ready!: Promise<void>;
  subjects = new Map<string, Subject<any>>();
  constructor() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker(new URL('../../opencv.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        if (this.subjects.has(data.uid)) {
          this.subjects.get(data.uid)?.next(data.payload);
          this.subjects.get(data.uid)?.complete();
        }
        //   console.log(`service got message1: ${JSON.stringify(data.msg)}`);
      };
      this.worker.onerror = e => {
        if (this.subjects.has((e as any).uid)) {
          this.subjects.get((e as any).uid)?.error(e);
        }
        console.log(`error on service work: ${JSON.stringify(e)}`);
      };
      this.worker.postMessage({ msg: 'load', uid: '0' });
      const p = new Subject();
      this.subjects.set('0', p);

      this.ready = new Promise((res, rej) => {
        this.subjects
          .get('0')
          ?.asObservable()
          .subscribe(
            () => {
              res();
            },
            () => rej()
          );
      });
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  /**
   * We will use this method privately to communicate with the worker and
   * return a promise with the result of the event. This way we can call
   * the worker asynchronously.
   */
  private _dispatch(msg1: any, pay: any): Observable<any> {
    const uuid1 = uuid(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    this.ready.then(() => this.worker.postMessage({ msg: msg1, uid: uuid1, payload: pay }));
    const p = new Subject();
    this.subjects.set(uuid1, p);
    return p.asObservable();
  }
  public imageProcessing(payload: any): Observable<any> {
    return this._dispatch('imageProcessing', payload);
  }

  public imageAlignement(payload: any): Observable<any> {
    return this._dispatch('imageAlignement', payload);
  }
}
