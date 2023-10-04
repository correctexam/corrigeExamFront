/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { CacheUploadService } from '../exam-detail/cacheUpload.service';
import { PreferenceService } from '../preference-page/preference.service';
import { EventEmitter } from '@angular/core';
import { ImageDB } from '../db/db';

@Component({
  selector: 'jhi-viewandreorderpages',
  templateUrl: './viewandreorderpages.component.html',
  styleUrls: ['./viewandreorderpages.component.scss'],
})
export class ViewandreorderpagesComponent implements OnInit, AfterViewInit {
  @Input()
  examId!: number;

  @Input()
  alignPage: boolean = false;

  clusters: Map<number, number[]> = new Map();
  canvass: Map<number, HTMLCanvasElement> = new Map();
  colonneStyle = 'col-2 md:col-2';
  nbreColumn = 2;

  @ViewChildren('nomImageVisible')
  canvassVisibles: QueryList<ElementRef> | undefined;

  @Output()
  setblocked: EventEmitter<boolean> = new EventEmitter<boolean>();

  message = '';
  scale = 1;
  factorScale = 1;
  windowWidth = 0;
  pageInScan = 0;
  templatePage = 0;
  nbreColumnOptions: any[] = [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '6', value: 6 },
    { name: '12', value: 12 },
  ];

  showProgressBar = true;

  constructor(
    public examService: ExamService,
    public http: HttpClient,
    public scanService: ScanService,
    public questionService: QuestionService,
    public zoneService: ZoneService,
    public sheetService: ExamSheetService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    public applicationConfigService: ApplicationConfigService,
    private cacheUploadService: CacheUploadService,
    private translateService: TranslateService,
    private preferenceService: PreferenceService,
    private db: CacheServiceImpl,
    private changeDetector: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.update();
  }

  async update() {
    if (this.alignPage) {
      const p = await this.db.countAlignImage(this.examId);
      this.pageInScan = p;
    } else {
      const p = await this.db.countNonAlignImage(this.examId);
      this.pageInScan = p;
    }
    const templatePage = await this.db.countPageTemplate(this.examId);
    this.templatePage = templatePage;
    if (this.pageInScan > 200) {
      this.preferenceService.saveImagePerLine(12);
      this.nbreColumnOptions = [
        { name: '6', value: 6 },
        { name: '12', value: 12 },
      ];
    }

    this.setblocked.emit(true);
    this.showProgressBar = true;
    const factorscale = this.preferenceService.getImagePerLine();

    this.windowWidth = window.innerWidth;
    this.updateColumn(factorscale);
  }

  async reloadImage(): Promise<void> {
    this.canvass.clear();
    this.clusters.clear();
    if (this.templatePage > 0 && this.pageInScan > 0) {
      let images: ImageDB[] = [];

      const step = 150;
      const quotien = Math.floor(this.pageInScan / step);
      const reste = this.pageInScan % step;
      let promises: Promise<number>[] = [];

      for (let i = 0; i < quotien; i++) {
        console.error('ask load');
        if (this.alignPage) {
          images = await this.db.getAlignImageBetweenAndSortByPageNumber(this.examId, i * step + 1, (i + 1) * step);
        } else {
          images = await this.db.getNonAlignImageBetweenAndSortByPageNumber(this.examId, i * step + 1, (i + 1) * step);
        }
        images.forEach((e, index) => {
          const image = JSON.parse(e.value, this.reviver);
          promises.push(this.loadImage(image.pages, e.pageNumber));
        });
        await Promise.all(promises);
        promises = [];
      }

      if (this.alignPage) {
        images = await this.db.getAlignImageBetweenAndSortByPageNumber(this.examId, quotien * step + 1, quotien * step + reste);
      } else {
        images = await this.db.getNonAlignImageBetweenAndSortByPageNumber(this.examId, quotien * step + 1, quotien * step + reste);
      }

      images.forEach((e, index) => {
        const image = JSON.parse(e.value, this.reviver);
        promises.push(this.loadImage(image.pages, e.pageNumber));
      });

      /* if (this.alignPage) {
        images = await this.db.getAlignImageBetweenAndSortByPageNumber(this.examId, 1, this.pageInScan);
      } else {
        images = await this.db.getNonAlignImageBetweenAndSortByPageNumber(this.examId, 1, this.pageInScan);
      }*/

      Promise.all(promises).then(e => {
        this.canvass.forEach((e1, k1) => {
          const div = Math.floor((k1 - 1) / this.templatePage) + 1;
          if (this.clusters.get(div) === undefined) {
            this.clusters.set(div, [k1]);
          } else {
            this.clusters.get(div)?.push(k1);
          }
        });
      });
    }
  }

  ngAfterViewInit(): void {
    this.canvassVisibles?.changes.subscribe(() => {
      this.reloadImageClassify();
      this.changeDetector.detectChanges();
    });
  }

  async loadImage(file: any, page1: number): Promise<number> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        if (this.windowWidth < 991) {
          this.factorScale = 0.95;
        }
        this.scale = (window.innerWidth * this.factorScale) / i.width;

        const editedImage: HTMLCanvasElement = document.createElement('canvas');
        editedImage.width = i.width * this.scale;
        editedImage.height = i.height * this.scale;
        const ctx = editedImage.getContext('2d');

        const editedImage1: HTMLCanvasElement = document.createElement('canvas');
        editedImage1.width = i.width;
        editedImage1.height = i.height;
        const ctx2 = editedImage1.getContext('2d');
        ctx2!.drawImage(i, 0, 0);
        ctx!.scale(this.scale, this.scale);
        ctx!.drawImage(editedImage1, 0, 0);
        this.canvass.set(page1, editedImage);
        resolve(page1);
      };
      i.src = file;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const old = this.windowWidth;
    this.windowWidth = event.target.innerWidth;
    if (old / event.target.innerWidth > 1.15 || old / event.target.innerWidth < 0.85) {
      this.reloadImage();
    }
  }

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  reloadImageClassify() {
    if (this.canvassVisibles !== undefined && this.canvassVisibles.length > 0) {
      this.canvassVisibles.forEach(e => {
        if (this.canvass.get(+e.nativeElement.id) !== undefined) {
          e.nativeElement.width = this.canvass.get(+e.nativeElement.id)!.width;
          e.nativeElement.height = this.canvass.get(+e.nativeElement.id)!.height;
          const ctx1 = e.nativeElement.getContext('2d');
          ctx1.drawImage(this.canvass.get(+e.nativeElement.id), 0, 0);
        } else {
          e.nativeElement.width = 0;
          e.nativeElement.height = 0;
        }
      });
      this.setblocked.emit(false);
      this.showProgressBar = false;
    }
  }

  async updateColumn(nbreColumn: number) {
    this.nbreColumn = nbreColumn;
    if (this.nbreColumn === 1) {
      this.colonneStyle = 'col-12 md:col-12';
      this.factorScale = 1;
    } else if (this.nbreColumn === 2) {
      this.colonneStyle = 'col-12 md:col-6';
      this.factorScale = 1 / 2;
    } else if (this.nbreColumn === 3) {
      this.colonneStyle = 'col-12 md:col-4';
      this.factorScale = 0.95 / 3;
    } else if (this.nbreColumn === 4) {
      this.colonneStyle = 'col-12 md:col-3';
      this.factorScale = 0.95 / 4;
    } else if (this.nbreColumn === 6) {
      this.colonneStyle = 'col-12 md:col-2';
      this.factorScale = 0.95 / 6;
    } else if (this.nbreColumn === 12) {
      this.colonneStyle = 'col-12 md:col-1';
      this.factorScale = 0.95 / 12;
    }
    await this.reloadImage();
  }

  updateColumnEvent(event: any) {
    this.showProgressBar = true;
    this.updateColumn(event.value);
    this.preferenceService.saveImagePerLine(event.value);
  }

  currentDragAndDrop = 0;
  dragStart(value: any): void {
    this.currentDragAndDrop = value;
  }

  dragEnd(): void {
    this.currentDragAndDrop = -1;
  }

  dropVoid(value: any) {}

  async drop(value: any) {
    const currentDragAndDrop = this.currentDragAndDrop;
    const canvas = this.canvass.get(currentDragAndDrop);
    this.canvass.delete(currentDragAndDrop);

    if (currentDragAndDrop < value) {
      for (let i = currentDragAndDrop + 1; i <= value; i++) {
        const canvas1 = this.canvass.get(i);
        this.canvass.delete(i);
        this.canvass.set(i - 1, canvas1!);
      }
    } else if (currentDragAndDrop > value) {
      for (let i = currentDragAndDrop - 1; i >= value; i--) {
        const canvas1 = this.canvass.get(i);
        this.canvass.delete(i);
        this.canvass.set(i + 1, canvas1!);
      }
    }
    this.canvass.set(value, canvas!);

    this.reloadImageClassify();
    if (this.alignPage) {
      await this.db.moveAlignPages(this.examId, currentDragAndDrop, value);
    } else {
      await this.db.moveNonAlignPages(this.examId, currentDragAndDrop, value);
    }
  }

  async deleteImage(pageNumber: number) {
    const lastPage = Math.max(...this.canvass.keys());
    this.canvass.delete(pageNumber);

    for (let i = pageNumber + 1; i <= lastPage; i++) {
      const canvas1 = this.canvass.get(i);
      if (canvas1 !== undefined) {
        this.canvass.delete(i);
        this.canvass.set(i - 1, canvas1);
      }
    }

    this.reloadImageClassify();
    if (this.alignPage) {
      await this.db.moveAlignPages(this.examId, pageNumber, lastPage);
      await this.db.removePageAlignForExamForPages(this.examId, lastPage, lastPage);
    } else {
      await this.db.moveNonAlignPages(this.examId, pageNumber, lastPage);
      await this.db.removePageNonAlignForExamForPages(this.examId, lastPage, lastPage);
    }
  }

  async _rotateImage(file: any, page1: number): Promise<number> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = i.width;
        canvas.height = i.height;
        const context = canvas.getContext('2d');

        context!.translate(canvas.width / 2, canvas.height / 2);

        // rotate context by 45 degrees counter clockwise
        context!.rotate(Math.PI);
        context!.drawImage(i, (-1 * i.width) / 2, (-1 * i.height) / 2);

        let exportImageType = 'image/webp';
        if (
          this.preferenceService.getPreference().imageTypeExport !== undefined &&
          ['image/webp', 'image/png', 'image/jpg'].includes(this.preferenceService.getPreference().imageTypeExport)
        ) {
          exportImageType = this.preferenceService.getPreference().imageTypeExport;
        }

        const webPImageURL = canvas.toDataURL(exportImageType, 1);
        if (this.alignPage) {
          this.db.removePageAlignForExamForPages(this.examId, page1, page1).then(() => {
            this.db
              .addAligneImage({
                examId: this.examId,
                pageNumber: page1,
                value: JSON.stringify(
                  {
                    pages: webPImageURL,
                  },
                  this.replacer,
                ),
              })
              .then(() => resolve(page1));
          });
        } else {
          this.db.removePageNonAlignForExamForPages(this.examId, page1, page1).then(() => {
            this.db
              .addNonAligneImage({
                examId: this.examId,
                pageNumber: page1,
                value: JSON.stringify(
                  {
                    pages: webPImageURL,
                  },
                  this.replacer,
                ),
              })
              .then(() => resolve(page1));
          });
        }
      };
      i.src = file;
    });
  }

  async rotateImage(pageNumber: number) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = this.canvass.get(pageNumber)!.width;
    canvas.height = this.canvass.get(pageNumber)!.height;
    const context = canvas.getContext('2d');
    context!.translate(canvas.width / 2, canvas.height / 2);
    context!.rotate(Math.PI);
    context!.drawImage(
      this.canvass.get(pageNumber)!,
      (-1 * this.canvass.get(pageNumber)!.width) / 2,
      (-1 * this.canvass.get(pageNumber)!.height) / 2,
    );
    this.canvass.set(pageNumber, canvas);

    // updateCache
    let images: ImageDB[] = [];
    if (this.alignPage) {
      images = await this.db.getAlignImageBetweenAndSortByPageNumber(this.examId, pageNumber, pageNumber);
    } else {
      images = await this.db.getNonAlignImageBetweenAndSortByPageNumber(this.examId, pageNumber, pageNumber);
    }

    const promises: Promise<number>[] = [];
    images.forEach((e, index) => {
      const image = JSON.parse(e.value, this.reviver);
      promises.push(this._rotateImage(image.pages, e.pageNumber));
    });
    await Promise.all(promises);
    this.reloadImageClassify();
  }

  replacer(key: any, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()),
      };
    } else {
      return value;
    }
  }
}
