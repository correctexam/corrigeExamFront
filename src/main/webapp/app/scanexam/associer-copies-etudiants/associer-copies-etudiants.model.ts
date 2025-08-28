/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-const */
/* eslint-disable no-console */

import { IStudent } from 'app/entities/student/student.model';

export interface IPage {
  image?: ImageData;
  page?: number;
  width?: number;
  height?: number;
}

export interface ICluster {
  images: IImageCluster[];
  nbrCluster: number;
}

export interface IImageCluster {
  image: ArrayBuffer;
  imageIndex: number;
  studentIndex: number;
  width?: number;
  height?: number;
}

export interface ImageZone {
  t?: ImageData;
  i: ImageData;
  w: number;
  h: number;
}

export interface PredictResult {
  recognizedStudent?: IStudent;
  predictionprecision: number;
  nameImage?: ImageData;
  firstnameImage?: ImageData;
  ineImage?: ImageData;
  nameImageDebug?: ImageData;
  firstnameImageDebug?: ImageData;
  ineImageDebug?: ImageData;
  page: number;
}
