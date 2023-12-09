/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { IScan } from 'app/entities/scan/scan.model';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { MessageService } from 'primeng/api';
import { CacheUploadService } from '../exam-detail/cacheUpload.service';
import { PreferenceService } from '../preference-page/preference.service';

import jsPDF from 'jspdf';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { QuestionService } from 'app/entities/question/service/question.service';

import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExportPDFDto, Questionspdf, Sheetspdf, StudentResponsepdf } from './exportpdf.model';
import { IComments } from 'app/entities/comments/comments.model';
import { SVG, Text, G } from '@svgdotjs/svg.js';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { firstValueFrom } from 'rxjs';
import { svgadapter } from '../svg.util';

const coefficient = 100000;

interface ImageSize {
  width: number;
  height: number;
}

@Injectable({ providedIn: 'root' })
export class ExportPdfService {
  examId = '';
  scan!: IScan;
  scale = 2;
  upload = true;
  nbrPageInTemplate = 0;
  nbrPageInExam = 0;
  examExport: ExportPDFDto | undefined;
  comments!: IComments[];
  questionMap: Map<number, Questionspdf> = new Map();
  canvass: Map<number, HTMLCanvasElement> = new Map();
  progress = 0;
  messageService!: MessageService;
  anonymous = true;

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
  ) {}

  async generatePdf(
    examId: string,
    messageService: MessageService,
    anonymous: boolean,
    upload: boolean,
    sheetuuid?: string,
  ): Promise<boolean> {
    this.messageService = messageService;
    this.anonymous = anonymous;
    this.examId = examId;
    this.upload = upload;
    let uri = 'api/exportpdf/' + this.examId;
    if (sheetuuid !== undefined) {
      uri = 'api/exportpdf4sheet/' + this.examId + '/' + sheetuuid;
    }

    this.examExport = await firstValueFrom(this.http.get<ExportPDFDto>(this.applicationConfigService.getEndpointFor(uri)));
    this.examExport.questionspdf!.forEach(q => this.questionMap.set(q.ID!, q));

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.preferenceService.getPreference().pdfscale !== undefined) {
      this.scale = this.preferenceService.getPreference().pdfscale;
    }

    this.nbrPageInTemplate = await this.db.countPageTemplate(+this.examId);
    if (this.nbrPageInTemplate === 0) {
      this.nbrPageInTemplate = +(await firstValueFrom(this.cacheUploadService.getNbrePageInTemplate(+this.examId)));
    }
    this.comments = await firstValueFrom(
      this.http.get<IComments[]>(this.applicationConfigService.getEndpointFor('api/getComments/' + this.examId)),
    );

    const exportPromises: Promise<void>[] = [];
    this.examExport?.sheetspdf?.forEach((sheet, index1) => {
      exportPromises.push(this.processPage(sheet, index1));
    });
    await Promise.all(exportPromises);
    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant('scanexam.exportpdfok'),
      detail: this.translateService.instant('scanexam.exportpdfokdetails'),
    });
    return true;
  }

  async putAlignImageInCache(examId: number, page: number): Promise<void> {
    const pageInCache = await this.db.countAlignWithPageNumber(examId, page);
    if (pageInCache === 0) {
      const value = await firstValueFrom(this.cacheUploadService.getAlignImage(examId, page));
      await this.db.addAligneImage({
        // eslint-disable-next-line object-shorthand
        examId: examId,
        pageNumber: page,
        value,
      });
    }
  }

  processPage(sheet: Sheetspdf, index1: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (index1 > -1) {
        const begin = sheet.pagemin! + 1;
        const end = sheet.pagemax! + 1;
        const promises: Promise<number>[] = [];
        const checkPagePromises: Promise<void>[] = [];
        for (let k = begin; k <= end; k++) {
          checkPagePromises.push(this.putAlignImageInCache(+this.examId, k));
        }
        Promise.all(checkPagePromises).then(k => {
          this.db.getAlignImageBetweenAndSortByPageNumber(+this.examId, begin, end).then(e2 => {
            e2.forEach((e, index) => {
              const image = JSON.parse(e.value, this.reviver);
              promises.push(this.loadImage(image.pages, e.pageNumber));
            });
            Promise.all(promises).then(e => {
              this.startProcessingPage(sheet).then(() => {
                this.exportPdf(sheet).then(() => resolve());
              });
            });
          });
        });
      } else {
        resolve();
      }
    });
  }

  async startProcessingPage(sheet: Sheetspdf): Promise<void> {
    for (let page = sheet.pagemin! + 1; page <= sheet.pagemax! + 1; page++) {
      if (this.anonymous) {
        if (this.nbrPageInTemplate > 1) {
          const paget1 = (page % this.nbrPageInTemplate) % 2;
          if (1 === paget1) {
            this.maskNameFirstName(this.canvass.get(page)!);
          }
        } else {
          this.maskNameFirstName(this.canvass.get(page)!);
        }
      }
      await this.drawComments(sheet, page);
    }
  }

  async loadImage(file: any, page1: number): Promise<number> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        const editedImage: HTMLCanvasElement = document.createElement('canvas');
        editedImage.width = i.width;
        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        this.canvass.set(page1, editedImage);
        resolve(page1);
      };
      i.src = file;
    });
  }

  maskNameFirstName(canvas: HTMLCanvasElement): void {
    if (this.examExport?.namezonepdf !== undefined) {
      const x = (this.examExport.namezonepdf.XInit! * canvas.width) / coefficient;
      const y = (this.examExport.namezonepdf.YInit! * canvas.height) / coefficient;
      const width = (this.examExport.namezonepdf.width! * canvas.width) / coefficient;
      const height = (this.examExport.namezonepdf.height! * canvas.height) / coefficient;
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
      ctx?.fillRect(x, y, width, height);
      ctx?.stroke();
    }

    if (this.examExport?.firstnamezonepdf !== undefined) {
      const x = (this.examExport.firstnamezonepdf.XInit! * canvas.width) / coefficient;
      const y = (this.examExport.firstnamezonepdf.YInit! * canvas.height) / coefficient;
      const width = (this.examExport.firstnamezonepdf.width! * canvas.width) / coefficient;
      const height = (this.examExport.firstnamezonepdf.height! * canvas.height) / coefficient;
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
      ctx?.fillRect(x, y, width, height);
      ctx?.stroke();
    }
  }

  async drawComments(sheet: Sheetspdf, page: number): Promise<void> {
    const pageref = this.nbrPageInTemplate === 1 ? 1 : page % this.nbrPageInTemplate;
    const qs4 = this.examExport?.questionspdf?.filter(q1 => q1.zonepdf?.pageNumber === pageref);

    for (let i = 0; i < qs4!.length; i++) {
      const t1 = this.examExport?.questionspdf?.filter(q3 => q3.numero === qs4![i].numero);
      const t = t1?.indexOf(qs4![i]);
      await this.drawComment(this.canvass.get(page)!, sheet, qs4![i], t!);
    }
  }

  drawComment(canvas: HTMLCanvasElement, sheet: Sheetspdf, question: Questionspdf, questionindex: number): Promise<void> {
    return new Promise<void>(resolve => {
      const z = question.zonepdf;
      const ctx = canvas.getContext('2d');

      const xz = (z!.XInit! * canvas.width) / coefficient;

      const yz = (z!.YInit! * canvas.height) / coefficient;
      const widthz = (z!.width! * canvas.width) / coefficient;
      const heightz = (z!.height! * canvas.height) / coefficient;

      const zoneid = this.examExport!.ID + '_' + sheet.studentpdf![0].ID + '_' + question.numero + '_' + questionindex;
      // zonegeneratedid = idexam + idstudent + questionnumero+zoneindex

      const comms = this.comments.filter(e => e.zonegeneratedid === zoneid);

      if (comms.length > 0) {
        const data = comms[0].jsonData!;
        let draw = SVG(data);
        if (data.startsWith('<?xml')) {
          draw = SVG(data.split('\n').splice(2).join('\n'));
        }
        draw.node.attributes.removeNamedItem('transform');

        const svg = new Blob([draw.svg(svgadapter)], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svg);
        const img1 = new Image();
        img1.onload = () => {
          ctx?.drawImage(img1, 0, 0, img1.width, img1.height, xz, yz, widthz, heightz);

          URL.revokeObjectURL(url);
          resolve();
        };
        img1.src = url;
      } else {
        resolve();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private async exportPdf(sheet: Sheetspdf) {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    for (let page = sheet.pagemin! + 1; page <= sheet.pagemax! + 1; page++) {
      const canvas = this.canvass.get(page)!;
      let compression = 0.65;

      if (
        this.preferenceService.getPreference().exportImageCompression !== undefined &&
        this.preferenceService.getPreference().exportImageCompression > 0 &&
        this.preferenceService.getPreference().exportImageCompression <= 1
      ) {
        compression = this.preferenceService.getPreference().exportImageCompression;
      }

      const imgData = canvas.toDataURL('image/jpeg', compression);
      const dimensions = await this.getImageDimensions(imgData);
      pdf.addImage(imgData, 'JPEG', 0, 0, dimensions.width / (dimensions.width / 210), dimensions.height / (dimensions.height / 297));
      this.addTextOrGradedOrHybridComments(pdf, page, sheet);
      //      const page1 = page % this.nbrPageInTemplate;
      const page1 = this.nbrPageInTemplate === 1 ? 1 : page % this.nbrPageInTemplate;
      if (page1 === 1) {
        pdf.setTextColor('green');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('' + sheet.finalresult! / 100, 190, 10);
      }

      if (page < sheet.pagemax! + 1) {
        pdf.addPage('a4', 'portrait');
      }
      this.canvass.delete(page)!;
    }
    if (this.upload) {
      const blob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
      await this.cacheUploadService.uploadStudentPdf(blob, +this.examId, this.translateService, this.messageService, sheet.name! + '.pdf', {
        setMessage(v: string): void {
          //        this.message = v;
        },
        setSubMessage(v: string): void {
          //   this.subMessage = v;
        },
        setBlocked(v: boolean): void {
          // this.blocked  =v;
        },
        setProgress: (v: number): void => {
          this.progress = v;
        },
      });
    } else {
      await pdf.save(sheet.studentpdf![0].name + '_' + sheet.studentpdf![0].firstname + '.pdf', { returnPromise: true });
    }
  }

  private computeNote(resp: StudentResponsepdf, currentQ: Questionspdf): number {
    const noteSteps = currentQ.point! * currentQ.step!;
    let currentNote = 0;
    if (currentQ.gradeType === GradeType.POSITIVE && currentQ.typeAlgoName !== 'QCM') {
      currentNote = 0;
      resp.gradedcommentspdf?.forEach(g => {
        if (g.grade !== undefined && g.grade !== null) {
          currentNote = currentNote + g.grade;
        }
      });
      if (currentNote > noteSteps) {
        currentNote = noteSteps;
      }
    } else if (currentQ.gradeType === GradeType.NEGATIVE && currentQ.typeAlgoName !== 'QCM') {
      currentNote = noteSteps!;
      resp.gradedcommentspdf?.forEach(g => {
        if (g.grade !== undefined && g.grade !== null) {
          currentNote = currentNote - g.grade;
        }
      });
      if (currentNote < 0) {
        currentNote = 0;
      }
    } else if (currentQ.typeAlgoName === 'QCM' && currentQ.step! > 0) {
      currentNote = 0;
      resp.gradedcommentspdf?.forEach(g => {
        if (g.description?.startsWith('correct')) {
          currentNote = currentNote + currentQ.point! * currentQ.step!;
        } else if (g.description?.startsWith('incorrect')) {
          currentNote = currentNote - currentQ.point!;
        }
      });
    } else if (currentQ.typeAlgoName === 'QCM' && currentQ.step! <= 0) {
      currentNote = 0;
      resp.gradedcommentspdf?.forEach(g => {
        if (g.description?.startsWith('correct')) {
          currentNote = currentNote + currentQ.point!;
        }
      });
    } else if (currentQ.gradeType === GradeType.HYBRID && currentQ.typeAlgoName !== 'QCM') {
      currentNote = resp.note!;
    } else {
      currentNote = resp.note!;
    }

    if (currentQ.step! > 0 && !(currentQ.gradeType === GradeType.HYBRID && currentQ.typeAlgoName !== 'QCM')) {
      return currentNote / currentQ.step!;
    } else if (currentQ.gradeType === GradeType.HYBRID && currentQ.typeAlgoName !== 'QCM') {
      return currentNote / 100.0;
    } else {
      return currentNote;
    }
  }

  private addTextOrGradedOrHybridComments(pdf: jsPDF, page: number, sheet: Sheetspdf): void {
    let pageref = this.nbrPageInTemplate === 1 ? 1 : page % this.nbrPageInTemplate;
    if (pageref === 0) {
      pageref = this.nbrPageInTemplate;
    }
    const qs4id = this.examExport?.questionspdf?.filter(q1 => q1.zonepdf?.pageNumber === pageref).map(q2 => q2.ID);

    sheet.studentResponsepdf
      ?.filter(resp => qs4id?.includes(resp.questionID))
      .forEach(resp1 => {
        let decallage = 0;
        resp1.gradedcommentspdf?.forEach(gc => {
          const currentQ = this.questionMap.get(resp1.questionID!)!;
          let content = '';
          if (currentQ.typeAlgoName === 'QCM') {
            content = gc.description ? gc.description : '';
          } else if (currentQ.gradeType === GradeType.POSITIVE) {
            content =
              '+' +
              gc.grade! /* * this.questionMap.get(resp1.questionID!)!.point! */ / this.questionMap.get(resp1.questionID!)!.step! +
              'pt\n' +
              (gc.description ? gc.description : '');
          } else {
            content =
              '-' +
              gc.grade! /* *this.questionMap.get(resp1.questionID!)!.point! */ / this.questionMap.get(resp1.questionID!)!.step! +
              'pt\n' +
              (gc.description ? gc.description : '');
          }

          pdf.createAnnotation({
            type: 'text',
            title: gc.text,
            bounds: {
              x: 0,
              y: (this.questionMap.get(resp1.questionID!)!.zonepdf!.YInit! * 297) / coefficient + decallage,
              w: 200,
              h: 80,
            },
            contents: content,
            open: false,
          });
          decallage = decallage + 10;
        });
        resp1.hybridcommentspdf?.forEach(hc => {
          const currentQ = this.questionMap.get(resp1.questionID!)!;
          let content = '';
          if (currentQ.gradeType === GradeType.HYBRID && hc.stepValue !== undefined && hc.stepValue > 0) {
            // +1 * /2 * (grade) %
            if (hc.grade !== undefined && hc.grade > 0) {
              content = content + '+ ';
            } else {
              content = content + '- ';
            }
            if (hc.stepMax !== undefined && hc.stepValue < hc.stepMax) {
              content = content + hc.stepValue + ' / ' + hc.stepMax + ' * ';
            }
            if (hc.grade !== undefined && hc.relative !== undefined && hc.relative) {
              content = content + Math.abs(hc.grade) + '%' + ' (' + this.questionMap.get(resp1.questionID!)!.point! + ')\n';
            } else if (hc.grade !== undefined && hc.relative !== undefined && !hc.relative) {
              content = content + Math.abs(hc.grade) + 'pt\n';
            }

            content = content + (hc.description ? hc.description : '');
            pdf.createAnnotation({
              type: 'text',
              title: hc.text,
              bounds: {
                x: 0,
                y: (this.questionMap.get(resp1.questionID!)!.zonepdf!.YInit! * 297) / coefficient + decallage,
                w: 200,
                h: 80,
              },
              contents: content,
              open: false,
            });

            decallage = decallage + 10;
          }
        });

        resp1.textcommentspdf?.forEach(tc => {
          pdf.createAnnotation({
            type: 'text',
            title: tc.text,
            bounds: {
              x: 0,
              y: (this.questionMap.get(resp1.questionID!)!.zonepdf!.YInit! * 297) / coefficient + decallage,
              w: 200,
              h: 80,
            },
            contents: '' + tc.description,
            open: false,
          });
          decallage = decallage + 10;
        });
        pdf.setTextColor('green');
        pdf.setFont('helvetica', 'bold');
        pdf.text(
          '' +
            this.computeNote(resp1, this.questionMap.get(resp1.questionID!)!) +
            ' / ' +
            this.questionMap.get(resp1.questionID!)!.point +
            ' pt',
          180,
          (this.questionMap.get(resp1.questionID!)!.zonepdf!.YInit! * 297) / coefficient,
        );
      });
  }

  private getImageDimensions(dataURL: string): Promise<ImageSize> {
    return new Promise<ImageSize>(resolve => {
      const i = new Image();
      i.onload = () => {
        resolve({ width: i.width, height: i.height });
      };
      i.src = dataURL;
    });
  }

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }
}
