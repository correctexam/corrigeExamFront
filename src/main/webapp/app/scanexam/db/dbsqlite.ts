/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Observable, Subject } from 'rxjs';
import { workersqllite } from '../services/workerimport';
import { v4 as uuid } from 'uuid';
import { AlignImage, CacheService, ImageDB, Template } from './db';
import { ExportOptions, ImportOptions } from 'dexie-export-import';

export class SqliteCacheService implements CacheService {
  ready!: Promise<void>;
  subjects = new Map<string, Subject<any>>();
  worker: Worker = workersqllite;
  constructor() {
    if (typeof Worker !== 'undefined') {
      //  Create a new
      workersqllite.onmessage = ({ data }) => {
        //        console.error(' receive message ', data);
        if (this.subjects.has(data.uid)) {
          //   console.error( ' receive message '  + data.uid)
          switch (data.msg) {
            case 'getFirstNonAlignImage': {
              const enc = new TextDecoder('utf-8');
              const arr = new Uint8Array(data.payload.value);
              data.payload.value = enc.decode(arr);
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            case 'getFirstAlignImage': {
              const enc = new TextDecoder('utf-8');
              const arr = new Uint8Array(data.payload.value);
              data.payload.value = enc.decode(arr);
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            case 'getFirstTemplate': {
              const enc = new TextDecoder('utf-8');
              const arr = new Uint8Array(data.payload.value);
              data.payload.value = enc.decode(arr);
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            case 'getNonAlignImageBetweenAndSortByPageNumber': {
              const enc = new TextDecoder('utf-8');
              data.payload.forEach((res: any) => {
                const arr = new Uint8Array(res.value);
                res.value = enc.decode(arr);
                // console.error(res.value)
              });

              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            case 'getAlignImageBetweenAndSortByPageNumber': {
              const enc = new TextDecoder('utf-8');
              data.payload.forEach((res: any) => {
                const arr = new Uint8Array(res.value);
                res.value = enc.decode(arr);
              });
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            case 'getNonAlignImagesForPageNumbers': {
              const enc = new TextDecoder('utf-8');
              data.payload.forEach((res: any) => {
                const arr = new Uint8Array(res.value);
                res.value = enc.decode(arr);
              });
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            case 'getAlignImagesForPageNumbers': {
              const enc = new TextDecoder('utf-8');
              data.payload.forEach((res: any) => {
                const arr = new Uint8Array(res.value);
                res.value = enc.decode(arr);
              });
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            case 'getNonAlignSortByPageNumber': {
              const enc = new TextDecoder('utf-8');
              data.payload.forEach((res: any) => {
                const arr = new Uint8Array(res.value);
                res.value = enc.decode(arr);
              });
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            case 'getAlignSortByPageNumber': {
              const enc = new TextDecoder('utf-8');
              data.payload.forEach((res: any) => {
                const arr = new Uint8Array(res.value);
                res.value = enc.decode(arr);
              });
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();

              break;
            }
            default: {
              this.subjects.get(data.uid)?.next(data.payload);
              this.subjects.get(data.uid)?.complete();
            }
          }
        }
      };
      this.worker.onerror = e => {
        if (this.subjects.has((e as any).uid)) {
          console.log('get error uid');
          this.subjects.get((e as any).uid)?.error(e);
        }
        console.log(`error on service work: ${JSON.stringify(e)}`);
      };
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
            () => rej(),
          );
      });
    } else {
      //  Web workers are not supported in this environment.
      //  You should add a fallback so that your program still executes correctly.
    }
  }
  /**
   * We will use this method privately to communicate with the worker and
   * return a promise with the result of the event. This way we can call
   * the worker asynchronously.
   */
  private _dispatch<T>(msg1: any, pay: any, transferable?: any): Observable<T> {
    const uuid1 = uuid(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    this.ready.then(() => {
      //  console.error( ' send message ' + msg1 + ' ' + uuid1)
      if (transferable) {
        this.worker.postMessage({ msg: msg1, uid: uuid1, payload: pay }, transferable);
      } else {
        this.worker.postMessage({ msg: msg1, uid: uuid1, payload: pay });
      }
    });
    const p = new Subject<T>();
    this.subjects.set(uuid1, p);
    this.ready = new Promise((res, rej) => {
      this.subjects
        .get(uuid1)
        ?.asObservable()
        .subscribe(
          () => {
            res();
          },
          () => rej(),
        );
    });
    return p.asObservable();
  }

  load() {
    workersqllite.postMessage({ msg: 'load', uid: '0' });
  }

  async addAligneImage(elt: ImageDB) {
    const enc = new TextEncoder(); // always utf-8
    const el1 = {
      examId: elt.examId,
      pageNumber: elt.pageNumber,
      value: enc.encode(elt.value).buffer,
    };

    return this._dispatch('addAligneImage', el1, [el1.value]).toPromise();
  }

  async addNonAligneImage(elt: ImageDB) {
    const enc = new TextEncoder(); // always utf-8
    const el1 = {
      examId: elt.examId,
      pageNumber: elt.pageNumber,
      value: enc.encode(elt.value).buffer,
    };
    return this._dispatch('addNonAligneImage', el1, [el1.value]).toPromise();
  }

  export(examId: number, options?: ExportOptions | undefined): Promise<any> {
    return this._dispatch('export', {
      examId: examId,
      options: options,
    }).toPromise();
    //    return new Promise<any>((resolve, reject) => resolve(null));
  }
  import(examId: number, blob: Blob, options?: ImportOptions | undefined): Promise<any> {
    return this._dispatch('import', {
      examId: examId,
      blob: blob,
      options: options,
    }).toPromise();
  }
  countPageTemplate(examId: number): Promise<any> {
    return this._dispatch('countPageTemplate', {
      examId: examId,
    }).toPromise();
  }
  countAlignImage(examId: number): Promise<any> {
    return this._dispatch('countAlignImage', {
      examId: examId,
    }).toPromise();
  }
  countNonAlignImage(examId: number): Promise<any> {
    return this._dispatch('countNonAlignImage', {
      examId: examId,
    }).toPromise();
  }
  getFirstNonAlignImage(examId: number, pageInscan: number): Promise<any> {
    return this._dispatch('getFirstNonAlignImage', {
      examId: examId,
      pageInscan: pageInscan,
    }).toPromise();
  }
  getFirstAlignImage(examId: number, pageInscan: number): Promise<any> {
    return this._dispatch('getFirstAlignImage', {
      examId: examId,
      pageInscan: pageInscan,
    }).toPromise();
  }

  getFirstTemplate(examId: number, pageInscan: number): Promise<any> {
    return this._dispatch('getFirstTemplate', {
      examId: examId,
      pageInscan: pageInscan,
    }).toPromise();
  }
  getNonAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number): Promise<any> {
    return this._dispatch('getNonAlignImageBetweenAndSortByPageNumber', {
      examId: examId,
      p1: p1,
      p2: p2,
    }).toPromise();
  }
  getAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number): Promise<any> {
    return this._dispatch('getAlignImageBetweenAndSortByPageNumber', {
      examId: examId,
      p1: p1,
      p2: p2,
    }).toPromise();
  }

  getNonAlignImagesForPageNumbers(examId: number, pages: number[]): Promise<any> {
    return this._dispatch('getNonAlignImagesForPageNumbers', {
      examId: examId,
      pages: pages,
    }).toPromise();
  }
  getAlignImagesForPageNumbers(examId: number, pages: number[]): Promise<any> {
    return this._dispatch('getAlignImagesForPageNumbers', {
      examId: examId,
      pages: pages,
    }).toPromise();
  }

  getNonAlignSortByPageNumber(examId: number): Promise<any> {
    return this._dispatch('getNonAlignSortByPageNumber', {
      examId: examId,
    }).toPromise();
  }

  getAlignSortByPageNumber(examId: number): Promise<any> {
    return this._dispatch('getAlignSortByPageNumber', {
      examId: examId,
    }).toPromise();
  }
  addExam(examId: number): Promise<any> {
    return this._dispatch('addExam', {
      examId: examId,
    }).toPromise();
  }
  addTemplate(elt: AlignImage): Promise<any> {
    const enc = new TextEncoder(); // always utf-8

    const el1 = {
      examId: elt.examId,
      pageNumber: elt.pageNumber,
      value: enc.encode(elt.value).buffer,
    };
    return this._dispatch(
      'addTemplate',
      {
        elt: el1,
      },
      [el1.value],
    ).toPromise();
  }
  countNonAlignWithPageNumber(examId: number, pageInscan: number): Promise<any> {
    return this._dispatch('countNonAlignWithPageNumber', {
      examId: examId,
      pageInscan: pageInscan,
    }).toPromise();
  }
  countAlignWithPageNumber(examId: number, pageInscan: number): Promise<any> {
    return this._dispatch('countAlignWithPageNumber', {
      examId: examId,
      pageInscan: pageInscan,
    }).toPromise();
  }
  resetDatabase(): Promise<any> {
    return this._dispatch('resetDatabase', {}).toPromise();
  }
  removeExam(examId: number): Promise<any> {
    return this._dispatch('removeExam', {
      examId: examId,
    }).toPromise();
  }
  removeElementForExam(examId: number): Promise<any> {
    return this._dispatch('removeElementForExam', {
      examId: examId,
    }).toPromise();
  }

  removePageAlignForExam(examId: number): Promise<any> {
    return this._dispatch('removePageAlignForExam', {
      examId: examId,
    }).toPromise();
  }

  removeElementForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<any> {
    return this._dispatch('removeElementForExamForPages', {
      examId: examId,
      pageStart: pageStart,
      pageEnd: pageEnd,
    }).toPromise();
  }
  removePageAlignForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<any> {
    return this._dispatch('removePageAlignForExamForPages', {
      examId: examId,
      pageStart: pageStart,
      pageEnd: pageEnd,
    }).toPromise();
  }

  removePageNonAlignForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<any> {
    return this._dispatch('removePageNonAlignForExamForPages', {
      examId: examId,
      pageStart: pageStart,
      pageEnd: pageEnd,
    }).toPromise();
  }

  moveNonAlignPages(examId: number, from: number, to: number): Promise<any> {
    return this._dispatch('moveNonAlignPages', {
      examId: examId,
      from: from,
      to: to,
    }).toPromise();
  }

  moveAlignPages(examId: number, from: number, to: number): Promise<any> {
    return this._dispatch('moveAlignPages', {
      examId: examId,
      from: from,
      to: to,
    }).toPromise();
  }
}

export const db = new SqliteCacheService();
