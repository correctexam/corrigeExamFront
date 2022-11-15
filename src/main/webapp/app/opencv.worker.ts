/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { MLModel } from './scanexam/ml/model';
import {
  decoupe,
  diffGrayAvecCaseBlanche,
  doQCMResolution,
  getDimensions,
  getPosition,
  IPreference,
  trouveCases,
  __comparePositionX,
} from './qcm';

/// <reference lib="webworker" />
declare let cv: any;
declare let tf: any;

/**
 * This exists to capture all the events that are thrown out of the worker
 * into the worker. Without this, there would be no communication possible
 * with our project.
 */

addEventListener('message', e => {
  switch (e.data.msg) {
    case 'hello': {
      const response = `worker response to ${e.data.msg}`;
      postMessage({ msg: response, uid: e.data.uid });
      break;
    }
    case 'load': {
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
    case 'nameprediction':
      return doPrediction(e.data, true);
    case 'ineprediction':
      return doPrediction(e.data, false);
    case 'namepredictionTemplate':
      return doPredictionTemplate(e.data, true);
    case 'inepredictionTemplate':
      return doPredictionTemplate(e.data, false);

    case 'qcmresolution':
      return doQCMResolution(e.data);
    default:
      break;
  }
});

function imageCrop(p: { msg: any; payload: any; uid: string }): void {
  // You can try more different parameters
  let rect = new cv.Rect(p.payload.x, p.payload.y, p.payload.width, p.payload.height);
  let dst = new cv.Mat();
  let src = cv.matFromImageData(p.payload.image);

  dst = roi(src, rect, dst);
  postMessage({ msg: p.msg, payload: imageDataFromMat(dst), uid: p.uid });
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

function doPrediction(p: { msg: any; payload: any; uid: string }, letter: boolean): void {
  // You can try more different parameters
  let src = cv.matFromImageData(p.payload.image);
  const m = getModel(letter);
  m.isWarmedUp.then(() => {
    const res1 = fprediction(src, p.payload.match, m, true, letter, p.payload.preference);
    //    const res2 = fprediction(src, p.payload.match, m, false, letter);
    //    if (res1.solution[1] > res2.solution[1]) {
    postMessage({
      msg: p.msg,
      payload: {
        debug: imageDataFromMat(res1.debug),
        solution: res1.solution,
      },
      uid: p.uid,
    });
    res1.debug.delete();
    //      res2.debug.delete();
    src.delete();
    /* } else {
      postMessage({
        msg: p.msg,
        payload: {
          debug: imageDataFromMat(res2.debug),
          solution: res2.solution,
        },
        uid: p.uid,
      });
      res1.debug.delete();
      res2.debug.delete();
      src.delete();
    }*/
  });
}

function doPredictionTemplate(p: { msg: any; payload: any; uid: string }, letter: boolean): void {
  // You can try more different parameters
  let src = cv.matFromImageData(p.payload.image);
  let template = cv.matFromImageData(p.payload.template);
  const m = getModel(letter);
  m.isWarmedUp.then(() => {
    const res1 = fpredictionTemplate(template, src, p.payload.match, m, true, letter, p.payload.preference);
    postMessage({
      msg: p.msg,
      payload: {
        solution: res1.solution,
      },
      uid: p.uid,
    });
    res1.debug.delete();
    src.delete();
    template.delete();
  });
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

function fpredictionTemplate(
  nomTemplate: any,
  nomCopie: any,
  cand: string[],
  m: MLModel,
  lookingForMissingLetter: boolean,
  onlyletter: boolean,
  preference: IPreference
): any {
  let candidate: any[] = [];
  cand.forEach(e => {
    candidate.push([e.padEnd(22, ' '), 0.0]);
  });

  let graynomTemplate = new cv.Mat();
  cv.cvtColor(nomTemplate, graynomTemplate, cv.COLOR_RGBA2GRAY, 0);
  let graynomCopie = new cv.Mat();
  cv.cvtColor(nomCopie, graynomCopie, cv.COLOR_RGBA2GRAY, 0);
  const casesTemplate = trouveCases(graynomTemplate, preference);
  const letters = new Map();
  console.error('casesTemplate.cases.length ', casesTemplate.cases.length);
  for (let k = 0; k < casesTemplate.cases.length; k++) {
    const forme = casesTemplate.cases.sort(__comparePositionX)[k];
    const dim = getDimensions(forme);
    const pos = getPosition(forme);

    let dst2 = new cv.Mat();
    let dst3 = new cv.Mat();
    let dsize = new cv.Size(26, 26);
    const m1 = decoupe(graynomCopie, pos, dim);
    cv.resize(m1, dst2, dsize, 0, 0, cv.INTER_AREA);
    // let dsizeb = new cv.Size(28, 28);
    // cv.resize(img, dst3, dsizeb, 0, 0, cv.INTER_AREA);
    let s = new cv.Scalar(255, 0, 0, 255);
    cv.copyMakeBorder(dst2, dst3, 1, 1, 1, 1, cv.BORDER_CONSTANT, s);
    letters.set(pos, dst3);
    dst2.delete();
    m1.delete();
  }
  const prepredict: any[] = [];
  for (let i = 0; i < [...letters].length; i++) {
    const s = diffGrayAvecCaseBlanche([...letters][i][1]);
    if (s > 0.15) {
      let res1 = m.predict(imageDataFromMat([...letters][i][1]));
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
      prepredict.push(res1);
    } else {
      prepredict.push(['', 1]);
    }
  }
  console.error('predict', prepredict);

  let lastcharacter = 0;
  prepredict.forEach((v, index) => {
    if (v[0] !== '') {
      lastcharacter = index;
    }
  });
  let predict = prepredict.slice(0, lastcharacter + 1);

  for (let k = 0; k < candidate.length; k++) {
    for (let j = 0; j < 13; j++) {
      if (j < predict.length) {
        let letter = candidate[k][0].substring(j, j + 1).toLowerCase();
        if (letter === predict[j][0].toLowerCase()) {
          candidate[k][1] = candidate[k][1] + predict[j][1];
        } else {
          if (onlyletter) {
            candidate[k][1] = candidate[k][1] + (1 - predict[j][1]) / 35;
            // console.log(predict[j][1])
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
    candidate[k][1] = candidate[k][1] - Math.abs(candidate[k][0].length - predict.length) / candidate[k][0].length;
  }

  candidate.sort((a, b) => {
    if (a[1] < b[1]) {
      return 1;
    } else {
      return -1;
    }
  });
  graynomTemplate.delete();
  graynomCopie.delete();
  for (let i = 0; i < [...letters].length; i++) {
    [...letters][i][1].delete();
  }
  for (let i = 0; i < casesTemplate.cases.length; i++) {
    casesTemplate.cases[i].delete();
  }
  for (let i = 0; i < casesTemplate.img_cases.length; i++) {
    casesTemplate.img_cases[i].delete();
  }

  return {
    solution: candidate[0],
  };
}

function fprediction(
  src: any,
  cand: string[],
  m: MLModel,
  lookingForMissingLetter: boolean,
  onlyletter: boolean,
  preference: IPreference
): any {
  const res = extractImage(src, false, lookingForMissingLetter, preference);
  let candidate: any[] = [];
  cand.forEach(e => {
    candidate.push([e.padEnd(22, ' '), 0.0]);
  });
  const predict = [];
  for (let i = 0; i < res.letter.length; i++) {
    let res1 = m.predict(imageDataFromMat(res.letter[i][1]));
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
  // console.log(predict)
  for (let k = 0; k < candidate.length; k++) {
    for (let j = 0; j < 13; j++) {
      if (j < predict.length) {
        let letter = candidate[k][0].substring(j, j + 1).toLowerCase();
        if (letter === predict[j][0].toLowerCase()) {
          candidate[k][1] = candidate[k][1] + predict[j][1];
        } else {
          if (onlyletter) {
            candidate[k][1] = candidate[k][1] + (1 - predict[j][1]) / 35;
            // console.log(predict[j][1])
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
    candidate[k][1] = candidate[k][1] - Math.abs(candidate[k][0].length - predict.length) / candidate[k][0].length;
  }

  candidate.sort((a, b) => {
    if (a[1] < b[1]) {
      return 1;
    } else {
      return -1;
    }
  });
  //  console.log(candidate)

  return {
    debug: res.invert_final,
    solution: candidate[0],
  };
}

function roi(src: any, rect: any, dst: any): any {
  const srcMWidth = src.size().width;
  const srcMHeight = src.size().height;
  if (rect.x + rect.width > srcMWidth) {
    rect.width = srcMWidth - rect.x;
  }
  if (rect.y + rect.height > srcMHeight) {
    rect.height = srcMHeight - rect.y;
  }
  if (rect.x < 0) {
    rect.x = 0;
  }
  if (rect.y < 0) {
    rect.y = 0;
  }
  dst = src.roi(rect); // You can try more different parameters
  return dst;
}

function extractImage(src: any, removeHorizonzalAndVertical: boolean, lookingForMissingLetter: boolean, preference: IPreference): any {
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
      cv.morphologyDefaultBorderValue()
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
      cv.morphologyDefaultBorderValue()
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
    cv.morphologyDefaultBorderValue()
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
      /*  if (rect.width > rect.height) {
        rect.y = rect.y - (rect.width - rect.height) / 2;
        rect.height = rect.width;
      } else {
        rect.x = rect.x - (rect.height - rect.width) / 2;
        rect.width = rect.height;
      }*/
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
    /*    dst: dst,
    dilate: dilate,
    pre_result: pre_result,
    result: result,
    final: final,*/
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
