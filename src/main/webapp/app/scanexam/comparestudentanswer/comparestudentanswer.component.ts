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
import { ICluster, IImageCluster, ImageZone, IPage } from '../associer-copies-etudiants/associer-copies-etudiants.component';
import { EventCanevascorrectionHandlerService } from '../corrigequestion/event-canevascorrection-handler.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { PreferenceService } from '../preference-page/preference.service';
import { AlignImagesService } from '../services/align-images.service';
import { IComments } from '../../entities/comments/comments.model';
import { HttpClient } from '@angular/common/http';
import { KeyValue, Location } from '@angular/common';
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

export interface ClusterDTO {
  templat: number;
  copies: number[];
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

  @ViewChildren('nomImageVisible')
  canvassVisibles!: QueryList<ElementRef>;

  showImage: boolean[] = [];
  showImageVisible: boolean[] = [];
  examId: string | undefined;
  qId: string | undefined;
  numberPagesInScan: number | undefined;

  blocked = false;

  zones4comments?: Zone4SameCommentOrSameGrade;
  noalign = false;
  factor = 1;
  scale = 1;
  windowWidth = 0;

  pageOffset = 0;

  colonneStyle = 'col-12 md:col-6';

  questionall = false;

  clusters: Map<number, number[]> = new Map([[0, []]]);
  //  imageInCluster: number[] = [];
  layoutsidebarVisible = false;
  nbreCluster = 5;

  currentDragAndDrop = -1;

  firstImageLoadedReolve: ((value: void | PromiseLike<void>) => void) | undefined;
  firstImageLoaded: Promise<void>;

  nbreColumn = 2;

  factorScale = 0.5;

  nbreColumnOptions: any[] = [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '6', value: 6 },
    { name: '12', value: 12 },
  ];

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
  ) {
    this.firstImageLoaded = new Promise(resolve => {
      this.firstImageLoadedReolve = resolve;
    });
  }

  ngOnInit(): void {
    const factorscale = this.preferenceService.getImagePerLine();
    this.updateColumn(factorscale);
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
              this.zones4comments.answers!.forEach((_, index) => {
                this.clusters.get(0)?.push(index);
              });
            });
        } else if (params.get('commentid') !== null && this.router.url.includes('comparegradedcomment')) {
          this.http
            .get<Zone4SameCommentOrSameGrade>(
              this.applicationConfigService.getEndpointFor('api/getZone4GradedComment/' + this.examId + '/' + params.get('commentid'))
            )
            .subscribe(res => {
              this.zones4comments = res;
              this.zones4comments.answers!.forEach((_, index) => {
                this.clusters.get(0)?.push(index);
              });

              // console.error(this.zones4comments)
            });
        } else if (params.get('respid') !== null && this.router.url.includes('comparemark')) {
          this.http
            .get<Zone4SameCommentOrSameGrade>(
              this.applicationConfigService.getEndpointFor('api/getZone4Mark/' + this.examId + '/' + params.get('respid'))
            )
            .subscribe(res => {
              this.zones4comments = res;
              this.zones4comments.answers!.forEach((_, index) => {
                this.clusters.get(0)?.push(index);
              });
            });
        } else if (params.get('qid') !== null && this.router.url.includes('compareanswer')) {
          this.qId = params.get('qid')!;
          this.questionall = true;
          this.http
            .get<Zone4SameCommentOrSameGrade>(
              this.applicationConfigService.getEndpointFor('api/getZone4Numero/' + this.examId + '/' + params.get('qid'))
            )
            .subscribe(res => {
              this.zones4comments = res;
              const _cluster = this.preferenceService.getCluster4Question(this.examId + '_' + this.qId);
              if (_cluster === null) {
                this.zones4comments.answers!.forEach((_, index) => {
                  this.clusters.get(0)?.push(index);
                });
              } else {
                this.clusters = _cluster;
              }
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
    this.canvassVisibles.changes.subscribe(() => {
      this.reloadImageClassify();
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

  async reloadImage() {
    if (this.zones4comments !== undefined) {
      this.blocked = true;

      for (const [i, a] of this.zones4comments!.answers!.entries()) {
        for (const [j, z] of this.zones4comments!.zones!.entries()) {
          const pagewithoffset = a.pagemin + this.zones4comments.zones[j].pageNumber! + this.pageOffset;
          const pagewithoutoffset = a.pagemin + this.zones4comments.zones[j].pageNumber!;
          let page = pagewithoutoffset;
          if (pagewithoffset > 0 && pagewithoffset <= this.numberPagesInScan!) {
            page = pagewithoffset;
          }

          this.showImage[i * this.zones4comments!.zones.length + j] = false;
          const p = await this.getAllImage4Zone(page, z);
          this.displayImage(p, this.canvass.get(i * this.zones4comments!.zones.length + j), b => {
            this.showImage[i * this.zones4comments!.zones.length + j] = b;
          });
        }
      }
      this.blocked = false;
      this.firstImageLoadedReolve!();
    }
  }

  reloadImageClassify() {
    this.firstImageLoaded.then(() => {
      const nbreZones = this.zones4comments!.zones!.length;
      let k = 0;
      this.clusters.forEach(value => {
        value.forEach(v => {
          for (let j = 0; j < nbreZones; j++) {
            const newCanvas = this.canvassVisibles.get(k)!.nativeElement;
            const oldCanvas = this.canvass.get(v * nbreZones + j)!.nativeElement;
            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;
            const context = newCanvas.getContext('2d');
            context.drawImage(oldCanvas, 0, 0);
            k = k + 1;
          }
        });
      });
      this.blocked = false;
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
                image: v.image!.data.buffer,
                imageWidth: v.image!.width,
                imageHeight: v.image!.height,
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
                image: v.image!.data.buffer,
                imageWidth: v.image!.width,
                imageHeight: v.image!.height,

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
        if (this.windowWidth < 991) {
          this.factorScale = 0.95;
        }
        this.scale = (window.innerWidth * this.factorScale) / i.width;
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

  debugImage(imageData: any) {
    try {
      const c = new OffscreenCanvas(imageData.width, imageData.height);
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.putImageData(imageData, 0, 0);
        c.convertToBlob().then(blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function () {
            const dataUrl = reader.result;
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const style = `font-size: 300px; background-image: url("${dataUrl}"); background-size: contain; background-repeat: no-repeat;`;
            console.log('%c     ', style);
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  classifyAll(): void {
    this.blocked = true;

    const inputImages: IImageCluster[] = [];
    if (this.zones4comments!.answers!.length <= this.nbreCluster) {
      this.nbreCluster = this.zones4comments!.answers!.length - 1;
    }
    this.zones4comments?.answers!.forEach((_a, i) => {
      this.zones4comments?.zones.forEach((_z, j) => {
        const c = this.canvass.get(i * this.zones4comments!.zones.length + j)!.nativeElement;
        const ctx = c.getContext('2d');
        const inputimage = ctx!.getImageData(0, 0, c.width, c.height);
        // console.error(inputimage)
        // this.debugImage(inputimage);
        const p: IImageCluster = {
          image: inputimage.data.buffer,
          imageIndex: j,
          studentIndex: i,
          width: c.width,
          height: c.height,
        };
        inputImages.push(p);
      });
    });
    const icluster: ICluster = {
      images: inputImages,
      nbrCluster: this.nbreCluster,
    };
    this.alignImagesService.groupImagePerContoursLength(icluster).subscribe(res => {
      const _cluster = new Map<number, number[]>();
      for (let c1 = 0; c1 < this.nbreCluster; c1++) {
        _cluster.set(c1, []);
      }
      this.clusters = _cluster;
      res.forEach((t, index) => {
        this.clusters.get(t)?.push(index);
      });

      this.preferenceService.saveCluster4Question(this.examId + '_' + this.qId, this.clusters);
      //      this.imageInCluster = res;

      this.reloadImageClassify();
    });
  }

  unclassifyAll(): void {
    this.blocked = true;

    const _cluster: Map<number, number[]> = new Map([[0, []]]);
    this.zones4comments!.answers!.forEach((_, index) => {
      _cluster.get(0)?.push(index);
    });
    this.preferenceService.saveCluster4Question(this.examId + '_' + this.qId, _cluster);
    this.clusters = _cluster;
    //      this.imageInCluster = res;

    this.reloadImageClassify();
  }

  downloadAll(): void {
    const zip = new jszip();
    const img = zip.folder('images');

    this.zones4comments?.answers!.forEach((_a, i) => {
      this.zones4comments?.zones.forEach((_z, j) => {
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
        let extension = '.webp';
        if (exportImageType === 'image/png') {
          extension = '.png';
        } else if (exportImageType === 'image/jpg') {
          extension = '.jpg';
        }

        const webPImageURL = this.canvass
          .get(i * this.zones4comments!.zones.length + j)!
          .nativeElement.toDataURL(exportImageType, compression);
        img!.file(i + '_' + (j + 1) + extension, webPImageURL.replace(/^data:image\/?[A-z]*;base64,/, ''), { base64: true });
      });
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
      FileSaver.saveAs(content, 'Exam' + this.examId + '.zip');
    });
  }

  dragStart(value: any): void {
    this.currentDragAndDrop = value;
  }

  dragEnd(): void {
    this.currentDragAndDrop = -1;
  }

  drop(value: any) {
    const currentDragAndDrop = this.currentDragAndDrop;
    let clustersource = -1;
    let clusterdest = -1;

    for (const v of this.clusters) {
      if (v[1].includes(currentDragAndDrop) && !v[1].includes(value)) {
        clustersource = v[0];
      } else if (!v[1].includes(currentDragAndDrop) && v[1].includes(value)) {
        clusterdest = v[0];
      } else if (v[1].includes(currentDragAndDrop) && v[1].includes(value)) {
        clustersource = v[0];
        clusterdest = v[0];
      }
    }
    if (clustersource !== -1 && clusterdest !== -1 && clustersource !== clusterdest) {
      const index = this.clusters.get(clustersource)!.indexOf(currentDragAndDrop);
      this.clusters.get(clustersource)!.splice(index, 1);
      const index1 = this.clusters.get(clusterdest)!.indexOf(value);
      this.clusters.get(clusterdest)!.splice(index1, 0, currentDragAndDrop);
      this.preferenceService.saveCluster4Question(this.examId + '_' + this.qId, this.clusters);
    } else if (clustersource !== -1 && clusterdest !== -1 && clustersource === clusterdest) {
      const index = this.clusters.get(clustersource)!.indexOf(currentDragAndDrop);
      this.clusters.get(clustersource)!.splice(index, 1);
      const index1 = this.clusters.get(clusterdest)!.indexOf(value);
      this.clusters.get(clusterdest)!.splice(index1, 0, currentDragAndDrop);
      this.preferenceService.saveCluster4Question(this.examId + '_' + this.qId, this.clusters);
    }
  }

  applySameGradeAndComment4Cluster(k: KeyValue<number, number[]>): void {
    const l = [...k.value];
    const templat = l.shift();
    const clus = {
      templat: templat,
      copies: l,
    };
    this.http
      .post<Zone4SameCommentOrSameGrade>(
        this.applicationConfigService.getEndpointFor('api/updateStudentResponse4Cluster/' + this.examId + '/' + this.qId),
        clus
      )

      .subscribe(() => {
        this.http
          .get<Zone4SameCommentOrSameGrade>(
            this.applicationConfigService.getEndpointFor('api/getZone4Numero/' + this.examId + '/' + this.qId)
          )
          .subscribe(res => {
            this.zones4comments!.textComments = res.textComments;
            this.zones4comments!.gradedComments = res.gradedComments;
            for (const v of l) {
              this.zones4comments!.answers[v].note = res.answers[v].note;
              this.zones4comments!.answers[v].textComments = res.answers[v].textComments;
              this.zones4comments!.answers[v].gradedComments = res.answers[v].gradedComments;
            }
          });
      });
  }
  async updateColumnEvent(event: any) {
    await this.updateColumn(event.value.value);
    this.preferenceService.saveImagePerLine(event.value.value);
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
    this.reloadImageClassify();
    this.layoutsidebarVisible = false;
  }
}
