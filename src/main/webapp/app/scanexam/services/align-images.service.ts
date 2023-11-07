/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { worker } from './workerimport';
import { ICluster, IPage } from '../associer-copies-etudiants/associer-copies-etudiants.component';
import { DoPredictionsInputDifferentPage, DoPredictionsInputSamePage, DoPredictionsOutput } from 'app/opencv.worker';
import { IZone } from 'app/entities/zone/zone.model';

export interface IImageAlignement {
  imageAligned?: ArrayBuffer;
  imageAlignedWidth?: number;
  imageAlignedHeight?: number;
  pageNumber?: number;
  imagesDebugTraces?: ArrayBuffer;
  imagesDebugTracesWidth?: number;
  imagesDebugTracesHeight?: number;
}

export interface IPreference {
  qcm_min_width_shape: number;
  qcm_min_height_shape: number;
  qcm_epsilon: number;
  qcm_differences_avec_case_blanche: number;
  linelength: number;
  repairsize: number;
  dilatesize: number;
  morphsize: number;
  drawcontoursizeh: number;
  drawcontoursizev: number;
  minCircle: number;
  maxCircle: number;
  numberofpointToMatch: number;
  numberofgoodpointToMatch: number;
  defaultAlignAlgowithMarker: boolean;
  removeHorizontalName: boolean;
  pdfscale: number;
  cacheDb: string;
  imageTypeExport: string;
  exportImageCompression: number;
}

export interface IImageAlignementInput {
  //  imageA?: ImageData;
  //  imageB?: ImageData;
  imageA: ArrayBuffer;
  imageB: ArrayBuffer;
  marker?: boolean;
  x?: number;
  y?: number;
  widthA?: number;
  heightA?: number;
  widthB?: number;
  heightB?: number;
  pageNumber?: number;
  preference: IPreference;
  debug: boolean;
}
export interface IImageCropInput {
  image?: ArrayBuffer;
  imageWidth: number;
  imageHeight: number;

  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
export interface IImageCropFromZoneInput {
  z: IZone;
  page: number;
  align: boolean;
  template: boolean;
  examId: number;
  indexDb: boolean;
  factor: number;
}
export interface IImageCropFromZoneOutput {
  image: ArrayBuffer;
  page: number;
  width: number;
  height: number;
}

export interface IQCMInput {
  imageTemplate?: ImageData;
  pages?: IQCMImageInput[];
  widthZone?: number;
  heightZone?: number;
  preference: IPreference;
}

export interface IQCMOutput {
  solutions?: IQCMSolution[];
}
export interface IQCMImageInput {
  imageInput?: ImageData;
  numero?: number;
}

export interface IQCMSolution {
  imageSolution?: ImageData;
  numero?: number;
  solution?: string;
}

export interface IImagePredictionInput {
  image?: ImageData;
  match?: string[];
  preference: IPreference;
}
export interface IImagePredictionTemplateInput {
  template: ImageData;
  image: ImageData;
  match: string[];
  preference: IPreference;
}
export interface IImagePredictionOutput {
  solution?: (string | number)[];
  debug: ImageData;
}

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
      this.worker = worker;
      this.worker.onmessage = ({ data }) => {
        if (this.subjects.has(data.uid)) {
          // console.log( ' receive message '  + data.uid)

          this.subjects.get(data.uid)?.next(data.payload);
          this.subjects.get(data.uid)?.complete();
        } else {
          if (data.msg !== undefined) {
            console.error(data.msg.log);
          }
        }
        //   console.log(`service got message1: ${JSON.stringify(data.msg)}`);
      };
      this.worker.onerror = e => {
        if (this.subjects.has((e as any).uid)) {
          console.log('get error uid');
          this.subjects.get((e as any).uid)?.error(e);
        }
        console.log(`error on service work: ${JSON.stringify(e)}`);
      };
      this.worker.postMessage({ msg: 'load', uid: '0', payload: { fronturl: FRONT_URL } });
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
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  /**
   * We will use this method privately to communicate with the worker and
   * return a promise with the result of the event. This way we can call
   * the worker asynchronously.
   */
  private _dispatch<T>(msg1: any, pay: any, transferable?: any): Observable<T> {
    const uuid1 = uuid(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    console.time('dispatch' + uuid1);
    this.ready.then(() => {
      console.timeLog('dispatch' + uuid1, 'before send message', msg1, pay);

      // console.log( ' send message ' + msg1 + ' ' + uuid1)
      if (transferable) {
        this.worker.postMessage({ msg: msg1, uid: uuid1, payload: pay }, transferable);
      } else {
        this.worker.postMessage({ msg: msg1, uid: uuid1, payload: pay });
      }
      console.timeEnd('dispatch' + uuid1);
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

  public imageCrop(payload: IImageCropInput): Observable<ArrayBuffer> {
    return this._dispatch('imageCrop', payload, [payload.image]);
  }

  public imageCropFromZone(payload: IImageCropFromZoneInput): Observable<IImageCropFromZoneOutput> {
    return this._dispatch('imageCropFromZone', payload);
  }

  public groupImagePerContoursLength(payload: ICluster): Observable<number[]> {
    const transferable = payload.images.map(image => image.image);
    return this._dispatch('groupImagePerContoursLength', payload, transferable);
  }

  public prediction(payload: IImagePredictionInput, letter: boolean): Observable<IImagePredictionOutput> {
    if (letter) {
      return this._dispatch('nameprediction', payload);
    } else {
      return this._dispatch('ineprediction', payload);
    }
  }

  public doPredictions(payload: DoPredictionsInputDifferentPage | DoPredictionsInputSamePage): Observable<DoPredictionsOutput[]> {
    return this._dispatch('doPredictions', payload);
  }

  public predictionTemplate(payload: IImagePredictionTemplateInput, letter: boolean): Observable<IImagePredictionOutput> {
    if (letter) {
      return this._dispatch('namepredictionTemplate', payload);
    } else {
      return this._dispatch('inepredictionTemplate', payload);
    }
  }

  public correctQCM(payload: IQCMInput): Observable<IQCMOutput> {
    return this._dispatch('qcmresolution', payload);
  }
}
