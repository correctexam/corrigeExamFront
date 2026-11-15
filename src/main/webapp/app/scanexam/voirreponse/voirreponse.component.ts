/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlignImagesService } from '../services/align-images.service';
import { ImageZone, IPage } from '../associer-copies-etudiants/associer-copies-etudiants.model';
import { IZone } from 'app/entities/zone/zone.model';
import { IQuestion } from '../../entities/question/question.model';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { firstValueFrom } from 'rxjs';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { StudentSheetSource, StudentSheetSourceFactory, decodePublicBestAnswer } from '../student-portal/student-sheet-source';
import { parseCachedPage, questionNumerosOf } from '../student-portal/student-sheet-view.util';

/**
 * A starred answer to a question, shown to a student as an example: only the zones of the question, read by index
 * through the sheet of the student (/reponse/{base64 of /uuid/numero/index} or /my/reponse/{sheetId}/{numero}/{index}).
 */
@Component({
  selector: 'jhi-voirreponse',
  templateUrl: './voirreponse.component.html',
  styleUrls: ['./voirreponse.component.scss'],
  providers: [ConfirmationService, MessageService],
  standalone: true,
  imports: [
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ToggleSwitchModule,
    FormsModule,
    SliderModule,
    MessageModule,
    TranslateDirective,
    TranslatePipe,
  ],
})
export class VoirReponseComponent implements OnInit, AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly alignImagesService = inject(AlignImagesService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly sources = inject(StudentSheetSourceFactory);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChildren('nomImage')
  canvass!: QueryList<ElementRef>;
  showImage: boolean[] = [];
  questions: IQuestion[] | undefined;
  blocked = true;
  noteSteps = 0;
  questionindex = 0;
  questionNumeros: Array<number> = [];
  noalign = false;
  factor = 1;
  scale = 1;
  windowWidth = 1;
  /** The answer could not be read (former link, unknown sheet or answer). */
  loadError = false;

  private source: StudentSheetSource | undefined;
  private numero = 0;
  private index = 0;

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.blocked = true;
      this.loadError = false;
      const target = this.target(params);
      if (target === undefined) {
        this.fail();
        return;
      }
      this.source = target.source;
      this.numero = target.numero;
      this.index = target.index;
      this.finalize();
    });
  }

  private target(params: ParamMap): { source: StudentSheetSource; numero: number; index: number } | undefined {
    const encoded = params.get('base64uuid');
    if (encoded !== null) {
      const decoded = decodePublicBestAnswer(encoded);
      return decoded ? { source: this.sources.byUuid(decoded.uuid), numero: decoded.numero, index: decoded.index } : undefined;
    }
    const source = this.sources.fromRoute(params);
    const numero = params.get('numero');
    const index = params.get('index');
    if (source === undefined || numero === null || index === null || !/^\d+$/.test(numero) || !/^\d+$/.test(index)) {
      return undefined;
    }
    return { source, numero: +numero, index: +index };
  }

  private fail(): void {
    this.loadError = true;
    this.questions = [];
    this.blocked = false;
  }

  /** The zones of the question come from the view of the sheet of the student (same exam as the answer). */
  async finalize() {
    let view;
    try {
      view = await firstValueFrom(this.source!.view());
    } catch {
      this.fail();
      return;
    }
    this.blocked = false;
    this.questionNumeros = questionNumerosOf(view.questions);
    this.questionindex = this.questionNumeros.indexOf(this.numero);
    this.questions = view.questions.filter(q => q.numero === this.numero);
    this.showImage = new Array<boolean>(this.questions.length);
    if (this.questions.length > 0) {
      this.noteSteps = this.questions[0].point! * this.questions[0].step!;
    } else {
      this.loadError = true;
    }
  }

  ngAfterViewInit(): void {
    this.canvass.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.reloadImage();
      this.changeDetector.detectChanges();
    });
  }

  reloadImage() {
    this.questions?.forEach((q, i) => {
      this.showImage[i] = false;
      this.loadZone(
        q.zoneDTO,
        b => {
          this.showImage[i] = b;
        },
        this.canvass.get(i),
      );
    });
  }

  async loadZone(zone: IZone | undefined, showImageRef: (s: boolean) => void, imageRef: ElementRef<any> | undefined): Promise<void> {
    if (zone?.pageNumber === undefined || zone.pageNumber === null) {
      return;
    }
    try {
      const body = await firstValueFrom(this.source!.bestAnswerPage(this.numero, this.index, zone.pageNumber, this.noalign));
      const image = await this.crop(parseCachedPage(body).pages, zone);
      this.displayImage(image, imageRef, showImageRef);
    } catch {
      this.loadError = true;
    }
  }

  displayImage(v: ImageZone, imageRef: ElementRef<any> | undefined, show: (s: boolean) => void): void {
    if (imageRef !== undefined) {
      imageRef.nativeElement.width = v.w * this.scale;
      imageRef.nativeElement.height = v.h * this.scale;
      const ctx1 = imageRef.nativeElement.getContext('2d');
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

  private async crop(dataUrl: string, zone: IZone): Promise<ImageZone> {
    const v = await this.loadImage(dataUrl, zone.pageNumber!);
    let finalW = (zone.width! * v.width! * this.factor) / 100000;
    let finalH = (zone.height! * v.height! * this.factor) / 100000;
    let initX =
      (zone.xInit! * v.width!) / 100000 - ((zone.width! * v.width! * this.factor) / 100000 - (zone.width! * v.width!) / 100000) / 2;
    if (initX < 0) {
      finalW = finalW + initX;
      initX = 0;
    }
    let initY =
      (zone.yInit! * v.height!) / 100000 - ((zone.height! * v.height! * this.factor) / 100000 - (zone.height! * v.height!) / 100000) / 2;
    if (initY < 0) {
      finalH = finalH + initY;
      initY = 0;
    }
    const res = await firstValueFrom(
      this.alignImagesService.imageCrop({
        image: v.image!.data.buffer,
        imageWidth: v.image!.width,
        imageHeight: v.image!.height,
        x: initX,
        y: initY,
        width: finalW,
        height: finalH,
      }),
    );
    return { i: new ImageData(new Uint8ClampedArray(res), finalW, finalH), w: finalW, h: finalH };
  }

  async loadImage(file: string, page1: number): Promise<IPage> {
    return new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => {
        const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        let factorScale = 0.75;
        if (this.windowWidth < 991) {
          factorScale = 0.95;
        }
        this.scale = (window.innerWidth * factorScale) / i.width;

        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const inputimage = ctx!.getImageData(0, 0, i.width, i.height);
        resolve({ image: inputimage, page: page1, width: i.width, height: i.height });
      };
      i.onerror = () => reject(new Error('Unreadable page'));
      i.src = file;
    });
  }

  changeAlign(): void {
    this.reloadImage();
  }
}
