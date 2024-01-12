import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from 'app/entities/course/course.model';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { ConfirmationService } from 'primeng/api';
import { TemplateService } from '../../entities/template/service/template.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-annotate-template',
  templateUrl: './annotate-template.component.html',
  styleUrls: ['./annotate-template.component.scss'],
  providers: [ConfirmationService],
})
export class AnnotateTemplateComponent implements OnInit {
  examId = '';
  exam!: IExam;
  course!: ICourse;
  pdf: any;
  dockItems!: any[];

  constructor(
    private examService: ExamService,
    private templateService: TemplateService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        this.examService.find(+this.examId).subscribe(data => {
          if (data.body !== null) {
            this.exam = data.body;
            this.activatedRoute.data.subscribe(e => {
              this.translateService.get(e['pageTitle'], { examName: this.exam.name, courseName: this.exam.courseName }).subscribe(e1 => {
                this.titleService.setTitle(e1);
              });
            });

            this.templateService.getPdf(this.exam.templateId!).subscribe(t => {
              this.pdf = t;
            });
          }
        });
      }
    });
  }
}
