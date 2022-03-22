/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'jhi-image-extractor',
  templateUrl: './image-extractor.component.html',
  styleUrls: ['./image-extractor.component.scss'],
})
export class ImageExtractorComponent implements OnInit {
  @Input()
  srcb64: any;
  @Input()
  left = 0;
  @Input()
  top = 0;
  @Input()
  width = 0;
  @Input()
  height = 0;

  w = '1px';
  h = '1px';

  @ViewChild(ImageCropperComponent)
  imageCropper!: ImageCropperComponent;

  imageCropPath!: SafeResourceUrl;
  cropvisible = false;

  constructor(private _sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    this.cropvisible = true;
  }

  public loaded(): void {
    this.imageCropper.marginLeft = 0;
    this.imageCropper.cropper = {
      x1: this.left,
      y1: this.top,
      x2: this.left + this.width,
      y2: this.top + this.height,
    };
    const res = this.imageCropper.crop();
    console.log(res);
    this.cropvisible = false;

    this.getImageDimensions(res!.base64!, (w: number, h: number) => {
      this.w = w + 'px';
      this.h = h + 'px';
      this.imageCropPath = this._sanitizer.bypassSecurityTrustResourceUrl(res!.base64!);
    });
  }

  getImageDimensions(file: any, cb: (w: number, h: number) => void): void {
    const i = new Image();
    i.onload = function () {
      cb(i.width, i.height);
    };
    i.src = file;
  }
}
