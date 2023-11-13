/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

declare let cv: any;

import { DoTransferableWorkUnit, runWorker } from 'observable-webworker';
import { Observable } from 'rxjs';
import { AlignImage, AppDB, NonAlignImage } from './scanexam/db/db';

interface IImageAlignement {
  imageAligned?: ArrayBuffer;
  imageAlignedWidth?: number;
  imageAlignedHeight?: number;
  pageNumber?: number;
  imagesDebugTraces?: ArrayBuffer;
  imagesDebugTracesWidth?: number;
  imagesDebugTracesHeight?: number;
}

interface IImageAlignementInput {
  imageA?: ArrayBuffer;
  marker?: boolean;
  x?: number;
  y?: number;
  widthA?: number;
  heightA?: number;
  pageNumber: number;
  preference: IPreference;
  debug: boolean;
  examId: number;
  indexDb: boolean;
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

let _sqlite3: any;
const dbs = new Map<number, DB>();

class DB {
  db: any;

  constructor(public examName: number) {}

  error(...args: string[]): void {
    console.error(...args);
  }

  initDb(sqlite3: any): void {
    if (this.db === undefined || !this.db.isOpen()) {
      const oo = sqlite3.oo1; /*high-level OO API*/
      if (sqlite3.opfs) {
        //        console.time('open');
        this.db = new oo.OpfsDb('/' + this.examName + '.sqlite3');
        //        console.timeEnd('open');
      } else {
        this.db = new oo.DB('/' + this.examName + '.sqlite3', 'ct');
      }
    }
  }

  close(): void {
    this.db.close();
  }

  initemptyDb(sqlite3: any): void {
    this.initDb(sqlite3);
    try {
      this.db.exec('CREATE TABLE IF NOT EXISTS template(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      this.db.exec('CREATE TABLE IF NOT EXISTS align(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
      this.db.exec('CREATE TABLE IF NOT EXISTS nonalign(page INTEGER NOT NULL PRIMARY KEY,imageData CLOB NOT NULL)');
    } finally {
      this.close();
    }
  }

  getFirstNonAlignImage(sqlite3: any, pageInscan: number): any {
    //    console.error("getFirstNonAlignImage",data.payload.pageInscan, t)
    this.initDb(sqlite3);
    try {
      return this.db.selectValue('select imageData from nonalign where page=' + pageInscan);
    } finally {
      this.close();
    }
  }
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
  db: AppDB | undefined;
  initSqlLite = false;
  sqlliteReady: (sqlite: boolean) => Promise<void> = (sqlite: boolean) =>
    sqlite
      ? new Promise<void>(resolve => {
          const self1 = self as any;
          self1['Module'] = {
            scriptUrl: 'content/sqlite/sqlite3.js',
          };

          // Load and await the .js OpenCV
          self1.importScripts(self1['Module'].scriptUrl);
          // const db1 = new DB(e.data.exam);
          // dbs.set(e.data.exam, db1);
          self1
            .sqlite3InitModule({
              print: console.log,
              printErr: console.error,
            })
            .then(function (sqlite3var: any) {
              _sqlite3 = sqlite3var;
              resolve();
            })
            .catch((err: any) => {
              console.log(err);
            });
        })
      : new Promise<void>(resolve => {
          resolve();
        });

  reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  async loadImage(ii: NonAlignImage | AlignImage): Promise<ImageData> {
    const image = JSON.parse(ii.value, this.reviver);
    const res = await fetch(image.pages);
    const blob = await res.blob();
    const imageBitmap = await createImageBitmap(blob);
    const editedImage = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = editedImage.getContext('2d');
    ctx!.drawImage(imageBitmap, 0, 0);
    return ctx!.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
  }

  async getScanImage(page: number, examId: number, indexDb: boolean): Promise<NonAlignImage | AlignImage | undefined> {
    if (indexDb) {
      if (this.db === undefined) {
        this.db = new AppDB();
      }
      return await this.db.getFirstNonAlignImage(examId, page);
    } else {
      let db1 = dbs.get(examId);
      if (db1 === undefined) {
        db1 = new DB(examId);
        dbs.set(examId, db1);
      }

      return {
        examId,

        pageNumber: page,
        value: db1.getFirstNonAlignImage(_sqlite3, page),
      };
    }
  }

  public workUnit(input: IImageAlignementInput): Observable<IImageAlignement> {
    return new Observable(observer => {
      this.opencvready
        .then(async () => {
          if (!input.indexDb && !this.initSqlLite) {
            await this.sqlliteReady(!input.indexDb);
            this.initSqlLite = true;
          }

          //    console.error('start worker');
          const im = await this.getScanImage(input.pageNumber, input.examId, input.indexDb);
          if (im !== undefined) {
            const im1 = await this.loadImage(im);
            if (!input.marker) {
              try {
                const res = this.alignImage(
                  input.imageA,
                  im1,
                  input.widthA!,
                  input.heightA!,
                  false,
                  input.preference.numberofpointToMatch,
                  input.preference.numberofpointToMatch,
                  input.debug,
                );
                input.imageA = undefined;

                res.pageNumber = input.pageNumber;
                observer.next(res);
                observer.complete();
              } catch (error) {
                console.error(error);
              }
            } else {
              const res = this.alignImageBasedOnCircle(input.imageA, im1, input.widthA!, input.heightA!, input.preference, input.debug);
              res.pageNumber = input.pageNumber;
              observer.next(res);
              observer.complete();
            }
          }
        })

        .catch(err => {
          console.log(err);
        });
    });
  }
  public selectTransferables(output: IImageAlignement): Transferable[] {
    if (output.imagesDebugTraces !== undefined) {
      return [output.imageAligned!, output.imagesDebugTraces];
    } else {
      return [output.imageAligned!];
    }
  }

  imageDataFromMat(mat: any): any {
    // convert the mat type to cv.CV_8U
    const img = mat; //new cv.Mat();
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
    //    img.delete();
    mat.delete();
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
    image_Bba: ImageData,
    widthA: number,
    heightA: number,
    allimage: boolean,
    numberofpointToMatch: number,
    numberofgoodpointToMatch: number,
    debug: boolean,
  ): any {
    const image_A = new ImageData(new Uint8ClampedArray(image_Aba), widthA, heightA);
    const image_B = image_Bba;

    const im2 = cv.matFromImageData(image_A);
    let _im1 = cv.matFromImageData(image_B);
    let im1 = _im1;
    if (im2.size().width !== _im1.size().width || im2.size().height !== _im1.size().height) {
      //new cv.Mat();
      let dsize = new cv.Size(im2.size().width, im2.size().height);
      // You can try more different parameters
      cv.resize(im1, im1, dsize, 0, 0, cv.INTER_AREA);
    }

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

        res1 = this.matchSmallImage(im1Gray, im2Gray, points1, points2, zone1, numberofpointToMatch, numberofgoodpointToMatch);
        if (!res1) {
          squareSize = squareSize + Math.trunc(minPageWidth / 10);
        }
      }

      squareSize = squareSizeorigin;
      while (!res2 && squareSize < (minPageWidth * 3) / 4 && squareSize < (minPageHeight * 2) / 3) {
        let zone2 = new cv.Rect(minPageWidth - squareSize, 0, minPageWidth, squareSize);
        res2 = this.matchSmallImage(im1Gray, im2Gray, points1, points2, zone2, numberofpointToMatch, numberofgoodpointToMatch);
        if (!res2) {
          squareSize = squareSize + Math.trunc(minPageWidth / 10);
        }
      }

      squareSize = squareSizeorigin;
      while (!res3 && squareSize < (minPageWidth * 3) / 4 && squareSize < (minPageHeight * 2) / 3) {
        let zone3 = new cv.Rect(0, minPageHeight - squareSize, squareSize, minPageHeight);
        res3 = this.matchSmallImage(im1Gray, im2Gray, points1, points2, zone3, numberofpointToMatch, numberofgoodpointToMatch);

        if (!res3) {
          squareSize = squareSize + Math.trunc(minPageWidth / 10);
        }
      }

      squareSize = squareSizeorigin;
      while (!res4 && squareSize < (minPageWidth * 3) / 4 && squareSize < (minPageHeight * 2) / 3) {
        let zone4 = new cv.Rect(minPageWidth - squareSize, minPageHeight - squareSize, minPageWidth, minPageHeight);
        res4 = this.matchSmallImage(im1Gray, im2Gray, points1, points2, zone4, numberofpointToMatch, numberofgoodpointToMatch);
        if (!res4) {
          squareSize = squareSize + Math.trunc(minPageWidth / 10);
        }
      }
    } else {
      let zone6 = new cv.Rect(0, 0, minPageWidth, minPageHeight);
      res1 = this.matchSmallImage(im1Gray, im2Gray, points1, points2, zone6, numberofpointToMatch, numberofgoodpointToMatch);

      res2 = true;
      res3 = true;
      res4 = true;
    }
    if (res1 && res2 && res3 && res4) {
      let mat1 = cv.matFromArray(points1.length / 2, 1, cv.CV_32FC2, points1);
      let mat2 = cv.matFromArray(points2.length / 2, 1, cv.CV_32FC2, points2);

      let h = cv.findHomography(mat1, mat2, cv.RANSAC);

      let image_B_final_result = im1;
      cv.warpPerspective(image_B_final_result, image_B_final_result, h, im2.size());

      if (debug) {
        let matVec = new cv.MatVector();
        // Push a Mat back into MatVector
        matVec.push_back(im2);
        matVec.push_back(im1);

        let dstdebug = new cv.Mat();

        cv.hconcat(matVec, dstdebug);
        const nbrePoints = points2.length / 2;
        for (let i = 0; i < nbrePoints; i++) {
          let p1 = { x: points2[i * 2], y: points2[i * 2 + 1] };
          let p2 = { x: im2.size().width + points1[i * 2], y: points1[i * 2 + 1] };
          cv.circle(dstdebug, p1, 5, [0, 255, 0, 255], 1);
          cv.circle(dstdebug, p2, 5, [0, 255, 0, 255], 1);

          cv.line(dstdebug, p1, p2, [0, 255, 0, 255], 1);
        }

        result['imagesDebugTracesWidth'] = dstdebug.size().width;
        result['imagesDebugTracesHeight'] = dstdebug.size().height;
        result['imagesDebugTraces'] = this.imageDataFromMat(dstdebug).data.buffer;
        // dstdebug.delete();
        matVec.delete();
      }
      result['imageAlignedWidth'] = image_B_final_result.size().width;
      result['imageAlignedHeight'] = image_B_final_result.size().height;
      result['imageAligned'] = this.imageDataFromMat(image_B_final_result).data.buffer;

      mat1.delete();
      mat2.delete();
      h.delete();
      image_Bba.data.set([]);
    } else {
      if (debug) {
        let matVec = new cv.MatVector();
        // Push a Mat back into MatVector
        matVec.push_back(im2);
        matVec.push_back(im1);
        let dstdebug = new cv.Mat();
        cv.hconcat(matVec, dstdebug);
        result['imagesDebugTracesWidth'] = dstdebug.size().width;
        result['imagesDebugTracesHeight'] = dstdebug.size().height;
        result['imagesDebugTraces'] = this.imageDataFromMat(dstdebug).data.buffer;
        matVec.delete();
      }
      result['imageAligned'] = image_Bba.data.buffer;
      result['imageAlignedWidth'] = image_Bba.width;
      result['imageAlignedHeight'] = image_Bba.height;

      im1.delete();
    }
    image_A.data.set([]);
    //_im1.delete();
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
    numberofpointToMatch: number,
    numberofgoodpointToMatch: number,
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
    let tmp1 = im1Graydst;
    let tmp2 = im2Graydst;
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
      //      tmp1.delete();
      //      tmp2.delete();
      im1Graydst.delete();
      im2Graydst.delete();
      matches.delete();
      good_matches.delete();
      bf.delete();
      //       im1Graydst.delete();
      //      im2Graydst.delete();

      return false;
    }
    //  console.log("pass par la 7 ", "page ", pageNumber + "zone " + ii)
    const indexGood = [];
    for (let i = 0; i < good_matches.size(); i++) {
      let distancesquare =
        (points1tmp[2 * i] - points2tmp[2 * i]) * (points1tmp[2 * i] - points2tmp[2 * i]) +
        (points1tmp[2 * i + 1] - points2tmp[2 * i + 1]) * (points1tmp[2 * i + 1] - points2tmp[2 * i + 1]);
      // TODO compute average points

      if (distancesquare < Math.trunc((3 * im1Graydst.size().width) / 20) * Math.trunc((3 * im1Graydst.size().height) / 20)) {
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

    if (realgoodmatchtokeep <= numberofgoodpointToMatch) {
      orb.delete();
      keypoints1.delete();
      keypoints2.delete();
      descriptors1.delete();
      descriptors2.delete();
      //      tmp1.delete();
      //      tmp2.delete();
      im1Graydst.delete();
      im2Graydst.delete();
      matches.delete();
      good_matches.delete();
      bf.delete();
      return false;
    } else {
      const good_matchesToKeep: number[] = [];
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
              distanceaverage,
          ) -
          Math.abs(
            (points1tmp[2 * b] - points2tmp[2 * b]) * (points1tmp[2 * b] - points2tmp[2 * b]) +
              (points1tmp[2 * b + 1] - points2tmp[2 * b + 1] * (points1tmp[2 * b + 1] - points2tmp[2 * b + 1])) -
              distanceaverage,
          ),
      );

      good_matchesToKeep.push(intergood_matchesToKeep[0]);
      good_matchesToKeep.push(intergood_matchesToKeep[1]);
      good_matchesToKeep.push(intergood_matchesToKeep[2]);
      good_matchesToKeep.push(intergood_matchesToKeep[3]);
      good_matchesToKeep.push(intergood_matchesToKeep[4]);

      // console.error('last realgoodmatchtokeep', good_matchesToKeep.length, numberofgoodpointToMatch);

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
      //      tmp1.delete();
      //      tmp2.delete();
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

        0,
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
    image_Bba: ImageData,
    widthA: number,
    heightA: number,
    preference: IPreference,
    debug: boolean,
  ): any {
    //im2 is the original reference image we are trying to align to
    const imageA = new ImageData(new Uint8ClampedArray(image_Aba), widthA, heightA);
    //    const imageB = new ImageData(new Uint8ClampedArray(image_Bba), widthB, heightB);
    const imageB = image_Bba;
    let _srcMat = cv.matFromImageData(imageA);
    let srcMat = new cv.Mat(); ///cv.Mat.zeros(srcMat.rows, srcMat.cols, cv.CV_8U);

    // let color = new cv.Scalar(255, 0, 0);
    // let displayMat = srcMat.clone();
    let circlesMat = new cv.Mat();
    cv.cvtColor(_srcMat, srcMat, cv.COLOR_RGBA2GRAY);
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

    let _srcMat2 = cv.matFromImageData(imageB);
    let srcMat2 = new cv.Mat();
    let dsize1 = new cv.Size(srcMat.size().width, srcMat.size().height);
    // You can try more different parameters
    cv.resize(_srcMat2, srcMat2, dsize1, 0, 0, cv.INTER_AREA);

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
      let dstrect2 = new cv.Mat();
      let dstrect1 = new cv.Mat();
      dstrect2 = this.roi(srcMat1, rect1);
      cv.threshold(dstrect2, dstrect1, 0, 255, cv.THRESH_OTSU + cv.THRESH_BINARY);
      if (cv.countNonZero(dstrect1) < seuil) {
        goodpointsx.push(x);
        goodpointsy.push(y);
      }
      dstrect1.delete();
      dstrect2.delete();
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
      let M = cv.getPerspectiveTransform(dstTri, srcTri);
      let dsize = new cv.Size(srcMat.cols, srcMat.rows);
      for (let i = 0; i < srcTri.rows; ++i) {
        const xx = dstTri.data32F[i * 2];
        const yy = dstTri.data32F[i * 2 + 1];
        let radius = 15;
        let center = new cv.Point(xx, yy);
        cv.circle(srcMat2, center, radius, [0, 0, 255, 255], 1);
      }
      let dst = srcMat2; // new cv.Mat(); ///cv.Mat.zeros(srcMat.rows, srcMat.cols, cv.CV_8U);

      cv.warpPerspective(srcMat2, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

      let result = {} as any;

      if (debug) {
        let matVec = new cv.MatVector();
        // Push a Mat back into MatVector
        matVec.push_back(_srcMat);
        matVec.push_back(srcMat2);

        let dsize2 = new cv.Size(_srcMat.size().width * 2, srcMat.size().height);

        let dstdebug = new cv.Mat(dsize2, _srcMat.type());
        cv.hconcat(matVec, dstdebug);

        // await new Promise(r => setTimeout(r, 5000));

        let p1 = { x: x1, y: y1 };
        let p2 = { x: srcMat.size().width + x5, y: y5 };
        cv.circle(dstdebug, p1, 15, [0, 255, 0, 255], 1);
        cv.circle(dstdebug, p2, 15, [0, 255, 0, 255], 1);
        cv.line(dstdebug, p1, p2, [0, 255, 0, 255], 1);
        p1 = { x: x2, y: y2 };
        p2 = { x: srcMat.size().width + x6, y: y6 };
        cv.circle(dstdebug, p1, 15, [0, 255, 0, 255], 1);
        cv.circle(dstdebug, p2, 15, [0, 255, 0, 255], 1);
        cv.line(dstdebug, p1, p2, [0, 255, 0, 255], 1);
        p1 = { x: x3, y: y3 };
        p2 = { x: srcMat.size().width + x7, y: y7 };
        cv.circle(dstdebug, p1, 15, [0, 255, 0, 255], 1);
        cv.circle(dstdebug, p2, 15, [0, 255, 0, 255], 1);
        cv.line(dstdebug, p1, p2, [0, 255, 0, 255], 1);
        p1 = { x: x4, y: y4 };
        p2 = { x: srcMat.size().width + x8, y: y8 };
        cv.circle(dstdebug, p1, 15, [0, 255, 0, 255], 1);
        cv.circle(dstdebug, p2, 15, [0, 255, 0, 255], 1);
        cv.line(dstdebug, p1, p2, [0, 255, 0, 255], 1);

        result['imagesDebugTracesWidth'] = dstdebug.size().width;
        result['imagesDebugTracesHeight'] = dstdebug.size().height;
        result['imagesDebugTraces'] = this.imageDataFromMat(dstdebug).data.buffer;
        // dstdebug.delete();
        matVec.delete();
      }
      result['imageAlignedWidth'] = dst.size().width;
      result['imageAlignedHeight'] = dst.size().height;
      result['imageAligned'] = this.imageDataFromMat(dst).data.buffer;

      _srcMat.delete();
      srcMat.delete();
      //      dst.delete();
      circlesMat.delete();
      srcMat1.delete();
      // srcMat2.delete();
      _srcMat2.delete();
      circlesMat1.delete();
      srcTri.delete();
      dstTri.delete();
      //      dst1.delete();
      M.delete();

      //      console.error('find circle');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    } else {
      _srcMat.delete();
      srcMat.delete();
      // dst.delete();
      circlesMat.delete();
      srcMat1.delete();
      srcMat2.delete();
      _srcMat2.delete();
      circlesMat1.delete();

      //  console.error('cannot find circle');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.alignImage(
        image_Aba,
        image_Bba,
        widthA,
        heightA,
        false,
        preference.numberofpointToMatch,
        preference.numberofgoodpointToMatch,
        debug,
      );
    }
  }
}

runWorker(WorkerPoolAlignWorker);
