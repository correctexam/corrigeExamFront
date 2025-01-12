import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlignImagesService } from '../services/align-images.service';
import { firstValueFrom } from 'rxjs';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { NgIf, NgFor } from '@angular/common';

interface ExamPageImage {
  pageNumber: number;
  imageData: ImageData; // Using the built-in ImageData type
  width: number;
  height: number;
}

@Component({
  selector: 'app-image-access',
  templateUrl: './image-access.component.html',
  standalone: true,
  imports: [NgIf, NgFor],
})
export class ImageAccessComponent implements OnInit {
  @ViewChildren('imageCanvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  loading = true;
  error: string | null = null;
  examId: string | null = null;
  imageList: ExamPageImage[] = [];
  nbreFeuilleParCopie = 0;
  numberPagesInScan = 0;

  constructor(
    private route: ActivatedRoute,
    private alignImagesService: AlignImagesService,
    private db: CacheServiceImpl,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      this.examId = params['examid'];
      if (this.examId) {
        await this.loadImages();
      }
    });
  }

  async loadImages() {
    try {
      this.loading = true;
      this.error = null;

      if (!this.examId) {
        throw new Error('No exam ID provided');
      }

      // Get page counts first
      this.nbreFeuilleParCopie = await this.db.countPageTemplate(+this.examId);
      this.numberPagesInScan = await this.db.countAlignImage(+this.examId);

      // Get all aligned images
      const alignedImages = await this.db.getAlignSortByPageNumber(+this.examId);

      this.imageList = [];

      for (const imageData of alignedImages) {
        const image = JSON.parse(imageData.value, this.reviver);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Load image from base64
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          this.imageList.push({
            pageNumber: imageData.pageNumber,
            imageData: ctx!.getImageData(0, 0, img.width, img.height),
            width: img.width,
            height: img.height,
          });
        };
        img.src = image.pages;
      }

      this.loading = false;
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Failed to load images';
      this.loading = false;
    }
  }

  // Helper function to properly revive JSON with Maps
  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  ngAfterViewInit() {
    this.canvases.changes.subscribe(() => {
      this.renderImages();
    });
  }

  private renderImages() {
    this.canvases.forEach((canvasRef, index) => {
      const imageInfo = this.imageList[index];
      if (imageInfo) {
        const canvas = canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');

        canvas.width = imageInfo.width;
        canvas.height = imageInfo.height;
        ctx?.putImageData(imageInfo.imageData, 0, 0);
      }
    });
  }
}
