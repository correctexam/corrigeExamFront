import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourse } from 'app/entities/course/course.model';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { ConfirmationService } from 'primeng/api';
import { TemplateService } from '../../entities/template/service/template.service';

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
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        this.examService.find(+this.examId).subscribe(data => {
          this.exam = data.body!;
          this.templateService.getPdf(this.exam.templateId!).subscribe(t => {
            this.pdf = t;
          });
        });
      }
    });
  }
}
