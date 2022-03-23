/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ZoneService } from '../../entities/zone/service/zone.service';
import { ScanService } from '../../entities/scan/service/scan.service';
import { CourseService } from 'app/entities/course/service/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { ICourse } from 'app/entities/course/course.model';
import { IScan } from '../../entities/scan/scan.model';
import { IZone } from 'app/entities/zone/zone.model';
import { ScrollModeType, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { AlignImagesService } from '../services/align-images.service';

@Component({
  selector: 'jhi-associer-copies-etudiants',
  templateUrl: './associer-copies-etudiants.component.html',
  styleUrls: ['./associer-copies-etudiants.component.scss'],
  providers: [ConfirmationService],
})
export class AssocierCopiesEtudiantsComponent implements OnInit {
  examId = '';
  exam!: IExam;
  course!: ICourse;
  scan!: IScan;
  zonenom!: IZone;
  zoneprenom!: IZone;
  zoneine!: IZone;
  nbreFeuilleParCopie = 6;
  nomDataURL: any;
  prenomDataURL: any;
  ineDataURL: any;
  public scrollMode: ScrollModeType = ScrollModeType.vertical;
  widthnom = 0;
  heightnom = 0;
  widthprenom = 0;
  heightprenom = 0;
  widthine = 0;
  heightine = 0;
  cvState!: string;
  private editedImage: HTMLCanvasElement | undefined;

  @ViewChild('outputImage')
  public outputCanvas: ElementRef | undefined;

  constructor(
    private pdfService: NgxExtendedPdfViewerService,
    public examService: ExamService,
    public zoneService: ZoneService,
    public scanService: ScanService,
    public courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private alignImagesService: AlignImagesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        this.examService.find(+this.examId).subscribe(data => {
          this.exam = data.body!;
          this.courseService.find(this.exam.courseId!).subscribe(e => (this.course = e.body!));
          if (this.exam.namezoneId) {
            this.zoneService.find(this.exam.namezoneId).subscribe(e => (this.zonenom = e.body!));
          }
          if (this.exam.firstnamezoneId) {
            this.zoneService.find(this.exam.firstnamezoneId).subscribe(e => (this.zoneprenom = e.body!));
          }
          if (this.exam.idzoneId) {
            this.zoneService.find(this.exam.idzoneId).subscribe(e => (this.zoneine = e.body!));
          }
          if (this.exam.scanfileId) {
            this.scanService.find(this.exam.scanfileId).subscribe(e => (this.scan = e.body!));
          }
        });
      }
    });
  }

  public exportAsImage(): void {
    const scale = { scale: 2 };
    this.pdfService.getPageAsImage(this.zonenom.page!, scale).then(dataURL => {
      this.getImageDimensions(dataURL, true, (x: number, y: number) => {
        this.widthnom = x;
        this.heightnom = y;
        this.nomDataURL = dataURL;

        //        const img = cv.imread(this.editedImage);
        // cv.imshow(this.outputCanvas?.nativeElement, img);
        //        let dst = new cv.Mat();
        //        cv.cvtColor(img, dst, cv.COLOR_RGBA2GRAY);
        //        cv.imshow(this.outputCanvas?.nativeElement, dst);
        //        img.delete();
        //        dst.delete();
      });
    });
    this.pdfService.getPageAsImage(this.zoneprenom.page!, scale).then(dataURL => {
      this.getImageDimensions(dataURL, false, (x: number, y: number) => {
        this.widthprenom = x;
        this.heightprenom = y;
        this.prenomDataURL = dataURL;
      });
    });
    if (this.zoneine !== undefined) {
      this.pdfService.getPageAsImage(this.zoneine.page!, scale).then(dataURL => {
        this.getImageDimensions(dataURL, false, (x: number, y: number) => {
          this.widthine = x;
          this.heightine = y;
          this.ineDataURL = dataURL;
        });
      });
    }
  }

  getImageDimensions(file: any, create: boolean, cb: (w: number, h: number) => void): void {
    const i = new Image();
    i.onload = () => {
      //      this.canvasEl = this.canvas!.nativeElement;
      //      this.ctx = this.canvas?.nativeElement.getContext('2d');
      //      this.canvasEl.width = i.width;
      //      this.canvasEl.height = i.height;
      //      this.ctx!.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      //      this.ctx!.drawImage(i, 0, 0, i.width, i.height);
      if (create) {
        console.log('passe par là');
        this.editedImage = <HTMLCanvasElement>document.createElement('canvas');
        this.editedImage.width = i.width;
        this.editedImage.height = i.height;
        const ctx = this.editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const image = ctx!.getImageData(0, 0, i.width, i.height);
        this.alignImagesService.imageProcessing(image).subscribe(e => {
          const ctx1 = this.outputCanvas?.nativeElement.getContext('2d');
          ctx1.putImageData(e, 0, 0);
        });
        this.outputCanvas!.nativeElement.width = i.width;
        this.outputCanvas!.nativeElement.height = i.height;
      }
      cb(i.width, i.height);
    };
    i.src = file;
  }
}
