import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlignImagesService, IImageCropFromZoneInput } from '../services/align-images.service';
import { Subscription, timeout } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-image-access',
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading image... Please wait</div>
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
        <button (click)="reloadImage()" class="retry-button">Retry</button>
      </div>

      <div class="canvas-container" [style.display]="loading ? 'none' : 'block'">
        <canvas #canvas id="mainCanvas"></canvas>
      </div>
    </div>

    <style>
      .container {
        padding: 20px;
        text-align: center;
      }
      .loading {
        padding: 20px;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        margin: 20px auto;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .loading-text {
        color: #666;
        margin-top: 10px;
      }
      .error {
        color: red;
        margin: 20px 0;
      }
      .retry-button {
        margin-top: 10px;
        padding: 8px 16px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .canvas-container {
        margin-top: 20px;
      }
      canvas {
        max-width: 100%;
        border: 1px solid #ddd;
      }
    </style>
  `,
  standalone: true,
  imports: [NgIf],
})
export class ImageAccessComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;
  examId: string | null = null;
  private currentSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private alignImagesService: AlignImagesService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.examId = params['examid'];
      if (this.examId) {
        console.log('Got exam ID:', this.examId);
        this.loadImage();
      }
    });
  }

  ngOnDestroy() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }
  }

  reloadImage() {
    if (this.examId) {
      this.loadImage();
    }
  }

  async loadImage() {
    try {
      this.loading = true;
      this.error = null;

      if (!this.examId) {
        throw new Error('No exam ID provided');
      }

      // Clean up previous subscription if any
      if (this.currentSubscription) {
        this.currentSubscription.unsubscribe();
      }

      const params: IImageCropFromZoneInput = {
        examId: +this.examId,
        factor: 1,
        align: false,
        template: false,
        indexDb: false,
        page: 1,
        z: {},
      };

      console.log('Dispatching request to worker...');

      // Set up new subscription with timeout
      this.currentSubscription = this.alignImagesService
        .imageCropFromZone(params)
        .pipe(timeout(30000)) // 30 second timeout
        .subscribe({
          next: async response => {
            console.log('Got worker response:', response);

            if (!response || !response.image) {
              throw new Error('Invalid response from worker');
            }

            await this.renderImage(response);
            this.loading = false;
          },
          error: err => {
            console.error('Worker error:', err);
            this.error = 'Failed to load image. Please try again.';
            this.loading = false;
          },
        });
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Failed to start image loading';
      this.loading = false;
    }
  }

  private async renderImage(response: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
        if (!canvas) {
          throw new Error('Canvas not found');
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Set canvas dimensions
        canvas.width = response.width;
        canvas.height = response.height;

        // Create and draw image data
        const imageData = new ImageData(new Uint8ClampedArray(response.image), response.width, response.height);

        ctx.putImageData(imageData, 0, 0);
        resolve();
      } catch (error) {
        console.error('Render error:', error);
        reject(error);
      }
    });
  }
}
