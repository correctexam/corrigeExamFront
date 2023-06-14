/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

declare let cv: any;

import { DoTransferableWorkUnit, runWorker } from 'observable-webworker';
import { Observable } from 'rxjs';

interface IImageAlignement {
  imageAligned?: ArrayBuffer;
  imageAlignedWidth?: number;
  imageAlignedHeight?: number;
  pageNumber?: number;
}

interface IImageAlignementInput {
  imageA?: ArrayBuffer;
  imageB?: ArrayBuffer;
  marker?: boolean;
  x?: number;
  y?: number;
  widthA?: number;
  heightA?: number;
  widthB?: number;
  heightB?: number;
  pageNumber: number;
  preference: IPreference;
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
}

export class WorkerPoolAlignWorker implements DoTransferableWorkUnit<IImageAlignementInput, IImageAlignement> {
  opencvready: Promise<void> = new Promise<void>(resolve => {
    const self1 = self as any;
    self1['Module'] = {
      scriptUrl: 'content/opencv/4/opencv.js',
      onRuntimeInitialized() {
        cv.then((cv1: any) => {
          cv = cv1;
          cv.ready
            .then(() => {
              resolve();
            })
            .catch((err: any) => {
              console.log(err);
            });
        });
      },
    };
    self1.importScripts(self1['Module'].scriptUrl);
  });

  public workUnit(input: IImageAlignementInput): Observable<IImageAlignement> {
    return new Observable(observer => {
      this.opencvready
        .then(() => {
          if (!input.marker) {
            try {
              const res = this.alignImage(
                input.imageA,
                input.imageB,
                input.widthA!,
                input.heightA!,
                input.widthB!,
                input.heightB!,
                false,
                input.preference.numberofpointToMatch,
                input.preference.numberofpointToMatch,
                input.pageNumber
              );
              input.imageA = undefined;
              input.imageB = undefined;

              res.pageNumber = input.pageNumber;
              observer.next(res);
              observer.complete();
            } catch (error) {
              console.error(error);
            }
          } else {
            const res = this.alignImageBasedOnCircle(
              input.imageA,
              input.imageB,
              input.widthA!,
              input.heightA!,
              input.widthB!,
              input.heightB!,
              input.pageNumber,
              input.preference
            );
            res.pageNumber = input.pageNumber;
            observer.next(res);
            observer.complete();
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  public selectTransferables(output: IImageAlignement): Transferable[] {
    return [output.imageAligned!];
  }

  imageDataFromMat(mat: any): any {
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

  roi(src: any, rect: any): any {
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
    return src.roi(rect); // You can try more different parameters
  }

  alignImage(
    image_Aba: any,
    image_Bba: any,
    widthA: number,
    heightA: number,
    widthB: number,
    heightB: number,
    allimage: boolean,
    numberofpointToMatch: number,
    numberofgoodpointToMatch: number,
    pageNumber: number
  ): any {
    //im2 is the original reference image we are trying to align to
    const image_A = new ImageData(new Uint8ClampedArray(image_Aba), widthA, heightA);
    const image_B = new ImageData(new Uint8ClampedArray(image_Bba), widthB, heightB);

    const im2 = cv.matFromImageData(image_A);
    let im1 = cv.matFromImageData(image_B);
    //  console.log("pass par la 1 ", "page ", pageNumber)
    let im1Gray = new cv.Mat();
    let im2Gray = new cv.Mat();
    cv.cvtColor(im1, im1Gray, cv.COLOR_BGRA2GRAY);
    cv.cvtColor(im2, im2Gray, cv.COLOR_BGRA2GRAY);
    //  console.log("pass par la 2 ", "page ", pageNumber)
    const squareSizeorigin = Math.trunc(im2.size().width / 20);
    let points1: any[] = [];
    let points2: any[] = [];
    let result: any = {};
    let res1 = false;
    let res2 = false;
    let res3 = false;
    let res4 = false;

    const minPageWidth = Math.min(im1Gray.size().width, im2Gray.size().width);
    const minPageHeight = Math.min(im1Gray.size().height, im2Gray.size().height);
    if (!allimage) {
      let squareSize = squareSizeorigin;
      while (!res1 && squareSize < (minPageWidth * 3) / 4 && squareSize < (minPageHeight * 2) / 3) {
        let zone1 = new cv.Rect(0, 0, squareSize, squareSize);
        //   console.log("pass par la 3 ", "page ", pageNumber)

        res1 = this.matchSmallImage(
          im1Gray,
          im2Gray,
          points1,
          points2,
          zone1,
          1,
          numberofpointToMatch,
          numberofgoodpointToMatch,
          pageNumber
        );
        if (!res1) {
          squareSize = squareSize + Math.trunc(minPageWidth / 10);
        }
      }

      squareSize = squareSizeorigin;
      while (!res2 && squareSize < (minPageWidth * 3) / 4 && squareSize < (minPageHeight * 2) / 3) {
        let zone2 = new cv.Rect(minPageWidth - squareSize, 0, minPageWidth, squareSize);
        res2 = this.matchSmallImage(
          im1Gray,
          im2Gray,
          points1,
          points2,
          zone2,
          2,
          numberofpointToMatch,
          numberofgoodpointToMatch,
          pageNumber
        );
        if (!res2) {
          squareSize = squareSize + Math.trunc(minPageWidth / 10);
        }
      }

      squareSize = squareSizeorigin;
      while (!res3 && squareSize < (minPageWidth * 3) / 4 && squareSize < (minPageHeight * 2) / 3) {
        let zone3 = new cv.Rect(0, minPageHeight - squareSize, squareSize, minPageHeight);
        res3 = this.matchSmallImage(
          im1Gray,
          im2Gray,
          points1,
          points2,
          zone3,
          3,
          numberofpointToMatch,
          numberofgoodpointToMatch,
          pageNumber
        );

        if (!res3) {
          squareSize = squareSize + Math.trunc(minPageWidth / 10);
        }
      }

      squareSize = squareSizeorigin;
      while (!res4 && squareSize < (minPageWidth * 3) / 4 && squareSize < (minPageHeight * 2) / 3) {
        let zone4 = new cv.Rect(minPageWidth - squareSize, minPageHeight - squareSize, minPageWidth, minPageHeight);
        res4 = this.matchSmallImage(
          im1Gray,
          im2Gray,
          points1,
          points2,
          zone4,
          4,
          numberofpointToMatch,
          numberofgoodpointToMatch,
          pageNumber
        );
        if (!res4) {
          squareSize = squareSize + Math.trunc(minPageWidth / 10);
        }
      }
    } else {
      let zone6 = new cv.Rect(0, 0, minPageWidth, minPageHeight);
      res1 = this.matchSmallImage(im1Gray, im2Gray, points1, points2, zone6, 1, numberofpointToMatch, numberofgoodpointToMatch, pageNumber);

      res2 = true;
      res3 = true;
      res4 = true;
    }
    //    console.log('points1:', points1, 'points2:', points2);
    if (res1 && res2 && res3 && res4) {
      /*if (points1.length % 4 !== 0){
        const t =points1.length % 4;
        console.error(t);
        points1 = points1.splice(0,points1.length -t);

      }*/
      //      let mat1 = cv.matFromArray(points1.length/2, 1, cv.CV_32FC1, points1);
      //      let mat2 = cv.matFromArray(4, 1, cv.CV_32FC2, points2);

      let mat1 = cv.matFromArray(points1.length / 2, 1, cv.CV_32FC2, points1);
      let mat2 = cv.matFromArray(points2.length / 2, 1, cv.CV_32FC2, points2);

      let h = cv.findHomography(mat1, mat2, cv.RANSAC);
      //let M = cv.getPerspectiveTransform(mat1, mat2);

      /*  if (h.empty()) {
         console.log('homography matrix empty!');
         return;
       } */

      let image_B_final_result = new cv.Mat();
      cv.warpPerspective(im1, image_B_final_result, h, im2.size());

      //      let M = cv.getPerspectiveTransform(mat1, mat2);
      //      let image_B_final_result = new cv.Mat();
      //      console.error(points1, points2);

      //     cv.warpPerspective(im1, image_B_final_result, M, im2.size(), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

      result['imageAligned'] = this.imageDataFromMat(image_B_final_result).data.buffer;
      result['imageAlignedWidth'] = image_B_final_result.size().width;
      result['imageAlignedHeight'] = image_B_final_result.size().height;
      mat1.delete();
      mat2.delete();
      h.delete();
      image_B_final_result.delete();
      console.log('Good match for page ' + pageNumber);
    } else {
      result['imageAligned'] = image_Bba.slice(0);
      result['imageAlignedWidth'] = widthB;
      result['imageAlignedHeight'] = heightB;
      console.log('no match for page ' + pageNumber);
    }

    im1.delete();
    im2.delete();
    im1Gray.delete();
    im2Gray.delete();
    return result;
  }

  matchSmallImage(
    im1Gray: any,
    im2Gray: any,
    points1: any[],
    points2: any[],
    zone1: any,
    ii: number,
    numberofpointToMatch: number,
    numberofgoodpointToMatch: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _pageNumber: number
  ): boolean {
    // console.log("pass par la 4 ", "page ", pageNumber + "zone " + ii)

    let im1Graydst = new cv.Mat();
    im1Graydst = this.roi(im1Gray, zone1);

    //   console.log("pass par la 45 ", "page ", pageNumber + "zone " + ii)

    let im2Graydst = new cv.Mat();
    im2Graydst = this.roi(im2Gray, zone1);
    //  console.log("pass par la 5 ", "page ", pageNumber + "zone " + ii)

    let keypoints1 = new cv.KeyPointVector();
    let keypoints2 = new cv.KeyPointVector();
    let descriptors1 = new cv.Mat();
    let descriptors2 = new cv.Mat();

    let orb = new cv.AKAZE();
    let tmp1 = new cv.Mat();
    let tmp2 = new cv.Mat();
    orb.detectAndCompute(im1Graydst, tmp1, keypoints1, descriptors1);
    orb.detectAndCompute(im2Graydst, tmp2, keypoints2, descriptors2);

    let good_matches = new cv.DMatchVector();

    let bf = new cv.BFMatcher();
    let matches = new cv.DMatchVectorVector();
    bf.knnMatch(descriptors1, descriptors2, matches, 2);

    //  let counter = 0;
    for (let i = 0; i < matches.size(); ++i) {
      let match = matches.get(i);
      let dMatch1 = match.get(0);
      let dMatch2 = match.get(1);
      let knnDistance_option = '0.7';
      if (dMatch1 !== undefined && dMatch2 !== undefined && dMatch1.distance <= dMatch2.distance * parseFloat(knnDistance_option)) {
        good_matches.push_back(dMatch1);
      }
    }
    //  console.log("pass par la 6 ", "page ", pageNumber + "zone " + ii)

    let points1tmp: number[] = [];
    let points2tmp: number[] = [];
    for (let i = 0; i < good_matches.size(); i++) {
      points1tmp.push(keypoints1.get(good_matches.get(i).queryIdx).pt.x + zone1.x);
      points1tmp.push(keypoints1.get(good_matches.get(i).queryIdx).pt.y + zone1.y);
      points2tmp.push(keypoints2.get(good_matches.get(i).trainIdx).pt.x + zone1.x);
      points2tmp.push(keypoints2.get(good_matches.get(i).trainIdx).pt.y + zone1.y);
    }
    let goodmatchtokeep = 0;
    let distances = [];

    if (good_matches.size() === 0) {
      orb.delete();
      keypoints1.delete();
      keypoints2.delete();
      descriptors1.delete();
      descriptors2.delete();
      tmp1.delete();
      tmp2.delete();
      im1Graydst.delete();
      im2Graydst.delete();
      matches.delete();
      good_matches.delete();
      bf.delete();
      return false;
    }
    //  console.log("pass par la 7 ", "page ", pageNumber + "zone " + ii)
    const indexGood = [];
    for (let i = 0; i < good_matches.size(); i++) {
      let distancesquare =
        (points1tmp[2 * i] - points2tmp[2 * i]) * (points1tmp[2 * i] - points2tmp[2 * i]) +
        (points1tmp[2 * i + 1] - points2tmp[2 * i + 1]) * (points1tmp[2 * i + 1] - points2tmp[2 * i + 1]);
      // TODO compute average points
      //  console.error('distancesquare', distancesquare)
      //  console.error('maxdistance', Math.trunc((3 * im1Graydst.size().width) / 20) * Math.trunc((3 * im1Graydst.size().width) / 20))

      if (distancesquare < Math.trunc((3 * im1Graydst.size().width) / 20) * Math.trunc((3 * im1Graydst.size().height) / 20)) {
        //   console.error('pass par la')
        distances.push(distancesquare);
        goodmatchtokeep = goodmatchtokeep + 1;
        indexGood.push(i);
      }
    }

    const distance = this.numAverage(distances);
    let devs = this.dev(distances);
    if (devs < 1) {
      devs = 1;
    }
    //    console.error('first match' , goodmatchtokeep, numberofpointToMatch)
    if (goodmatchtokeep <= numberofpointToMatch) {
      orb.delete();
      keypoints1.delete();
      keypoints2.delete();
      descriptors1.delete();
      descriptors2.delete();
      tmp1.delete();
      tmp2.delete();
      im1Graydst.delete();
      im2Graydst.delete();
      matches.delete();
      good_matches.delete();
      bf.delete();
      return false;
    }
    let realgoodmatchtokeep = 0;

    let intergood_matchesToKeep = [];
    for (let i = 0; i < indexGood.length; i++) {
      let distancesquare =
        (points1tmp[2 * indexGood[i]] - points2tmp[2 * indexGood[i]]) * (points1tmp[2 * indexGood[i]] - points2tmp[2 * indexGood[i]]) +
        (points1tmp[2 * indexGood[i] + 1] - points2tmp[2 * indexGood[i] + 1]) *
          (points1tmp[2 * indexGood[i] + 1] - points2tmp[2 * indexGood[i] + 1]);
      // TODO compute average points
      if (distancesquare <= distance + 1 * devs && distancesquare >= distance - 1 * devs) {
        realgoodmatchtokeep = realgoodmatchtokeep + 1;
        intergood_matchesToKeep.push(indexGood[i]);
        // break;
      }
    }

    // console.log(realgoodmatchtokeep)
    console.error('first realgoodmatchtokeep', realgoodmatchtokeep, numberofgoodpointToMatch);

    if (realgoodmatchtokeep <= numberofgoodpointToMatch) {
      orb.delete();
      keypoints1.delete();
      keypoints2.delete();
      descriptors1.delete();
      descriptors2.delete();
      tmp1.delete();
      tmp2.delete();
      im1Graydst.delete();
      im2Graydst.delete();
      matches.delete();
      good_matches.delete();
      bf.delete();
      return false;
    } else {
      let good_matchesToKeep: number[] = [];
      const distancesfinal: number[] = [];
      intergood_matchesToKeep.forEach(i => {
        const distancesquare =
          (points1tmp[2 * i] - points2tmp[2 * i]) * (points1tmp[2 * i] - points2tmp[2 * i]) +
          (points1tmp[2 * i + 1] - points2tmp[2 * i + 1]) * (points1tmp[2 * i + 1] - points2tmp[2 * i + 1]);
        distancesfinal.push(distancesquare);
      });

      const distanceaverage = this.numAverage(distancesfinal);
      //let devsdistance = this.dev(distancesfinal);
      intergood_matchesToKeep.sort(
        (a, b) =>
          Math.abs(
            (points1tmp[2 * a] - points2tmp[2 * a]) * (points1tmp[2 * a] - points2tmp[2 * a]) +
              (points1tmp[2 * a + 1] - points2tmp[2 * a + 1]) * (points1tmp[2 * a + 1] - points2tmp[2 * a + 1]) -
              distanceaverage
          ) -
          Math.abs(
            (points1tmp[2 * b] - points2tmp[2 * b]) * (points1tmp[2 * b] - points2tmp[2 * b]) +
              (points1tmp[2 * b + 1] - points2tmp[2 * b + 1] * (points1tmp[2 * b + 1] - points2tmp[2 * b + 1])) -
              distanceaverage
          )
      );

      good_matchesToKeep.push(intergood_matchesToKeep[0]);
      good_matchesToKeep.push(intergood_matchesToKeep[1]);
      good_matchesToKeep.push(intergood_matchesToKeep[2]);
      good_matchesToKeep.push(intergood_matchesToKeep[3]);
      good_matchesToKeep.push(intergood_matchesToKeep[4]);

      console.error('last realgoodmatchtokeep', good_matchesToKeep.length, numberofgoodpointToMatch);

      good_matchesToKeep.forEach(i => {
        points1.push(keypoints1.get(good_matches.get(+i).queryIdx).pt.x + zone1.x);
        points1.push(keypoints1.get(good_matches.get(+i).queryIdx).pt.y + zone1.y);
        points2.push(keypoints2.get(good_matches.get(+i).trainIdx).pt.x + zone1.x);
        points2.push(keypoints2.get(good_matches.get(+i).trainIdx).pt.y + zone1.y);
      });
      orb.delete();
      keypoints1.delete();
      keypoints2.delete();
      descriptors1.delete();
      descriptors2.delete();
      tmp1.delete();
      tmp2.delete();
      im1Graydst.delete();
      im2Graydst.delete();
      matches.delete();
      good_matches.delete();
      bf.delete();

      // console.log('good match for zone ' + ii + ' = ' + realgoodmatchtokeep);

      return true;
    }
  }

  numAverage(arr: number[]): number {
    return (
      arr.reduce(
        (acc: number, curr: number) => acc + curr,

        0
      ) / arr.length
    );
  }

  // Javascript program to calculate the standered deviation of an array
  dev(arr: number[]): number {
    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr) => acc + curr, 0) / arr.length;

    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map(k => (k - mean) ** 2);

    // Calculating the sum of updated array
    let sum = arr.reduce((acc, curr) => acc + curr, 0);

    // Calculating the variance
    // let variance = sum / arr.length

    // Returning the Standered deviation
    return Math.sqrt(sum / arr.length);
  }

  alignImageBasedOnCircle(
    image_Aba: any,
    image_Bba: any,
    widthA: number,
    heightA: number,
    widthB: number,
    heightB: number,
    pageNumber: number,
    preference: IPreference
  ): any {
    //im2 is the original reference image we are trying to align to
    const imageA = new ImageData(new Uint8ClampedArray(image_Aba), widthA, heightA);
    const imageB = new ImageData(new Uint8ClampedArray(image_Bba), widthB, heightB);

    let srcMat = cv.matFromImageData(imageA);
    let dst = new cv.Mat(); ///cv.Mat.zeros(srcMat.rows, srcMat.cols, cv.CV_8U);
    // let color = new cv.Scalar(255, 0, 0);
    // let displayMat = srcMat.clone();
    let circlesMat = new cv.Mat();
    cv.cvtColor(srcMat, srcMat, cv.COLOR_RGBA2GRAY);
    //  cv.HoughCircles(srcMat, circlesMat, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 0);
    let minCircle = (srcMat.cols * preference.minCircle) / 1000;
    let maxCircle = (srcMat.cols * preference.maxCircle) / 1000;

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

    let srcMat2 = cv.matFromImageData(imageB);
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
      dstrect1 = this.roi(srcMat1, rect1);
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
      y5 = goodpointsy[0];
      x6 = goodpointsx[0];
      y6 = goodpointsy[0];
      x7 = goodpointsx[0];
      y7 = goodpointsy[0];
      x8 = goodpointsx[0];
      y8 = goodpointsy[0];
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
      //    let h = cv.findHomography(dstTri, srcTri, cv.RANSAC);
      //    let dsize = new cv.Size(srcMat.cols, srcMat.rows);

      /*   if (h.empty()) {
        console.log('homography matrix empty!');
        return;
      }*/
      //    let mat1 = cv.matFromArray(4, 1, cv.CV_32FC2, points1);
      //   let mat2 = cv.matFromArray(4, 1, cv.CV_32FC2,points2);
      let M = cv.getPerspectiveTransform(dstTri, srcTri);
      let dsize = new cv.Size(srcMat.cols, srcMat.rows);
      for (let i = 0; i < srcTri.rows; ++i) {
        //      let x = srcTri.data32F[i * 2];
        //      let y = srcTri.data32F[i * 2 + 1];
        const xx = dstTri.data32F[i * 2];
        const yy = dstTri.data32F[i * 2 + 1];
        let radius = 15;
        let center = new cv.Point(xx, yy);
        //      cv.circle(srcMat, center, radius, [0, 0, 255, 255], 1);
        cv.circle(srcMat2, center, radius, [0, 0, 255, 255], 1);
      }

      cv.warpPerspective(srcMat2, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

      let dst1 = dst.clone();
      let result = {} as any;
      result['imageAligned'] = this.imageDataFromMat(dst1).data.buffer;
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
      srcMat.delete();
      dst.delete();
      circlesMat.delete();
      srcMat1.delete();
      srcMat2.delete();
      circlesMat1.delete();
      return this.alignImage(
        image_Aba,
        image_Bba,
        widthA,
        heightA,
        widthB,
        heightB,
        false,
        preference.numberofpointToMatch,
        preference.numberofgoodpointToMatch,
        pageNumber
      );
    }
  }
}

runWorker(WorkerPoolAlignWorker);
