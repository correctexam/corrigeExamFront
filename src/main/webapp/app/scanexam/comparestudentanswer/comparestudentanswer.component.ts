/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CourseService } from 'app/entities/course/service/course.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { GradedCommentService } from 'app/entities/graded-comment/service/graded-comment.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { TextCommentService } from 'app/entities/text-comment/service/text-comment.service';
import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { IZone } from 'app/entities/zone/zone.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImageZone, IPage } from '../associer-copies-etudiants/associer-copies-etudiants.component';
import { EventCanevascorrectionHandlerService } from '../corrigequestion/event-canevascorrection-handler.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { PreferenceService } from '../preference-page/preference.service';
import { AlignImagesService } from '../services/align-images.service';
import { IComments } from '../../entities/comments/comments.model';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import jszip from 'jszip';
import * as FileSaver from 'file-saver';

export interface Zone4SameCommentOrSameGrade {
  answers: Answer[];
  gradeType: string;
  gradedComments: IGradedComment[];
  numero: number;
  point: number;
  step: number;
  algoName: string;
  textComments: ITextComment[];
  zones: IZone[];
}

export interface Answer {
  comments: IComments[];
  gradedComments: number[];
  note: number;
  pagemin: number;
  pagemax: number;
  star: boolean;
  studentName: string;
  textComments: number[];
  worststar: boolean;
}

@Component({
  selector: 'jhi-comparestudentanswer',
  templateUrl: './comparestudentanswer.component.html',
  styleUrls: ['./comparestudentanswer.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ComparestudentanswerComponent implements OnInit, AfterViewInit {
  goBack() {
    this.location.back();
  }
  goToCopie(pageMin: number, pageMax: number) {
    if (this.zones4comments !== undefined && this.zones4comments.numero > 0 && Number.isInteger(pageMin / (pageMax + 1 - pageMin) + 1)) {
      this.zone.run(() => {
        this.router.navigate([
          '/answer/' + this.examId + '/' + this.zones4comments!.numero + '/' + (pageMin / (pageMax + 1 - pageMin) + 1),
        ]);
      });
    }
  }
  debug = false;

  @ViewChildren('nomImage')
  canvass!: QueryList<ElementRef>;
  showImage: boolean[] = [];
  examId: string | undefined;
  numberPagesInScan: number | undefined;

  blocked = true;

  zones4comments?: Zone4SameCommentOrSameGrade;
  noalign = false;
  factor = 1;
  scale = 1;
  windowWidth = 0;

  foo: string | undefined;

  pageOffset = 0;
  constructor(
    public examService: ExamService,
    public zoneService: ZoneService,
    public courseService: CourseService,
    public studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private alignImagesService: AlignImagesService,
    public messageService: MessageService,
    public sheetService: ExamSheetService,
    public questionService: QuestionService,
    public gradedCommentService: GradedCommentService,
    public textCommentService: TextCommentService,
    public studentResponseService: StudentResponseService,
    private changeDetector: ChangeDetectorRef,
    private eventHandler: EventCanevascorrectionHandlerService,
    private translateService: TranslateService,
    private preferenceService: PreferenceService,
    private db: CacheServiceImpl,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private location: Location,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.activatedRoute.paramMap.subscribe(params => {
      this.blocked = true;
      //      'answer/:examid/:questionno/:studentid',
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;

        this.pageOffset = 0;
        if (params.get('commentid') !== null && this.router.url.includes('comparetextcomment')) {
          this.http
            .get<Zone4SameCommentOrSameGrade>(
              this.applicationConfigService.getEndpointFor('api/getZone4TextComment/' + this.examId + '/' + params.get('commentid'))
            )
            .subscribe(res => {
              this.zones4comments = res;
            });
        } else if (params.get('commentid') !== null && this.router.url.includes('comparegradedcomment')) {
          this.http
            .get<Zone4SameCommentOrSameGrade>(
              this.applicationConfigService.getEndpointFor('api/getZone4GradedComment/' + this.examId + '/' + params.get('commentid'))
            )
            .subscribe(res => {
              this.zones4comments = res;
              // console.error(this.zones4comments)
            });
        } else if (params.get('respid') !== null && this.router.url.includes('comparemark')) {
          this.http
            .get<Zone4SameCommentOrSameGrade>(
              this.applicationConfigService.getEndpointFor('api/getZone4Mark/' + this.examId + '/' + params.get('respid'))
            )
            .subscribe(res => {
              this.zones4comments = res;
            });
        } else if (params.get('qid') !== null && this.router.url.includes('compareanswer')) {
          this.http
            .get<Zone4SameCommentOrSameGrade>(
              this.applicationConfigService.getEndpointFor('api/getZone4Numero/' + this.examId + '/' + params.get('qid'))
            )
            .subscribe(res => {
              this.zones4comments = res;
              // console.error(this.zones4comments)
            });
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.canvass.changes.subscribe(() => {
      this.reloadImage();
      this.changeDetector.detectChanges();
    });
  }

  reloadImageGrowFactor(event: any): void {
    if (event.value !== this.factor) {
      this.factor = event.value;
      this.reloadImage();
    }
  }

  reloadImageOffset(event: any): void {
    if (event.value !== this.pageOffset) {
      this.pageOffset = event.value;
      this.reloadImage();
    }
  }

  reloadImage() {
    this.zones4comments?.answers!.forEach((a, i) => {
      this.zones4comments?.zones.forEach((z, j) => {
        const pagewithoffset = a.pagemin + this.zones4comments?.zones[j].pageNumber! + this.pageOffset;
        const pagewithoutoffset = a.pagemin + this.zones4comments?.zones[j].pageNumber!;
        let page = pagewithoutoffset;
        if (pagewithoffset > 0 && pagewithoffset <= this.numberPagesInScan!) {
          page = pagewithoffset;
        }

        this.showImage[i * this.zones4comments!.zones.length + j] = false;
        this.getAllImage4Zone(page, z).then(p => {
          this.displayImage(p, this.canvass.get(i * this.zones4comments!.zones.length + j), b => {
            this.showImage[i * this.zones4comments!.zones.length + j] = b;
          });
        });
      });
    });
  }

  displayImage(v: ImageZone, imageRef: ElementRef<any> | undefined, show: (s: boolean) => void): void {
    if (imageRef !== undefined) {
      imageRef!.nativeElement.width = v.w * this.scale;
      imageRef!.nativeElement.height = v.h * this.scale;

      const ctx1 = imageRef!.nativeElement.getContext('2d');
      const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
      editedImage.width = v.w;
      editedImage.height = v.h;
      const ctx2 = editedImage.getContext('2d');
      ctx2!.putImageData(v.i, 0, 0);
      ctx1!.scale(this.scale, this.scale);
      ctx1!.drawImage(editedImage, 0, 0);
      show(true);
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
  async getAllImage4Zone(pageInscan: number, zone: IZone): Promise<ImageZone> {
    if (this.noalign) {
      return new Promise(resolve => {
        this.db.getFirstNonAlignImage(+this.examId!, pageInscan).then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);
          this.loadImage(image.pages, pageInscan).then(v => {
            let finalW = (zone.width! * v.width! * this.factor) / 100000;
            let finalH = (zone.height! * v.height! * this.factor) / 100000;
            let initX =
              (zone.xInit! * v.width!) / 100000 - ((zone.width! * v.width! * this.factor) / 100000 - (zone.width! * v.width!) / 100000) / 2;
            if (initX < 0) {
              finalW = finalW + initX;
              initX = 0;
            }
            let initY =
              (zone.yInit! * v.height!) / 100000 -
              ((zone.height! * v.height! * this.factor) / 100000 - (zone.height! * v.height!) / 100000) / 2;
            if (initY < 0) {
              finalH = finalH + initY;
              initY = 0;
            }
            this.alignImagesService
              .imageCrop({
                image: v.image,
                x: initX,
                y: initY,
                width: finalW,
                height: finalH,
              })
              .subscribe(res => resolve({ i: res, w: finalW, h: finalH }));
          });
        });
      });
    } else {
      return new Promise(resolve => {
        this.db.getFirstAlignImage(+this.examId!, pageInscan).then(e2 => {
          const image = JSON.parse(e2!.value, this.reviver);

          this.loadImage(image.pages, pageInscan).then(v => {
            let finalW = (zone.width! * v.width! * this.factor) / 100000;
            let finalH = (zone.height! * v.height! * this.factor) / 100000;
            let initX =
              (zone.xInit! * v.width!) / 100000 - ((zone.width! * v.width! * this.factor) / 100000 - (zone.width! * v.width!) / 100000) / 2;
            if (initX < 0) {
              finalW = finalW + initX;
              initX = 0;
            }
            let initY =
              (zone.yInit! * v.height!) / 100000 -
              ((zone.height! * v.height! * this.factor) / 100000 - (zone.height! * v.height!) / 100000) / 2;
            if (initY < 0) {
              finalH = finalH + initY;
              initY = 0;
            }
            this.alignImagesService
              .imageCrop({
                image: v.image,
                x: initX,
                y: initY,
                width: finalW,
                height: finalH,
              })
              .subscribe(res => resolve({ i: res, w: finalW, h: finalH }));
          });
        });
      });
    }
  }

  async loadImage(file: any, page1: number): Promise<IPage> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        let factorScale = 0.5;
        if (this.windowWidth < 991) {
          factorScale = 0.95;
        }
        this.scale = (window.innerWidth * factorScale) / i.width;
        this.eventHandler.scale = this.scale;
        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const inputimage = ctx!.getImageData(0, 0, i.width, i.height);
        resolve({ image: inputimage, page: page1, width: i.width, height: i.height });
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

  getTextComments(a: Answer): ITextComment[] {
    //    a.textComments.forEach(tid -> this.zone)
    if (this.zones4comments !== undefined) {
      return this.zones4comments!.textComments.filter(t => a.textComments.includes(t.id!));
    } else {
      return [];
    }
  }

  getGradedComments(a: Answer): IGradedComment[] {
    //    a.textComments.forEach(tid -> this.zone)
    if (this.zones4comments !== undefined) {
      return this.zones4comments!.gradedComments.filter(t => a.gradedComments.includes(t.id!));
    } else {
      return [];
    }
  }

  pointisNan(k: Answer, zones4comments: Zone4SameCommentOrSameGrade | undefined): boolean {
    if (zones4comments !== undefined && zones4comments.step > 0) {
      return Number.isNaN(k.note / zones4comments.step) || Number.isNaN(zones4comments.point);
    } else if (zones4comments !== undefined && zones4comments.step <= 0) {
      return Number.isNaN(k.note / zones4comments.point);
    } else {
      return true;
    }
  }

  downloadAll(): void {
    const zip = new jszip();
    const img = zip.folder('images');

    this.zones4comments?.answers!.forEach((a, i) => {
      this.zones4comments?.zones.forEach((z, j) => {
        let exportImageType = 'image/webp';
        let compression = 0.65;
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          this.preferenceService.getPreference().exportImageCompression !== undefined &&
          this.preferenceService.getPreference().exportImageCompression > 0 &&
          this.preferenceService.getPreference().exportImageCompression <= 1
        ) {
          compression = this.preferenceService.getPreference().exportImageCompression;
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          this.preferenceService.getPreference().imageTypeExport !== undefined &&
          ['image/webp', 'image/png', 'image/jpg'].includes(this.preferenceService.getPreference().imageTypeExport)
        ) {
          exportImageType = this.preferenceService.getPreference().imageTypeExport;
        }

        const webPImageURL = this.canvass
          .get(i * this.zones4comments!.zones.length + j)!
          .nativeElement.toDataURL(exportImageType, compression);
        img!.file(
          i * this.zones4comments!.zones.length + '_' + (j + 1) + '.webp',
          webPImageURL.replace(/^data:image\/?[A-z]*;base64,/, ''),
          { base64: true }
        );
      });
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
      FileSaver.saveAs(content, 'Exam' + this.examId + '.zip');
    });
  }
}
