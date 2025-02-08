/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { PreferenceService } from '../../preference-page/preference.service';
import { EventEmitter } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';
import { DragDropModule } from 'primeng/dragdrop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgIf, NgFor, NgClass, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccordionModule } from 'primeng/accordion';
import { ViewandreorderpagesComponent } from '../viewandreorderpages.component';

@Component({
  selector: 'jhi-viewandreorderpages',
  templateUrl: './pagetorotateordelete.component.html',
  styleUrls: ['./pagetorotateordelete.component.scss'],
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    SelectButtonModule,
    FormsModule,
    NgIf,
    ProgressSpinnerModule,
    NgFor,
    DragDropModule,
    TooltipModule,
    TranslateModule,
  ],
})
export class PageToRotateOrDeleteComponent implements OnInit {
  pageInScan = 0;
  pageparexam = 0;
  pagesnumber: number[] = [];
  numeropagerotation = '';
  numeropagedeletion = '';
  parent?: ViewandreorderpagesComponent;
  numeropageinsertion: number = 0;
  numeropagedestination: number = 0;

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
    private translateService: TranslateService,
    private preferenceService: PreferenceService,
    private changeDetector: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    this.pageInScan = this.config.data.pageInScan;
    this.pageparexam = this.config.data.pageparexam;
    this.parent = this.config.data.parent;
    for (let i = 0; i < this.pageparexam; i++) {
      this.pagesnumber.push(i + 1);
    }
  }

  parsePageRanges(input: string): number[] {
    const parts = input.split(';');
    const result: number[] = [];

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        for (let i = start; i <= end; i++) {
          result.push(i);
        }
      } else {
        const page = parseInt(part, 10);
        result.push(page);
      }
    }

    return result;
  }

  removepagesperSheet(v: number) {
    const l = [];
    let v1 = v;
    while (v1 <= this.pageInScan) {
      console.error(l);
      l.push(v1);
      v1 = v1 + this.pageparexam;
    }
    if (l.length > 0) {
      console.error(l);
      this.parent?.removePages(l);
      this.ref.close();
    }
  }
  rotatepagesperSheet(v: number) {
    const l = [];
    let v1 = v;
    while (v1 <= this.pageInScan) {
      l.push(v1);
      v1 = v1 + this.pageparexam;
    }
    if (l.length > 0) {
      console.error(l);
      this.parent?.rotatePages(l);
      this.ref.close();
    }
  }

  removepages() {
    const s = this.parsePageRanges(this.numeropagedeletion);
    if (Array.isArray(s) && s.every(e => typeof e === 'number' && !Number.isNaN(e))) {
      this.parent?.removePages(s);
      this.numeropagedeletion = '';
      this.ref.close();
    }
  }
  rotatepages() {
    const s = this.parsePageRanges(this.numeropagerotation);
    if (Array.isArray(s) && s.every(e => typeof e === 'number' && !Number.isNaN(e))) {
      this.numeropagerotation = '';
      this.parent?.rotatePages(s);
      this.ref.close();
    }
  }
  insertpage() {
    if (
      !Number.isNaN(this.numeropagedestination) &&
      !Number.isNaN(this.numeropageinsertion) &&
      this.numeropagedestination > 0 &&
      this.numeropageinsertion > 0 &&
      this.numeropageinsertion <= this.pageInScan &&
      this.numeropagedestination <= this.pageInScan + 1
    ) {
      this.numeropagerotation = '';
      this.parent?.insertpage(this.numeropageinsertion, this.numeropagedestination);
      this.ref.close();
    }
  }
}
