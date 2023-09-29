/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { IScan } from 'app/entities/scan/scan.model';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { MessageService } from 'primeng/api';
import { CacheUploadService } from '../exam-detail/cacheUpload.service';
import { PreferenceService } from '../preference-page/preference.service';
import { DialogService } from 'primeng/dynamicdialog';

import { ZoneService } from 'app/entities/zone/service/zone.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { QuestionService } from 'app/entities/question/service/question.service';

import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExportPDFDto, Questionspdf, Sheetspdf, StudentResponsepdf } from './exportpdf.model';
import { IComments } from 'app/entities/comments/comments.model';
import { ExportPdfService } from './exportanonymoupdf.service';

const coefficient = 100000;

interface ImageSize {
  width: number;
  height: number;
}

@Component({
  selector: 'jhi-exportanonymoupdf',
  templateUrl: './exportanonymoupdf.component.html',
  styleUrls: ['./exportanonymoupdf.component.scss'],
  providers: [MessageService, DialogService],
})
export class ExportanonymoupdfComponent implements OnInit {
  examId = '';
  scan!: IScan;
  pdfcontent!: string;
  scale = 2;
  sheetuid: string | undefined;
  nbrPageInTemplate = 0;
  nbrPageInExam = 0;
  examExport: ExportPDFDto | undefined;
  comments!: IComments[];
  questionMap: Map<number, Questionspdf> = new Map();
  blocked = true;
  canvass: Map<number, HTMLCanvasElement> = new Map();
  message: string | undefined;
  subMessage: string | undefined;
  progress = 0;

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
    private messageService: MessageService,
    private preferenceService: PreferenceService,
    private db: CacheServiceImpl,
    private exportPdfService: ExportPdfService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        if (params.get('sheetuid') !== null) {
          this.sheetuid = params.get('sheetuid')!;
          this.exportPdfService.generatePdf(this.examId, this.messageService, true, this.sheetuid).then(() => (this.blocked = false));
        } else {
          this.exportPdfService.generatePdf(this.examId, this.messageService, true).then(() => (this.blocked = false));
        }
      }
    });
  }
}
