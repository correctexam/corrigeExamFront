/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
import { IExam } from 'app/entities/exam/exam.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { NgxExtendedPdfViewerService, ScrollModeType } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'jhi-showextract-image',
  templateUrl: './showextract-image.component.html',
  styleUrls: ['./showextract-image.component.scss'],
})
export class ShowextractImageComponent implements OnInit {
  @Input()
  exam!: IExam;

  title = 'gradeScopeFree';
  dataURL: any;
  dataURL1: any;
  public scrollMode: ScrollModeType = ScrollModeType.vertical;

  constructor(private pdfService: NgxExtendedPdfViewerService, public zoneService: ZoneService, public questionService: QuestionService) {}
  ngOnInit(): void {}

  public exportAsImage(): void {
    const scale = { scale: 1 };

    this.pdfService.getPageAsImage(1, scale).then(dataURL => {
      this.dataURL = dataURL;
    });
    this.pdfService.getPageAsImage(2, scale).then(dataURL1 => {
      this.dataURL1 = dataURL1;
    });
  }
}
