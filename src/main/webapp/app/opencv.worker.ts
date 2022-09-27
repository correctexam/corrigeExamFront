/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { MLModel } from './scanexam/ml/model';
import { doQCMResolution } from './qcm';

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
    case 'imageProcessing':
      return imageProcessing(e.data);
    case 'imageAlignement':
      return imageAlignement(e.data);
    case 'imageCrop':
      return imageCrop(e.data);
    case 'nameprediction':
      return doPrediction(e.data, true);
    case 'ineprediction':
      return doPrediction(e.data, false);
    case 'qcmresolution':
      return doQCMResolution(e.data);
    default:
      break;
  }
});

/**
 * With OpenCV we have to work the images as cv.Mat (matrices),
 * so the first thing we have to do is to transform the
 * ImageData to a type that openCV can recognize.
 */
function imageProcessing(p: { msg: any; payload: any; uid: string }): void {
  const img = cv.matFromImageData(p.payload);
  let result = new cv.Mat();

  // What this does is convert the image to a grey scale.
  cv.cvtColor(img, result, cv.COLOR_BGR2GRAY);
  postMessage({ msg: p.msg, payload: imageDataFromMat(result), uid: p.uid });
  img.delete();
  result.delete();
}

/**
 * With OpenCV we have to work the images as cv.Mat (matrices),
 * so the first thing we have to do is to transform the
 * ImageData to a type that openCV can recognize.
 */
function imageAlignement(p: { msg: any; payload: any; uid: string }): void {
  // What this does is convert the image to a grey scale.
  if (p.payload.marker) {
    const resultat = alignImageBasedOnCircle(p.payload);
    postMessage({ msg: p.msg, payload: resultat, uid: p.uid });
  } else {
    const resultat = alignImage(p.payload.imageA, p.payload.imageB);
    postMessage({ msg: p.msg, payload: resultat, uid: p.uid });
  }
}

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
    const res1 = fprediction(src, p.payload.match, m, true, letter);
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
function alignImageBasedOnCircle(payload: any): any {
  let srcMat = cv.matFromImageData(payload.imageA);
  let dst = new cv.Mat(); ///cv.Mat.zeros(srcMat.rows, srcMat.cols, cv.CV_8U);
  // let color = new cv.Scalar(255, 0, 0);
  // let displayMat = srcMat.clone();
  let circlesMat = new cv.Mat();
  cv.cvtColor(srcMat, srcMat, cv.COLOR_RGBA2GRAY);
  //  cv.HoughCircles(srcMat, circlesMat, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 0);
  let minCircle = (srcMat.cols * 6) / 1000;
  let maxCircle = (srcMat.cols * 20) / 1000;

  cv.HoughCircles(srcMat, circlesMat, cv.HOUGH_GRADIENT, 1, 45, 75, 20, minCircle, maxCircle);
  let x1, y1, r1;
  let x2, y2, r2;
  let x3, y3, r3;
  let x4, y4, r4;
  if (circlesMat.cols > 0) {
    x1 = circlesMat.data32F[0];
    y1 = circlesMat.data32F[1];
    r1 = circlesMat.data32F[2];
    x2 = circlesMat.data32F[0];
    y2 = circlesMat.data32F[1];
    r2 = circlesMat.data32F[2];
    x3 = circlesMat.data32F[0];
    y3 = circlesMat.data32F[1];
    r3 = circlesMat.data32F[2];
    x4 = circlesMat.data32F[0];
    y4 = circlesMat.data32F[1];
    r4 = circlesMat.data32F[2];
  }

  const srcMWidth = srcMat.size().width;
  const srcMHeight = srcMat.size().height;
  if (circlesMat.cols > 0) {
    for (let i = 1; i < circlesMat.cols; i++) {
      let x = circlesMat.data32F[i * 3];
      let y = circlesMat.data32F[i * 3 + 1];
      let radius = circlesMat.data32F[i * 3 + 2];
      if (x * x + y * y <= x1 * x1 + y1 * y1) {
        x1 = x;
        y1 = y;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        r1 = radius;
      }
      if (x * x + y * y >= x4 * x4 + y4 * y4) {
        x4 = x;
        y4 = y;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        r4 = radius;
      }
      if ((srcMWidth - x) * (srcMWidth - x) + y * y <= (srcMWidth - x2) * (srcMWidth - x2) + y2 * y2) {
        x2 = x;
        y2 = y;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        r2 = radius;
      }
      if (x * x + (srcMHeight - y) * (srcMHeight - y) <= x3 * x3 + (srcMHeight - y3) * (srcMHeight - y3)) {
        x3 = x;
        y3 = y;
        r3 = radius;
      }
    }
  }

  let srcMat2 = cv.matFromImageData(payload.imageB);
  let srcMat1 = new cv.Mat();
  let circlesMat1 = new cv.Mat();
  cv.cvtColor(srcMat2, srcMat1, cv.COLOR_RGBA2GRAY);
  const srcMWidth1 = srcMat1.size().width;
  const srcMHeight1 = srcMat1.size().height;
  //  cv.HoughCircles(srcMat, circlesMat, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 0);
  cv.HoughCircles(srcMat1, circlesMat1, cv.HOUGH_GRADIENT, 1, 45, 75, 15, r3 - 3, r3 + 3);
  let goodpointsx = [];
  let goodpointsy = [];
  const seuil = ((4 * r3 * r3 - 3.14159 * r3 * r3) * 180) / 100;
  for (let i = 0; i < circlesMat1.cols; i++) {
    let x = circlesMat1.data32F[i * 3];
    let y = circlesMat1.data32F[i * 3 + 1];

    const xx1 = x - r3;
    const yy1 = y - r3;
    let width1 = 2 * r3;
    let height1 = 2 * r3;
    if (xx1 + width1 > srcMWidth1) {
      width1 = srcMWidth1 - xx1;
    }
    if (yy1 + height1 > srcMHeight1) {
      height1 = srcMHeight1 - yy1;
    }

    let rect1 = new cv.Rect(x - r3, y - r3, width1, height1);
    let dstrect1 = new cv.Mat();
    dstrect1 = roi(srcMat1, rect1, dstrect1);
    cv.threshold(dstrect1, dstrect1, 0, 255, cv.THRESH_OTSU + cv.THRESH_BINARY);
    if (cv.countNonZero(dstrect1) < seuil) {
      goodpointsx.push(x);
      goodpointsy.push(y);
    }
    dstrect1.delete();
  }

  let x5, y5;
  let x6, y6;
  let x7, y7;
  let x8, y8;
  if (goodpointsx.length > 0) {
    x5 = goodpointsx[0];
    y5 = goodpointsy[1];
    x6 = goodpointsx[0];
    y6 = goodpointsy[1];
    x7 = goodpointsx[0];
    y7 = goodpointsy[1];
    x8 = goodpointsx[0];
    y8 = goodpointsy[1];
  }

  if (goodpointsx.length > 1) {
    for (let i = 0; i < goodpointsx.length; i++) {
      let x = goodpointsx[i];
      let y = goodpointsy[i];
      if (x * x + y * y <= x5 * x5 + y5 * y5) {
        x5 = x;
        y5 = y;
      }
      if (x * x + y * y >= x8 * x8 + y8 * y8) {
        x8 = x;
        y8 = y;
      }
      if ((srcMWidth1 - x) * (srcMWidth1 - x) + y * y <= (srcMWidth1 - x6) * (srcMWidth1 - x6) + y6 * y6) {
        x6 = x;
        y6 = y;
      }
      if (x * x + (srcMHeight1 - y) * (srcMHeight1 - y) <= x7 * x7 + (srcMHeight1 - y7) * (srcMHeight1 - y7)) {
        x7 = x;
        y7 = y;
      }
    }
  }

  if (goodpointsx.length >= 4) {
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [x1, y1, x2, y2, x3, y3, x4, y4]);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [x5, y5, x6, y6, x7, y7, x8, y8]);
    //  let srcTri = cv.matFromArray(3, 1, cv.CV_32FC2, [x4, y4, x2, y2, x3, y3]);
    //  let dstTri = cv.matFromArray(3, 1, cv.CV_32FC2, [x8, y8, x6, y6, x7, y7]);
    /*  let M = cv.getPerspectiveTransform(dstTri,srcTri);
//  let M = cv.getAffineTransform(srcTri, dstTri);
//  console.log(M)
  let dsize = new cv.Size(srcMat1.rows, srcMat1.cols);

  cv.warpPerspective(srcMat1, dst, M, dsize, cv.BORDER_CONSTANT , cv.BORDER_REPLICATE, new cv.Scalar());*/

    //59    Find homography
    //60    h = findHomography( points1, points2, RANSAC );
    let h = cv.findHomography(dstTri, srcTri, cv.RANSAC);
    let dsize = new cv.Size(srcMat.cols, srcMat.rows);

    if (h.empty()) {
      console.log('homography matrix empty!');
      return;
    }

    //62  Use homography to warp image
    //63  warpPerspective(im1, im1Reg, h, im2.size());

    cv.warpPerspective(srcMat2, dst, h, dsize);

    let dst1 = dst.clone();

    for (let i = 0; i < dstTri.rows; ++i) {
      let x = dstTri.data32F[i * 2];
      let y = dstTri.data32F[i * 2 + 1];
      let radius = 15;
      let center = new cv.Point(x, y);
      cv.circle(srcMat2, center, radius, [0, 0, 255, 255], 1);
    }
    for (let i = 0; i < srcTri.rows; ++i) {
      let x = srcTri.data32F[i * 2];
      let y = srcTri.data32F[i * 2 + 1];
      let radius = 15;
      let center = new cv.Point(x, y);
      cv.circle(srcMat, center, radius, [0, 0, 255, 255], 1);
      cv.circle(dst1, center, radius, [0, 0, 255, 255], 1);
    }
    /*
let point1 = new cv.Point(payload.x, payload.y);
let point2 = new cv.Point(payload.x + payload.width, payload.y + payload.height);
cv.rectangle(dst1, point1, point2,  [0, 0, 255, 255], 2, cv.LINE_AA, 0);
cv.rectangle(srcMat, point1, point2,  [0, 0, 255, 255], 2, cv.LINE_AA, 0);*/

    let result = {} as any;
    /*result['keypoints1'] = imageDataFromMat(srcMat);
    result['keypoints1Width'] = srcMat.size().width;
    result['keypoints1Height'] = srcMat.size().height;
    result['keypoints2'] = imageDataFromMat(dst);
    result['keypoints2Width'] = dst.size().width;
    result['keypoints2Height'] = dst.size().height;
    result['imageCompareMatches'] = imageDataFromMat(srcMat2);
    result['imageCompareMatchesWidth'] = srcMat2.size().width;
    result['imageCompareMatchesHeight'] = srcMat2.size().height;*/
    result['imageAligned'] = imageDataFromMat(dst1);
    result['imageAlignedWidth'] = dst1.size().width;
    result['imageAlignedHeight'] = dst1.size().height;

    srcMat.delete();
    dst.delete();
    circlesMat.delete();
    srcMat1.delete();
    srcMat2.delete();
    circlesMat1.delete();
    srcTri.delete();
    dstTri.delete();
    dst1.delete();

    return result;
  } else {
    //22    Variables to store keypoints and descriptors
    //23    std::vector<KeyPoint> keypoints1, keypoints2;
    //24    Mat descriptors1, descriptors2;
    let keypoints1 = new cv.KeyPointVector();
    let keypoints2 = new cv.KeyPointVector();
    let descriptors1 = new cv.Mat();
    let descriptors2 = new cv.Mat();

    let orb = new cv.AKAZE();
    let tmp1 = new cv.Mat();
    let tmp2 = new cv.Mat();
    orb.detectAndCompute(srcMat1, tmp1, keypoints1, descriptors1);
    orb.detectAndCompute(srcMat, tmp2, keypoints2, descriptors2);

    let good_matches = new cv.DMatchVector();
    let bf = new cv.BFMatcher();
    let matches = new cv.DMatchVectorVector();
    bf.knnMatch(descriptors1, descriptors2, matches, 2);

    for (let i = 0; i < matches.size(); ++i) {
      let match = matches.get(i);
      let dMatch1 = match.get(0);
      let dMatch2 = match.get(1);
      let knnDistance_option = '0.7';
      if (dMatch1.distance <= dMatch2.distance * parseFloat(knnDistance_option)) {
        good_matches.push_back(dMatch1);
      }
    }
    let imMatches = new cv.Mat();
    let color = new cv.Scalar(0, 255, 0, 255);

    cv.drawMatches(srcMat2, keypoints1, srcMat, keypoints2, good_matches, imMatches, color);
    let result = {} as any;
    /*result['imageCompareMatches'] = imageDataFromMat(imMatches);
    result['imageCompareMatchesWidth'] = imMatches.size().width;
    result['imageCompareMatchesHeight'] = imMatches.size().height;*/
    let keypoints1_img = new cv.Mat();
    let keypoints2_img = new cv.Mat();
    let keypointcolor = new cv.Scalar(0, 255, 0, 255);
    cv.drawKeypoints(srcMat1, keypoints1, keypoints1_img, keypointcolor);
    cv.drawKeypoints(srcMat, keypoints2, keypoints2_img, keypointcolor);

    /*result['keypoints1'] = imageDataFromMat(keypoints1_img);
    result['keypoints1Width'] = keypoints1_img.size().width;
    result['keypoints1Height'] = keypoints1_img.size().height;
    result['keypoints2'] = imageDataFromMat(keypoints2_img);
    result['keypoints2Width'] = keypoints2_img.size().width;
    result['keypoints2Height'] = keypoints2_img.size().height;*/

    let points1 = [];
    let points2 = [];
    for (let i = 0; i < good_matches.size(); i++) {
      points1.push(keypoints1.get(good_matches.get(i).queryIdx).pt.x);
      points1.push(keypoints1.get(good_matches.get(i).queryIdx).pt.y);
      points2.push(keypoints2.get(good_matches.get(i).trainIdx).pt.x);
      points2.push(keypoints2.get(good_matches.get(i).trainIdx).pt.y);
    }

    let mat1 = new cv.Mat(points1.length, 1, cv.CV_32FC2);
    mat1.data32F.set(points1);
    let mat2 = new cv.Mat(points2.length, 1, cv.CV_32FC2);
    mat2.data32F.set(points2);

    let h = cv.findHomography(mat1, mat2, cv.RANSAC);

    if (h.empty()) {
      console.log('homography matrix empty!');
      return;
    } else {
      //      console.log('h:', h);
    }

    let image_B_final_result = new cv.Mat();
    cv.warpPerspective(srcMat1, image_B_final_result, h, srcMat.size());

    result['imageAligned'] = imageDataFromMat(image_B_final_result);
    result['imageAlignedWidth'] = image_B_final_result.size().width;
    result['imageAlignedHeight'] = image_B_final_result.size().height;

    image_B_final_result.delete();
    mat1.delete();
    mat2.delete();
    keypoints1_img.delete();
    keypoints2_img.delete();
    imMatches.delete();
    matches.delete();
    bf.delete();
    good_matches.delete();
    orb.delete();
    keypoints1.delete();
    keypoints2.delete();
    descriptors1.delete();
    descriptors2.delete();
    tmp1.delete();
    tmp2.delete();
    srcMat.delete();
    dst.delete();
    circlesMat.delete();
    srcMat1.delete();
    srcMat2.delete();
    circlesMat1.delete();
    return result;
  }
}

function alignImage(image_A: any, image_B: any): any {
  //im2 is the original reference image we are trying to align to
  let im2 = cv.matFromImageData(image_A);
  let im1 = cv.matFromImageData(image_B);
  let im1Gray = new cv.Mat();
  let im2Gray = new cv.Mat();
  cv.cvtColor(im1, im1Gray, cv.COLOR_BGRA2GRAY);
  cv.cvtColor(im2, im2Gray, cv.COLOR_BGRA2GRAY);

  //22    Variables to store keypoints and descriptors
  //23    std::vector<KeyPoint> keypoints1, keypoints2;
  //24    Mat descriptors1, descriptors2;
  let keypoints1 = new cv.KeyPointVector();
  let keypoints2 = new cv.KeyPointVector();
  let descriptors1 = new cv.Mat();
  let descriptors2 = new cv.Mat();

  //26    Detect ORB features and compute descriptors.
  //27    Ptr<Feature2D> orb = ORB::create(MAX_FEATURES);
  //28    orb->detectAndCompute(im1Gray, Mat(), keypoints1, descriptors1);
  //29    orb->detectAndCompute(im2Gray, Mat(), keypoints2, descriptors2);

  let orb = new cv.AKAZE();
  let tmp1 = new cv.Mat();
  let tmp2 = new cv.Mat();
  orb.detectAndCompute(im1Gray, tmp1, keypoints1, descriptors1);
  orb.detectAndCompute(im2Gray, tmp2, keypoints2, descriptors2);

  /*console.log('Total of ', keypoints1.size(), ' keypoints1 (img to align) and ', keypoints2.size(), ' keypoints2 (reference)');
  console.log('here are the first 5 keypoints for keypoints1:');
  for (let i = 0; i < keypoints1.size(); i++) {
    console.log('keypoints1: [', i, ']', keypoints1.get(i).pt.x, keypoints1.get(i).pt.y);
    if (i === 5) {
      break;
    }
  }*/

  //31    Match features.
  //32    std::vector<DMatch> matches;
  //33    Ptr<DescriptorMatcher> matcher = DescriptorMatcher::create("BruteForce-Hamming");
  //34    matcher->match(descriptors1, descriptors2, matches, Mat());

  let good_matches = new cv.DMatchVector();

  //36    Sort matches by score
  //37    std::sort(matches.begin(), matches.end());

  //39    Remove not so good matches
  //40    const int numGoodMatches = matches.size() * GOOD_MATCH_PERCENT;
  //41    matches.erase(matches.begin()+numGoodMatches, matches.end());

  let bf = new cv.BFMatcher();
  let matches = new cv.DMatchVectorVector();
  bf.knnMatch(descriptors1, descriptors2, matches, 2);

  //  let counter = 0;
  for (let i = 0; i < matches.size(); ++i) {
    let match = matches.get(i);
    let dMatch1 = match.get(0);
    let dMatch2 = match.get(1);
    // console.log("[", i, "] ", "dMatch1: ", dMatch1, "dMatch2: ", dMatch2);
    let knnDistance_option = '0.7';
    if (dMatch1.distance <= dMatch2.distance * parseFloat(knnDistance_option)) {
      //console.log("***Good Match***", "dMatch1.distance: ", dMatch1.distance, "was less than or = to: ", "dMatch2.distance * parseFloat(knnDistance_option)", dMatch2.distance * parseFloat(knnDistance_option), "dMatch2.distance: ", dMatch2.distance, "knnDistance", knnDistance_option);
      good_matches.push_back(dMatch1);
      //     counter++;
    }
  }

  /*  console.log('keeping ', counter, ' points in good_matches vector out of ', matches.size(), ' contained in this match vector:', matches);
  console.log('here are first 5 matches');
  for (let t = 0; t < matches.size(); ++t) {
    console.log('[' + t + ']', 'matches: ', matches.get(t));
    if (t === 5) {
      break;
    }
  }

  console.log('here are first 5 good_matches');
  for (let r = 0; r < good_matches.size(); ++r) {
    console.log('[' + r + ']', 'good_matches: ', good_matches.get(r));
    if (r === 5) {
      break;
    }
  }
*/
  //44    Draw top matches
  //45    Mat imMatches;
  //46    drawMatches(im1, keypoints1, im2, keypoints2, matches, imMatches);
  //47    imwrite("matches.jpg", imMatches);
  let imMatches = new cv.Mat();
  let color = new cv.Scalar(0, 255, 0, 255);
  cv.drawMatches(im1, keypoints1, im2, keypoints2, good_matches, imMatches, color);
  // TODO pass the canvas

  let result = {} as any;

  result['imageCompareMatches'] = imageDataFromMat(imMatches);
  result['imageCompareMatchesWidth'] = imMatches.size().width;
  result['imageCompareMatchesHeight'] = imMatches.size().height;

  let keypoints1_img = new cv.Mat();
  let keypoints2_img = new cv.Mat();
  let keypointcolor = new cv.Scalar(0, 255, 0, 255);
  cv.drawKeypoints(im1Gray, keypoints1, keypoints1_img, keypointcolor);
  cv.drawKeypoints(im2Gray, keypoints2, keypoints2_img, keypointcolor);

  result['keypoints1'] = imageDataFromMat(keypoints1_img);
  result['keypoints1Width'] = keypoints1_img.size().width;
  result['keypoints1Height'] = keypoints1_img.size().height;
  result['keypoints2'] = imageDataFromMat(keypoints2_img);
  result['keypoints2Width'] = keypoints2_img.size().width;
  result['keypoints2Height'] = keypoints2_img.size().height;

  //50    Extract location of good matches
  //51    std::vector<Point2f> points1, points2;
  //53    for( size_t i = 0; i < matches.size(); i++ )
  //54    {
  //55        points1.push_back( keypoints1[ matches[i].queryIdx ].pt );
  //56        points2.push_back( keypoints2[ matches[i].trainIdx ].pt );
  //57    }
  let points1 = [];
  let points2 = [];
  for (let i = 0; i < good_matches.size(); i++) {
    points1.push(keypoints1.get(good_matches.get(i).queryIdx).pt.x);
    points1.push(keypoints1.get(good_matches.get(i).queryIdx).pt.y);
    points2.push(keypoints2.get(good_matches.get(i).trainIdx).pt.x);
    points2.push(keypoints2.get(good_matches.get(i).trainIdx).pt.y);
  }

  //  console.log('points1:', points1, 'points2:', points2);

  let mat1 = new cv.Mat(points1.length, 1, cv.CV_32FC2);
  mat1.data32F.set(points1);
  let mat2 = new cv.Mat(points2.length, 1, cv.CV_32FC2);
  mat2.data32F.set(points2);

  //59    Find homography
  //60    h = findHomography( points1, points2, RANSAC );
  let h = cv.findHomography(mat1, mat2, cv.RANSAC);

  if (h.empty()) {
    console.log('homography matrix empty!');
    return;
  } else {
    console.log('h:', h);
    //    console.log('[', h.data64F[0], ',', h.data64F[1], ',', h.data64F[2]);
    //    console.log('', h.data64F[3], ',', h.data64F[4], ',', h.data64F[5]);
    //    console.log('', h.data64F[6], ',', h.data64F[7], ',', h.data64F[8], ']');
  }

  //62  Use homography to warp image
  //63  warpPerspective(im1, im1Reg, h, im2.size());

  let image_B_final_result = new cv.Mat();
  cv.warpPerspective(im1, image_B_final_result, h, im2.size());

  result['imageAligned'] = imageDataFromMat(image_B_final_result);
  result['imageAlignedWidth'] = image_B_final_result.size().width;
  result['imageAlignedHeight'] = image_B_final_result.size().height;

  image_B_final_result.delete();
  mat1.delete();
  mat2.delete();
  keypoints1_img.delete();
  keypoints2_img.delete();
  imMatches.delete();
  matches.delete();
  bf.delete();
  good_matches.delete();
  orb.delete();
  im1Gray.delete();
  keypoints1.delete();
  im2Gray.delete();
  keypoints2.delete();
  descriptors1.delete();
  descriptors2.delete();
  tmp1.delete();
  tmp2.delete();
  //h.delete();
  return result;
}

function fprediction(src: any, cand: string[], m: MLModel, lookingForMissingLetter: boolean, onlyletter: boolean): any {
  const res = extractImage(src, false, lookingForMissingLetter);
  let candidate: any[] = [];
  cand.forEach(e => {
    candidate.push([e.padEnd(13, ' '), 0.0]);
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

function extractImage(src: any, removeHorizonzalAndVertical: boolean, lookingForMissingLetter: boolean): any {
  const linelength = 15;
  const repairsize = 3;
  const dilatesize = 3;
  const morphsize = 3;
  const drawcontoursizeh = 4;
  const drawcontoursizev = 4;

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
