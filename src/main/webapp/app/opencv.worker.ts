/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { MLModel } from './scanexam/ml/model';
import {
  //  decoupe,
  //  diffGrayAvecCaseBlanche,
  doQCMResolution,
  getOrigDimensions,
  getOrigPosition,
  IPreference,
  trouveCases,
  __comparePositionX,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} from './qcm';
import { IZone } from './entities/zone/zone.model';
import { AlignImage, AppDB, NonAlignImage, Template } from './scanexam/db/db';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';

// import { IImageCropFromZoneInput, IImageCropFromZoneOutput } from './scanexam/services/align-images.service';

/// <reference lib="webworker" />
declare let cv: any;
declare let tf: any;

interface ICluster {
  images: IImageCluster[];
  nbrCluster: number;
}

interface IImageCluster {
  image: ArrayBuffer;
  imageIndex: number;
  studentIndex: number;
  width?: number;
  height?: number;
}

export interface DoPredictionsInput {
  nameZone?: IZone;
  firstnameZone?: IZone;
  ineZone?: IZone;
  indexDb: boolean;
  align: boolean;
  examId: number;
  candidateName: string[];
  candidateFirstName: string[];
  candidateIne: string[];
  factor: number;
  preferences: IPreference;
  removeHorizontal: boolean;
  looking4missing: boolean;
  debug?: boolean;
}

export interface DoPredictionsOutput {
  nameZone?: ArrayBuffer;
  nameZoneDebug?: ArrayBuffer;
  nameZoneW?: number;
  nameZoneH?: number;
  firstnameZone?: ArrayBuffer;
  firstnameZoneDebug?: ArrayBuffer;
  firstnameZoneW?: number;
  firstnameZoneH?: number;
  ineZone?: ArrayBuffer;
  ineZoneDebug?: ArrayBuffer;
  ineZoneW?: number;
  ineZoneH?: number;
  page: number;
  name?: string;
  namePrecision?: number;
  firstname?: string;
  firstnamePrecision?: number;
  ine?: string;
  inePrecision?: number;
}

export interface DoPredictionsInputSamePage extends DoPredictionsInput {
  pagesToAnalyze: number[];
  pageTemplate: number;
}
export interface DoPredictionsInputDifferentPage extends DoPredictionsInput {
  namePagesToAnalyze: number[];
  firstnamePagesToAnalyze: number[];
  inePagesToAnalyze: number[];
}
/**
 * This exists to capture all the events that are thrown out of the worker
 * into the worker. Without this, there would be no communication possible
 * with our project.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let source: any;
let sqliteService: any;

export class SqliteCacheService {
  ready!: Promise<void>;
  subjects = new Map<string, Subject<any>>();

  constructor(public sqliteWorkerport: any) {
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
  }

  onmessage: (e1: any) => void = (e1: any) => {
    // (A)
    const data = e1.data;
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
      default: {
        this.subjects.get(data.uid)?.next(data.payload);
        this.subjects.get(data.uid)?.complete();
      }
    }
  };

  onerror: (e1: any) => void = (e1: any) => {
    if (this.subjects.has(e1.uid)) {
      console.log('get error uid');
      this.subjects.get(e1.uid)?.error(e1);
    }
    console.log(`error on service work: ${JSON.stringify(e1)}`);
  };

  private _dispatch<T>(msg1: any, pay: any, transferable?: any): Observable<T> {
    const uuid1 = uuid(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    this.ready.then(() => {
      if (transferable) {
        this.sqliteWorkerport.postMessage({ msg: msg1, uid: uuid1, payload: pay }, transferable);
      } else {
        this.sqliteWorkerport.postMessage({ msg: msg1, uid: uuid1, payload: pay });
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
  public getFirstNonAlignImage(examId: number, pageInscan: number): Promise<any> {
    return firstValueFrom(
      this._dispatch('getFirstNonAlignImage', {
        examId: examId,
        pageInscan: pageInscan,
      }),
    );
  }
  getFirstAlignImage(examId: number, pageInscan: number): Promise<any> {
    return firstValueFrom(
      this._dispatch('getFirstAlignImage', {
        examId: examId,
        pageInscan: pageInscan,
      }),
    );
  }

  getFirstTemplate(examId: number, pageInscan: number): Promise<any> {
    return firstValueFrom(
      this._dispatch('getFirstTemplate', {
        examId: examId,
        pageInscan: pageInscan,
      }),
    );
  }
}

addEventListener('message', e => {
  switch (e.data.msg) {
    case 'hello': {
      const response = `worker response to ${e.data.msg}`;
      postMessage({ msg: response, uid: e.data.uid });
      break;
    }
    case 'shareWorker': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const port = e.data.port; // (B)
      sqliteService = new SqliteCacheService(port);
      //      port.postMessage(['hello', 'world']);
      port.onmessage = sqliteService.onmessage;
      port.onerror = sqliteService.onerror;

      break;
    }
    case 'load': {
      source = e;
      // Import Webassembly script
      //self.importScripts('./content/opencv/4/opencv.js')
      const self1 = self as any;
      self1['Module'] = {
        scriptUrl: 'content/opencv/4/opencv.js',
        onRuntimeInitialized() {
          cv.then((cv1: any) => {
            cv = cv1;
            cv1.ready.then(() => postMessage({ msg: 'opencvready', uid: e.data.uid }));
          });
        },
      };

      //Load and await the .js OpenCV
      self1.importScripts(self1['Module'].scriptUrl);
      self1.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
      self1.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.20.0/dist/tf-backend-wasm.min.js');
      tf.wasm.setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.20.0/dist/');

      break;
    }
    case 'imageCrop':
      return imageCrop(e.data);
    case 'doPredictions':
      return doPredictions(e.data);
    case 'imageCropFromZone':
      return imageCropFromZone(e.data);

    /*    case 'nameprediction':
      return doPrediction(e.data, true);
    case 'ineprediction':
      return doPrediction(e.data, false);*/
    /*    case 'namepredictionTemplate':
      return doPredictionTemplate(e.data, true);
    case 'inepredictionTemplate':
      return doPredictionTemplate(e.data, false);*/
    case 'groupImagePerContoursLength':
      return groupImagePerContoursLength(e.data);
    case 'qcmresolution':
      return doQCMResolution(e.data);
    default:
      break;
  }
});

let db: AppDB | undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getTemplateImage(page: number, examId: number, indexDb: boolean): Promise<Template | undefined> {
  if (indexDb) {
    if (db === undefined) {
      db = new AppDB();
    }
    return await db.getFirstTemplate(examId, page);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await sqliteService.getFirstTemplate(examId, page);
  }
  /*else {
    if (align){
      return await db.getFirstAlignImage(examId,page);
    }else {
      return await db.getFirstNonAlignImage(examId,page);
    }
  }*/
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getScanImage(
  align: boolean,
  page: number,
  examId: number,
  indexDb: boolean,
): Promise<NonAlignImage | AlignImage | undefined> {
  if (indexDb) {
    if (db === undefined) {
      db = new AppDB();
    }
    if (align) {
      return await db.getFirstAlignImage(examId, page);
    } else {
      return await db.getFirstNonAlignImage(examId, page);
    }
  } else {
    if (align) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await sqliteService.getFirstAlignImage(examId, page);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await sqliteService.getFirstNonAlignImage(examId, page);
    }
  }
  /*else {
    if (align){
      return await db.getFirstAlignImage(examId,page);
    }else {
      return await db.getFirstNonAlignImage(examId,page);
    }
  }*/
}

function reviver(key: any, value: any): any {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
async function loadImage(ii: NonAlignImage | AlignImage): Promise<ImageData> {
  const image = JSON.parse(ii.value, reviver);
  const res = await fetch(image.pages);
  const blob = await res.blob();
  const imageBitmap = await createImageBitmap(blob);
  const editedImage = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = editedImage.getContext('2d');
  ctx!.drawImage(imageBitmap, 0, 0);
  const inputimage = ctx!.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
  return inputimage;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
function cropZone(i: ImageData, zone: IZone, factor: number): any {
  let finalW1 = (zone.width! * i.width * factor) / 100000;
  let finalH1 = (zone.height! * i.height * factor) / 100000;
  let initX1 = (zone.xInit! * i.width) / 100000 - ((zone.width! * i.width * factor) / 100000 - (zone.width! * i.width) / 100000) / 2;
  if (initX1 < 0) {
    finalW1 = finalW1 + initX1;
    initX1 = 0;
  }
  let initY1 = (zone.yInit! * i.height) / 100000 - ((zone.height! * i.height * factor) / 100000 - (zone.height! * i.height) / 100000) / 2;
  if (initY1 < 0) {
    finalH1 = finalH1 + initY1;
    initY1 = 0;
  }

  let rect = new cv.Rect(initX1, initY1, finalW1, finalH1);
  let dst = new cv.Mat();

  let src = cv.matFromImageData(i);
  dst = roi(src, rect, dst);
  src.delete();
  return dst;
}
function imageCropFromZone(p: { msg: any; payload: any; uid: string }): void {
  imageCropFromZoneAsync(p);
}
async function imageCropFromZoneAsync(p: { msg: any; payload: any; uid: string }): Promise<void> {
  const p1 = p.payload;
  let i;

  if (p1.template) {
    i = await getTemplateImage(p1.page, p1.examId, p1.indexDb);
  } else {
    i = await getScanImage(p1.align, p1.page, p1.examId, p1.indexDb);
  }
  if (i !== undefined) {
    const l = await loadImage(i);

    const z1 = cropZone(l, p1.z, p1.factor);
    const buffer = imageDataFromMat(z1).data.buffer;

    const output: any = {
      image: buffer,
      page: p1.page,
      width: z1.size().width,
      height: z1.size().height,
    };
    source.currentTarget.postMessage({ msg: p.msg, payload: output, uid: p.uid }, [output.image]);
    z1.delete();
  }
}

function isDoPredictionsInputSamePage(
  obj: DoPredictionsInputSamePage | DoPredictionsInputDifferentPage,
): obj is DoPredictionsInputSamePage {
  return 'pagesToAnalyze' in obj;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doPredictions(p: { msg: any; payload: DoPredictionsInputSamePage | DoPredictionsInputDifferentPage; uid: string }): void {
  doPredictionsAsync(p)
    .then(() => {})
    .catch(e => {
      console.error(e);
    });
}
async function doPredictionsAsync(p: {
  msg: any;
  payload: DoPredictionsInputSamePage | DoPredictionsInputDifferentPage;
  uid: string;
}): Promise<void> {
  const p1 = p.payload;

  if (isDoPredictionsInputSamePage(p1)) {
    const opts: Transferable[] = [];
    const outputs: DoPredictionsOutput[] = [];
    for (let pageToAnalyze of p1.pagesToAnalyze) {
      const i = await getScanImage(p1.align, pageToAnalyze, p1.examId, p1.indexDb);
      if (i !== undefined) {
        const l = await loadImage(i);

        let z1: any;
        let z2: any;
        let z3: any;
        let pageZone = 0;
        if (p1.nameZone) {
          z1 = cropZone(l, p1.nameZone, p1.factor);
          pageZone = p1.nameZone.pageNumber!;
        }
        if (p1.firstnameZone) {
          z2 = cropZone(l, p1.firstnameZone, p1.factor);
          pageZone = p1.firstnameZone.pageNumber!;
        }
        if (p1.ineZone) {
          z3 = cropZone(l, p1.ineZone, p1.factor);
          pageZone = p1.ineZone.pageNumber!;
        }
        const output: DoPredictionsOutput = {
          page: pageToAnalyze - pageZone,
        };
        let z1Buffer: ArrayBuffer | undefined;
        let z2Buffer: ArrayBuffer | undefined;
        let z3Buffer: ArrayBuffer | undefined;

        if (z1) {
          z1Buffer = imageDataFromMat(z1).data.buffer;
          output.nameZoneW = z1.size().width;
          output.nameZoneH = z1.size().height;
          if (z1Buffer) {
            opts.push(z1Buffer);
          }
        }
        if (z2) {
          z2Buffer = imageDataFromMat(z2).data.buffer;
          output.firstnameZoneW = z2.size().width;
          output.firstnameZoneH = z2.size().height;
          if (z2Buffer) {
            opts.push(z2Buffer);
          }
        }
        if (z3) {
          z3Buffer = imageDataFromMat(z3).data.buffer;
          output.ineZoneW = z3.size().width;
          output.ineZoneH = z3.size().height;

          if (z3Buffer) {
            opts.push(z3Buffer);
          }
        }

        output.nameZone = z1Buffer;
        output.firstnameZone = z2Buffer;
        output.ineZone = z3Buffer;

        // Load Template
        const t = await getTemplateImage(p1.pageTemplate, p1.examId, p1.indexDb);
        if (t !== undefined) {
          const ti = await loadImage(t);
          let z1t: any;
          let z2t: any;
          let z3t: any;
          if (p1.nameZone) {
            z1t = cropZone(ti, p1.nameZone, p1.factor);
          }
          if (p1.firstnameZone) {
            z2t = cropZone(ti, p1.firstnameZone, p1.factor);
          }
          if (p1.ineZone) {
            z3t = cropZone(ti, p1.ineZone, p1.factor);
          }
          if (z1 !== undefined && z1t !== undefined) {
            const res1 = await doPredidction4zone(
              true,
              z1,
              z1t,
              p1.candidateName,
              p1.preferences,
              p1.looking4missing,
              p1.removeHorizontal,
              p1.debug!,
            );
            output.name = res1.solution[0] as string;
            output.namePrecision = +res1.solution[1];
            z1t.delete();
            if (res1.debug) {
              const z1BufferDebug = imageDataFromMat(res1.debug).data.buffer;
              if (z1BufferDebug) {
                opts.push(z1BufferDebug);
                output.nameZoneDebug = z1BufferDebug;
              }
              res1.debug.delete();
            }
          }

          if (z2 !== undefined && z2t !== undefined) {
            const res2 = await doPredidction4zone(
              true,
              z2,
              z2t,
              p1.candidateFirstName,
              p1.preferences,
              p1.looking4missing,
              p1.removeHorizontal,
              p1.debug!,
            );
            output.firstname = res2.solution[0] as string;
            output.firstnamePrecision = +res2.solution[1];
            z2t.delete();
            if (res2.debug) {
              const z2BufferDebug = imageDataFromMat(res2.debug).data.buffer;
              if (z2BufferDebug) {
                opts.push(z2BufferDebug);
                output.firstnameZoneDebug = z2BufferDebug;
              }
              res2.debug.delete();
            }
          }

          if (z3 !== undefined && z3t !== undefined) {
            const res3 = await doPredidction4zone(
              false,
              z3,
              z3t,
              p1.candidateIne,
              p1.preferences,
              p1.looking4missing,
              p1.removeHorizontal,
              p1.debug!,
            );
            output.ine = res3.solution[0] as string;
            output.inePrecision = +res3.solution[1];
            z3t.delete();
            if (res3.debug) {
              const z3BufferDebug = imageDataFromMat(res3.debug).data.buffer;
              if (z3BufferDebug) {
                opts.push(z3BufferDebug);
                output.ineZoneDebug = z3BufferDebug;
              }
              res3.debug.delete();
            }
          }
        }
        outputs.push(output);
        z1?.delete();
        z2?.delete();
        z3?.delete();
      }
    }
    source.currentTarget.postMessage({ msg: p.msg, payload: outputs, uid: p.uid }, opts);
  } else {
    // TODO
    p1.firstnamePagesToAnalyze;
  }
}

function doPredidction4zone(
  letter: boolean,
  src: any,
  srcTemplate: any,
  candidates: string[],
  preference: IPreference,
  looking4missing: boolean,
  removeHorizontal: boolean,
  debug: boolean,
): Promise<any> {
  let graynomTemplate = new cv.Mat();
  cv.cvtColor(srcTemplate, graynomTemplate, cv.COLOR_RGBA2GRAY, 0);

  const casesTemplate = trouveCases(graynomTemplate, preference);

  const casesTemplateSorted = casesTemplate.cases.sort(__comparePositionX);
  const casePosition = [];
  const caseDimension = [];
  for (let k = 0; k < casesTemplateSorted.length; k++) {
    const forme = casesTemplateSorted[k];
    const dim = getOrigDimensions(forme);
    caseDimension.push(dim);
    const pos = getOrigPosition(forme);
    casePosition.push(pos);
  }
  for (let k = 0; k < casesTemplate.cases.length; k++) {
    casesTemplate.cases[k].delete();
  }
  for (let k = 0; k < casesTemplate.img_cases.length; k++) {
    casesTemplate.img_cases[k].delete();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-shadow
  const posX = casePosition.map(p => p.x);
  const distAverageX = [];

  for (let k = 0; k < casePosition.length - 1; k++) {
    distAverageX.push(posX[k + 1] - posX[k]);
  }
  const posXAverage = distAverageX.reduce((a, b) => a + b, 0) / distAverageX.length;

  const dimAverage = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    w: caseDimension.map(d => d.w).reduce((a, b) => a + b, 0) / caseDimension.length,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    h: caseDimension.map(d => d.h).reduce((a, b) => a + b, 0) / caseDimension.length,
  };

  graynomTemplate.delete();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return fprediction(src, candidates, looking4missing, removeHorizontal, letter, preference, dimAverage, posXAverage, debug);
}

function groupImagePerContoursLength(p: { msg: any; payload: ICluster; uid: string }): void {
  if (p.payload.images.length === 0) {
    postMessage({ msg: p.msg, payload: [], uid: p.uid });
  }
  const nbrImage = p.payload.images[p.payload.images.length - 1].studentIndex + 1;
  const minLongContour = 3;
  // Kmean parameters
  const numClusters = p.payload.nbrCluster; // Définir le nombre de clusters souhaité
  const attempts = 5;
  const crite = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 1000, 0.001);

  const contourLengths = [];

  // Charger l'image en utilisant OpenCV.js
  for (let i = 0; i < nbrImage; i++) {
    let contourLength = 0;
    let nbreContour = 0;
    const nbreImagePerStudent = p.payload.images.length / nbrImage;
    for (let ij = 0; ij < nbreImagePerStudent; ij++) {
      const imageSrc = new ImageData(
        new Uint8ClampedArray(p.payload.images[i * nbreImagePerStudent + ij].image),
        p.payload.images[i * nbreImagePerStudent + ij].width!,
        p.payload.images[i * nbreImagePerStudent + ij].height,
      );

      let src = cv.matFromImageData(imageSrc);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      //let dsize = new cv.Size(_gray.size().width *1, _gray.size().height *1);
      // You can try more different parameters
      //const gray = new cv.Mat();
      //cv.resize(_gray, gray, dsize, 0, 0, cv.INTER_AREA);

      // cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

      // Appliquer Canny Edge Detection
      const edges = new cv.Mat();
      const threshold1 = 100;
      const threshold2 = 200;
      const apertureSize = 3;
      cv.Canny(gray, edges, threshold1, threshold2, apertureSize);

      // Trouver les contours dans l'image
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      for (let ic = 0; ic < contours.size(); ic++) {
        const contour = contours.get(ic);
        const length = cv.arcLength(contour, true);
        if (length > minLongContour) {
          contourLength = contourLength + length;
          nbreContour = nbreContour + 1;
        }
      }

      src.delete();
      //_gray.delete();
      gray.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();
    }
    contourLengths.push(contourLength);
    contourLengths.push(nbreContour);
  }
  // Appliquer l'algorithme de k-means pour regrouper les longueurs des contours
  // const criteria = { criteria: cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, maxCount: 100, epsilon: 0.01 };
  const labels = new cv.Mat();
  const centers = new cv.Mat();

  const data = cv.matFromArray(contourLengths.length / 2, 2, cv.CV_32F, contourLengths);
  cv.kmeans(data, numClusters, labels, crite, attempts, cv.KMEANS_PP_CENTERS, centers);
  // Exemple : Afficher les résultats du regroupement k-means

  let order: number[] = [];

  for (let k = 0; k < numClusters; k++) {
    order.push(centers.data32F[k * 2 + 1]);
  }
  order.sort(function (a, b) {
    return a - b;
  });
  let mapping = new Map<number, number>();
  for (let k = 0; k < numClusters; k++) {
    mapping.set((centers.data32F.indexOf(order[k]) - 1) / 2, k);
  }

  let res: number[] = [];
  for (let k = 0; k < nbrImage; k++) {
    res.push(mapping.get(labels.data32S[k])!);
  }
  postMessage({ msg: p.msg, payload: res, uid: p.uid });

  // Libérer les ressources
  labels.delete();
  centers.delete();
  data.delete();
}

function imageCrop(p: { msg: any; payload: any; uid: string }): void {
  // You can try more different parameters
  let rect = new cv.Rect(p.payload.x, p.payload.y, p.payload.width, p.payload.height);
  let dst = new cv.Mat();
  const imageSrc = new ImageData(new Uint8ClampedArray(p.payload.image), p.payload.imageWidth, p.payload.imageHeight);

  let src = cv.matFromImageData(imageSrc);
  dst = roi(src, rect, dst);
  const res: Transferable = imageDataFromMat(dst).data.buffer;

  // put [res]
  source.currentTarget.postMessage({ msg: p.msg, payload: res, uid: p.uid }, [res]);
  dst.delete();
  src.delete();
}

let _letterModel: MLModel | undefined;
let _digitModel: MLModel | undefined;

function getModel(letter: boolean): MLModel {
  if (letter) {
    if (_letterModel === undefined) {
      _letterModel = new MLModel(letter);
    }
    return _letterModel;
  } else {
    if (_digitModel === undefined) {
      _digitModel = new MLModel(letter);
    }
    return _digitModel;
  }
}

/**
 * This function is to convert again from cv.Mat to ImageData
 */
function imageDataFromMat(mat: any): any {
  // convert the mat type to cv.CV_8U
  const img = new cv.Mat();
  const depth = mat.type() % 8;
  const scale = depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0;
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0;
  mat.convertTo(img, cv.CV_8U, scale, shift);

  // convert the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA);
      break;
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA);
      break;
    case cv.CV_8UC4:
      break;
    default:
      throw new Error('Bad number of channels (Source image must have 1, 3 or 4 channels)');
  }
  const clampedArray = new ImageData(new Uint8ClampedArray(img.data), img.cols, img.rows);
  img.delete();
  return clampedArray;
}

async function fprediction(
  src: any,
  cand: string[],
  lookingForMissingLetter: boolean,
  removeHorizontal: boolean,
  onlyletter: boolean,
  preference: IPreference,
  dimAverage: any,
  posXAverage: number,
  debug: boolean,
): Promise<any> {
  const m = getModel(onlyletter);
  await m.isWarmedUp;

  const res = extractImageNew(src, removeHorizontal, lookingForMissingLetter, preference, dimAverage, posXAverage);

  let candidate: any[] = [];
  cand.forEach(e => {
    candidate.push([e.padEnd(22, ' '), 0.0]);
  });
  console.error(res.length, res);

  const predict = [];
  for (let i = 0; i < res.letter.length; i++) {
    let res1 = m.predict(imageDataFromMat(res.letter[i][1]));
    console.error(res1);
    if (onlyletter) {
      if (res1[0] === '1') {
        res1[0] = 'i';
      }
      if (res1[0] === '0') {
        res1[0] = 'o';
      }
      if (res1[0] === '5') {
        res1[0] = 's';
      }
      if (res1[0] === '3') {
        res1[0] = 'b';
      }
      if (res1[0] === '9') {
        res1[0] = 'g';
      }
    }
    predict.push(res1);
  }
  for (let i = 0; i < res.letter.length; i++) {
    res.letter[i][1].delete();
  }
  for (let k = 0; k < candidate.length; k++) {
    for (let j = 0; j < 20; j++) {
      if (j < predict.length) {
        let letter = candidate[k][0].substring(j, j + 1).toLowerCase();
        if (letter === predict[j][0].toLowerCase()) {
          candidate[k][1] = candidate[k][1] + predict[j][1];
        } else {
          if (onlyletter) {
            candidate[k][1] = candidate[k][1] + (1 - predict[j][1]) / 35;
          } else {
            candidate[k][1] = candidate[k][1] + (1 - predict[j][1]) / 9;
          }
        }
      }
    }
    candidate[k][1] = candidate[k][1] / predict.length;
  }

  for (let k = 0; k < candidate.length; k++) {
    candidate[k][0] = candidate[k][0].trim();
    const levenshtein = levenshteinDistance(candidate[k][0], predict.map(e => e[0] as string).join(''));
    const levenshteinMax = Math.max(predict.map(e => e[0] as string).join('').length, candidate[k][0].length);
    candidate[k][1] = candidate[k][1] - (candidate[k][1] * levenshtein) / levenshteinMax; // (Math.abs(candidate[k][0].length - predict.length) / candidate[k][0].length);
  }

  candidate.sort((a, b) => {
    if (a[1] < b[1]) {
      return 1;
    } else {
      return -1;
    }
  });
  if (debug) {
    return {
      debug: res.invert_final,
      solution: candidate[0],
    };
  } else {
    res.invert_final.delete();
    return {
      solution: candidate[0],
    };
  }
}
function levenshteinDistance(a: string, b: string): number {
  // Create a 2D array to store the distances
  let distances = new Array(a.length + 1);
  for (let i = 0; i <= a.length; i++) {
    distances[i] = new Array(b.length + 1);
  }

  // Initialize the first row and column
  for (let i = 0; i <= a.length; i++) {
    distances[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    distances[0][j] = j;
  }

  // Fill in the rest of the array
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        distances[i][j] = Math.min(distances[i - 1][j], distances[i][j - 1], distances[i - 1][j - 1]) + 1;
      }
    }
  }

  // Return the final distance
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return distances[a.length][b.length];
}

function roi(src: any, rect: any, dst: any): any {
  const srcMWidth = src.size().width;
  const srcMHeight = src.size().height;
  if (rect.x < 0) {
    rect.x = 0;
  }
  if (rect.y < 0) {
    rect.y = 0;
  }
  if (rect.x + rect.width > srcMWidth) {
    rect.width = srcMWidth - rect.x;
  }
  if (rect.y + rect.height > srcMHeight) {
    rect.height = srcMHeight - rect.y;
  }
  dst = src.roi(rect); // You can try more different parameters
  return dst;
}

function extractImageNew(
  src: any,
  removeHorizonzalAndVertical: boolean,
  lookingForMissingLetter: boolean,
  preference: IPreference,
  dimAverage: any,
  posXAverage: number,
): any {
  const linelength = preference.linelength;
  const repairsize = preference.repairsize;
  const dilatesize = preference.dilatesize;
  const morphsize = preference.morphsize;
  const drawcontoursizeh = preference.drawcontoursizeh;
  const drawcontoursizev = preference.drawcontoursizev;

  //  let src = cv.imread(inputid);
  let dst = src.clone();
  let gray = new cv.Mat();
  false;
  cv.cvtColor(src, gray, cv.COLOR_BGR2GRAY, 0);
  let thresh = new cv.Mat();
  cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
  const anchor = new cv.Point(-1, -1);
  if (removeHorizonzalAndVertical) {
    // Step 1 remove vertical lines
    let remove_vertical = new cv.Mat();
    let ksize2 = new cv.Size(1, linelength);
    // You can try more different parameters
    // const anchor  = new cv.Point(-1, -1);
    let vertical_kernel = cv.getStructuringElement(cv.MORPH_RECT, ksize2, anchor);
    cv.morphologyEx(
      thresh,
      remove_vertical,
      cv.MORPH_OPEN,
      vertical_kernel,
      anchor,
      2,
      cv.BORDER_CONSTANT,
      cv.morphologyDefaultBorderValue(),
    );
    let contours2 = new cv.MatVector();
    let hierarchy2 = new cv.Mat();
    cv.findContours(remove_vertical, contours2, hierarchy2, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let fillColor = new cv.Scalar(255, 255, 255);
    cv.drawContours(dst, contours2, -1, fillColor, drawcontoursizev);

    // Step 1 remove horizontal lines

    let remove_horizontal = new cv.Mat();
    let ksize3 = new cv.Size(linelength, 1);
    // You can try more different parameters
    let horizontal_kernel = cv.getStructuringElement(cv.MORPH_RECT, ksize3, anchor);
    let anchor1 = new cv.Point(-1, -1);
    cv.morphologyEx(
      thresh,
      remove_horizontal,
      cv.MORPH_OPEN,
      horizontal_kernel,
      anchor1,
      2,
      cv.BORDER_CONSTANT,
      cv.morphologyDefaultBorderValue(),
    );
    let contours3 = new cv.MatVector();
    let hierarchy3 = new cv.Mat();
    cv.findContours(remove_horizontal, contours3, hierarchy3, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let fillColor1 = new cv.Scalar(255, 255, 255);
    cv.drawContours(dst, contours3, -1, fillColor1, drawcontoursizeh);
    remove_vertical.delete();
    contours2.delete();
    hierarchy2.delete();
    vertical_kernel.delete();
    remove_horizontal.delete();
    contours3.delete();
    hierarchy3.delete();
    horizontal_kernel.delete();
  }

  // Step 3 Repair kernel
  let ksize4 = new cv.Size(repairsize, repairsize);
  let repair_kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, ksize4, anchor);
  let mask = new cv.Mat();
  let dtype = -1;
  // 1. Create a Mat which is full of zeros
  let img = new cv.Mat.ones(src.rows, src.cols, cv.CV_8UC3);
  img.setTo(new cv.Scalar(255, 255, 255));
  cv.cvtColor(img, img, cv.COLOR_BGR2GRAY, 0);
  // 2. Create a Mat which is full of ones
  // let mat = cv.Mat.ones(rows, cols, type);
  let gray1 = new cv.Mat();
  cv.cvtColor(dst, gray1, cv.COLOR_BGR2GRAY, 0);
  // let img = cv.zeros(src.rows, src.cols, cv.CV_8UC3);
  let dst1 = new cv.Mat();
  cv.subtract(img, gray1, dst1, mask, dtype);
  //cv.subtract(img, dst, dst1);
  let dilate = new cv.Mat();
  cv.dilate(dst1, dilate, repair_kernel, anchor, dilatesize, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

  let pre_result = new cv.Mat();
  let result = new cv.Mat();

  cv.bitwise_and(dilate, thresh, pre_result);
  cv.morphologyEx(
    pre_result,
    result,
    cv.MORPH_CLOSE,
    repair_kernel,
    anchor,
    morphsize,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue(),
  );
  let final = new cv.Mat();

  cv.bitwise_and(result, thresh, final);
  let invert_final = new cv.Mat();

  cv.subtract(img, final, invert_final, mask, dtype);

  //        cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  let test = new cv.Mat();

  cv.adaptiveThreshold(invert_final, test, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 3, 2);

  cv.findContours(test, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
  const letters = new Map();
  let rects: any[] = [];

  for (let ct = 0; ct < contours.size(); ct++) {
    let cnt = contours.get(ct);
    // You can try more different parameters
    let rect = cv.boundingRect(cnt);
    if (rect.width > 12 || rect.height > 12) {
      rects.push(rect);
    }
  }

  //  cv.drawContours(invert_final, contours, -1, fillColor1, 1, cv.LINE_AA);

  // fusion entre rect qui intersect
  /*4  let merge = mergeRect(rects);
  let kk = 0;
  while (merge !== null && kk < 200) {
    rects = rects.filter(rect => rect !== merge.toRemove1 && rect !== merge.toRemove2);
    rects.push(merge.u);
    merge = mergeRect(rects);
    kk = kk + 1;
  }*/
  //  rects.filter(r=>  Math.abs(r.width - dimAverage.w)/  dimAverage.w >0.8 || Math.abs(r.height - dimAverage.h)/  dimAverage.h >0.8).forEach(e=> console.error(e))
  rects = rects.filter(
    r => Math.abs(r.width - dimAverage.w) / dimAverage.w < 0.8 && Math.abs(r.height - dimAverage.h) / dimAverage.h < 0.7,
  );

  rects.forEach(e => {
    const diffw = e.width - dimAverage.w;
    if (diffw > 0) {
      e.x = e.x + diffw / 2;
      e.width = dimAverage.w;
    }
    const diffh = e.height - dimAverage.h;
    if (diffh > 0) {
      e.y = e.y + diffh / 2;
      e.height = dimAverage.h;
    }
  });

  let merge = mergeRect(rects);
  let kk = 0;
  while (merge !== null && kk < 200) {
    rects = rects.filter(rect => rect !== merge.toRemove1 && rect !== merge.toRemove2);
    rects.push(merge.u);
    merge = mergeRect(rects);
    kk = kk + 1;
  }

  /*
  rects.forEach(e=> {
    e.x = e.x-4
    e.width = e.width+8
    e.y = e.y -4
    e.height = e.height+8
  })*/
  rects.forEach(e => {
    e.x = e.x - 2;
    e.width = e.width + 4;
    e.y = e.y - 2;
    e.height = e.height + 4;
  });
  rects.sort((a, b) => {
    if (a.x < b.x) {
      return -1;
    } else {
      return 1;
    }
  });

  const rectToRemove: number[] = [];
  if (rects.length > 2) {
    for (let kr = 0; kr < rects.length - 1; kr++) {
      if (rects[kr + 1].x - rects[kr].x < 1.5 * posXAverage) {
        // console.error('no hole')
      } else if (rects[kr + 1].x - rects[kr].x < 2.5 * posXAverage) {
        // console.error('only one hole')
      } else {
        //TODO to remvove
        //         console.error('only two hole')
        rectToRemove.push(kr + 1);
      }
    }
  }
  //  console.error(rectToRemove)
  rects = rects.filter((rect, index) => !rectToRemove.includes(index));

  const newrects: any[] = [];
  if (lookingForMissingLetter && rects.length > 3) {
    //TODO Improve based on averageDistance on template
    const maxDistance = posXAverage + dimAverage.w;
    //    const dstavg = (lettersf[lettersf.length - 1][0].x - lettersf[0][0].x) / lettersf.length;
    let maxHauteur = 0;
    let maxLargeur = 0;
    let minY = 800;
    const nbrMissing = [];
    for (let i = 0; i < rects.length - 1; i++) {
      let diffXt = rects[i + 1].x - rects[i].x;
      if (diffXt > maxDistance) {
        nbrMissing.push(i);
      }
      if (rects[i].y < minY) {
        minY = rects[i].y;
      }
      if (rects[i].height > maxHauteur) {
        maxHauteur = rects[i].height;
      }
      if (rects[i].width > maxLargeur) {
        maxLargeur = rects[i].width;
      }
    }

    nbrMissing.forEach(n => {
      let x = rects[n].x + posXAverage;

      let rect = new cv.Rect(x, minY, maxLargeur, maxHauteur);
      newrects.push(rect);
    });
  }

  rects = rects.concat(newrects);
  rects.sort((a, b) => {
    if (a.x < b.x) {
      return -1;
    } else {
      return 1;
    }
  });

  // TODO interect on rect
  rects.forEach(rect => {
    let rectangleColor = new cv.Scalar(0, 0, 0);
    let point1 = new cv.Point(rect.x, rect.y);
    let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
    let dst4 = new cv.Mat();
    let dst2 = new cv.Mat();
    let dst3 = new cv.Mat();
    let s = new cv.Scalar(255, 255, 255, 255);

    dst4 = roi(invert_final, rect, dst4); // You can try more different parameters

    const ratioOrig = dimAverage.w / dimAverage.h;
    const ratioRect = dst4.size().width / dst4.size().height;
    let dsize = new cv.Size(28, 28);

    /*    if (< 1 && ratioOrig> ratioRect)
    h=26
    w=26 / ratioOrig * ratioRect
    else
    h=26 * ratioOrig / ratioRect
    w=26*/

    if (ratioOrig < ratioRect) {
      let height = Math.floor((26.0 * ratioOrig) / ratioRect);
      dsize = new cv.Size(26, height + 1);
    } else {
      let width = Math.floor((26.0 * ratioRect) / ratioOrig);
      dsize = new cv.Size(width + 1, 26);
    }

    //  dsize = new cv.Size(24, 24);;
    const bordertopBottom = (28 - dsize.height) / 2;
    const borderleftRight = (28 - dsize.width) / 2;
    cv.resize(dst4, dst2, dsize, 0, 0, cv.INTER_AREA);

    cv.copyMakeBorder(dst2, dst3, bordertopBottom, bordertopBottom, borderleftRight, borderleftRight, cv.BORDER_CONSTANT, s);

    letters.set(rect, dst3);
    dst4.delete();
    dst2.delete();
    cv.rectangle(invert_final, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
  });

  // src.delete();
  gray.delete();
  thresh.delete();
  test.delete();
  repair_kernel.delete();
  mask.delete();
  img.delete();
  gray1.delete();
  dst1.delete();
  dilate.delete();
  dst.delete();
  pre_result.delete();
  result.delete();
  final.delete();
  //invert_final.delete();
  contours.delete();
  hierarchy.delete();
  let lettersf = [...letters];
  lettersf.sort((a, b) => {
    if (a[0].x < b[0].x) {
      return -1;
    } else {
      return 1;
    }
  });

  return {
    letter: lettersf,
    invert_final: invert_final,
  };
}

function intersect(rect1: any, rect2: any): any {
  let rightRect = rect2;
  let leftRect = rect1;
  let topRect = rect1;
  let botRect = rect2;

  if (rect1.x > rect2.x) {
    rightRect = rect1;
    leftRect = rect2;
  }
  if (rect1.y > rect2.y) {
    topRect = rect2;
    botRect = rect1;
  }
  rect1.right = rect1.x + rect1.width;
  rect2.right = rect2.x + rect2.width;
  rect1.bottom = rect1.y + rect1.height;
  rect2.bottom = rect2.y + rect2.height;

  let furtherRect = rect2;
  let nearerRect = rect1;
  let lowerRect = rect2;
  let upperRect = rect1;

  if (rect1.right > rect2.right) {
    furtherRect = rect1;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nearerRect = rect2;
  }
  if (rect1.bottom > rect2.bottom) {
    lowerRect = rect1;
    upperRect = rect2;
  }
  if (rightRect.x < leftRect.right && botRect.y > topRect.y + topRect.height) {
    return new cv.Rect(leftRect.x, upperRect.y, furtherRect.right - leftRect.x, lowerRect.bottom - topRect.y);
  }

  if (/*(!rightRect.x<leftRect.right)  ||*/ rightRect.x > leftRect.x + leftRect.width + 5 || botRect.y > topRect.y + topRect.height) {
    return null;
  } else {
    return new cv.Rect(leftRect.x, upperRect.y, furtherRect.right - leftRect.x, lowerRect.bottom - topRect.y);
  }
}

function mergeRect(rects: any[]): any {
  for (let i = 0; i < rects.length - 1; i++) {
    const rect1 = rects[i];
    for (let j = i + 1; j < rects.length; j++) {
      const rect2 = rects[j];
      const union = intersect(rect1, rect2);
      if (union !== null) {
        return { u: union, toRemove1: rect1, toRemove2: rect2 };
      }
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* function extractImage(src: any, removeHorizonzalAndVertical: boolean, lookingForMissingLetter: boolean, preference: IPreference): any {
  const linelength = preference.linelength;
  const repairsize = preference.repairsize;
  const dilatesize = preference.dilatesize;
  const morphsize = preference.morphsize;
  const drawcontoursizeh = preference.drawcontoursizeh;
  const drawcontoursizev = preference.drawcontoursizev;

  //  let src = cv.imread(inputid);
  let dst = src.clone();
  let gray = new cv.Mat();
  false;
  cv.cvtColor(src, gray, cv.COLOR_BGR2GRAY, 0);
  let thresh = new cv.Mat();
  cv.threshold(gray, thresh, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
  let anchor = new cv.Point(-1, -1);
  if (removeHorizonzalAndVertical) {
    // Step 1 remove vertical lines
    let remove_vertical = new cv.Mat();
    let ksize2 = new cv.Size(1, linelength);
    // You can try more different parameters
    let vertical_kernel = cv.getStructuringElement(cv.MORPH_RECT, ksize2);
    cv.morphologyEx(
      thresh,
      remove_vertical,
      cv.MORPH_OPEN,
      vertical_kernel,
      anchor,
      2,
      cv.BORDER_CONSTANT,
      cv.morphologyDefaultBorderValue(),
    );
    let contours2 = new cv.MatVector();
    let hierarchy2 = new cv.Mat();
    cv.findContours(remove_vertical, contours2, hierarchy2, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let fillColor = new cv.Scalar(255, 255, 255);
    cv.drawContours(dst, contours2, -1, fillColor, drawcontoursizev);

    // Step 1 remove horizontal lines

    let remove_horizontal = new cv.Mat();
    let ksize3 = new cv.Size(linelength, 1);
    // You can try more different parameters
    let horizontal_kernel = cv.getStructuringElement(cv.MORPH_RECT, ksize3);
    let anchor1 = new cv.Point(-1, -1);
    cv.morphologyEx(
      thresh,
      remove_horizontal,
      cv.MORPH_OPEN,
      horizontal_kernel,
      anchor1,
      2,
      cv.BORDER_CONSTANT,
      cv.morphologyDefaultBorderValue(),
    );
    let contours3 = new cv.MatVector();
    let hierarchy3 = new cv.Mat();
    cv.findContours(remove_horizontal, contours3, hierarchy3, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let fillColor1 = new cv.Scalar(255, 255, 255);
    cv.drawContours(dst, contours3, -1, fillColor1, drawcontoursizeh);

    remove_vertical.delete();
    contours2.delete();
    hierarchy2.delete();
    vertical_kernel.delete();
    remove_horizontal.delete();
    contours3.delete();
    hierarchy3.delete();
    horizontal_kernel.delete();
  }

  // Step 3 Repair kernel
  let ksize4 = new cv.Size(repairsize, repairsize);
  let repair_kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, ksize4);
  let mask = new cv.Mat();
  let dtype = -1;
  // 1. Create a Mat which is full of zeros
  let img = cv.Mat.ones(src.rows, src.cols, cv.CV_8UC3);
  img.setTo(new cv.Scalar(255, 255, 255));
  cv.cvtColor(img, img, cv.COLOR_BGR2GRAY, 0);
  // 2. Create a Mat which is full of ones
  // let mat = cv.Mat.ones(rows, cols, type);
  let gray1 = new cv.Mat();
  cv.cvtColor(dst, gray1, cv.COLOR_BGR2GRAY, 0);
  // let img = cv.zeros(src.rows, src.cols, cv.CV_8UC3);
  let dst1 = new cv.Mat();
  cv.subtract(img, gray1, dst1, mask, dtype);
  //cv.subtract(img, dst, dst1);
  let dilate = new cv.Mat();
  cv.dilate(dst1, dilate, repair_kernel, anchor, dilatesize, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

  let pre_result = new cv.Mat();
  let result = new cv.Mat();

  cv.bitwise_and(dilate, thresh, pre_result);
  cv.morphologyEx(
    pre_result,
    result,
    cv.MORPH_CLOSE,
    repair_kernel,
    anchor,
    morphsize,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue(),
  );
  let final = new cv.Mat();

  cv.bitwise_and(result, thresh, final);
  let invert_final = new cv.Mat();

  cv.subtract(img, final, invert_final, mask, dtype);

  //        cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(final, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  const letters = new Map();
  let rects = [];
  for (let ct = 0; ct < contours.size(); ct++) {
    let cnt = contours.get(ct);
    // You can try more different parameters
    let rect = cv.boundingRect(cnt);
    if (rect.width > 12 || rect.height > 12) {
      //} && rect.width < rect.height) {
      rects.push(rect);
    }
  }

  // fusion entre rect qui intersect
  let merge = mergeRect(rects);
  let kk = 0;
  while (merge !== null && kk < 200) {
    rects = rects.filter(rect => rect !== merge.toRemove1 && rect !== merge.toRemove2);
    rects.push(merge.u);
    merge = mergeRect(rects);
    kk = kk + 1;
  }

  // TODO interect on rect
  rects.forEach(rect => {
    let rectangleColor = new cv.Scalar(0, 0, 0);
    let point1 = new cv.Point(rect.x, rect.y);
    let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
    let dst4 = new cv.Mat();
    let dst2 = new cv.Mat();
    let dst3 = new cv.Mat();
    let s = new cv.Scalar(255, 0, 0, 255);

    dst4 = roi(invert_final, rect, dst4); // You can try more different parameters

    if (rect.width > rect.height) {
      cv.copyMakeBorder(dst4, dst4, (rect.width - rect.height) / 2, (rect.width - rect.height) / 2, 1, 1, cv.BORDER_CONSTANT, s);
    } else {
      cv.copyMakeBorder(dst4, dst4, 1, 1, (rect.height - rect.width) / 2, (rect.height - rect.width) / 2, cv.BORDER_CONSTANT, s);
    }

    let dsize = new cv.Size(26, 26);
    cv.resize(dst4, dst2, dsize, 0, 0, cv.INTER_AREA);
    cv.copyMakeBorder(dst2, dst3, 1, 1, 1, 1, cv.BORDER_CONSTANT, s);
    letters.set(rect, dst3);
    dst4.delete();
    dst2.delete();
    cv.rectangle(invert_final, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
  });

  // src.delete();
  gray.delete();
  thresh.delete();

  repair_kernel.delete();
  mask.delete();
  img.delete();
  gray1.delete();
  dst1.delete();
  dilate.delete();
  dst.delete();
  pre_result.delete();
  result.delete();

  final.delete();
  //invert_final.delete();
  contours.delete();
  hierarchy.delete();
  let lettersf = [...letters];
  lettersf.sort((a, b) => {
    if (a[0].x < b[0].x) {
      return -1;
    } else {
      return 1;
    }
  });

  if (lookingForMissingLetter && lettersf.length > 3) {
    const dstavg = (lettersf[lettersf.length - 1][0].x - lettersf[0][0].x) / lettersf.length;
    let minDiffX = dstavg;
    let maxHauteur = 0;
    let maxLargeur = 0;
    let minY = 800;
    const nbrMissing = [];
    for (let i = 0; i < lettersf.length - 1; i++) {
      let diffXt = lettersf[i + 1][0].x - lettersf[i][0].x;
      if (diffXt < minDiffX) {
        minDiffX = diffXt;
      }
      if (diffXt > dstavg * 1.7) {
        nbrMissing.push(i);
      }
      if (lettersf[i][0].y < minY) {
        minY = lettersf[i][0].y;
      }
      if (lettersf[i][0].height > maxHauteur) {
        maxHauteur = lettersf[i][0].height;
      }
      if (lettersf[i][0].width > maxLargeur) {
        maxLargeur = lettersf[i][0].width;
      }
    }

    const dstavg1 = (lettersf[lettersf.length - 1][0].x - lettersf[0][0].x) / (lettersf.length + nbrMissing.length);
    nbrMissing.forEach(n => {
      let x = lettersf[n][0].x + dstavg1;

      let rectangleColor = new cv.Scalar(0, 0, 0);
      let point1 = new cv.Point(x, minY);
      let point2 = new cv.Point(x + maxLargeur, minY + maxHauteur);

      let rect = new cv.Rect(x, minY, maxLargeur, maxHauteur);
      let dst4 = new cv.Mat();
      let dst2 = new cv.Mat();
      let dst3 = new cv.Mat();

      dst4 = roi(invert_final, rect, dst4);

      let dsize = new cv.Size(26, 26);
      cv.resize(dst4, dst2, dsize, 0, 0, cv.INTER_AREA);
      let s = new cv.Scalar(255, 0, 0, 255);
      cv.copyMakeBorder(dst2, dst3, 1, 1, 1, 1, cv.BORDER_CONSTANT, s);
      letters.set(rect, dst3);
      dst4.delete();
      dst2.delete();
      cv.rectangle(invert_final, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
    });
    lettersf = [...letters];
    lettersf.sort((a, b) => {
      if (a[0].x < b[0].x) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  return {
    letter: lettersf,

    invert_final: invert_final,
  };
}*/
