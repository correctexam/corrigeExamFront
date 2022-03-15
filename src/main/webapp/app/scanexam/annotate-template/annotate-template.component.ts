/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { ConfirmationService } from 'primeng/api';
import { TemplateService } from '../../entities/template/service/template.service';
import { ITemplate } from '../../entities/template/template.model';

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
  template!: ITemplate;
  dockItems!: any[];

  constructor(
    public courseService: CourseService,
    public examService: ExamService,
    public templateService: TemplateService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        this.examService.find(+this.examId).subscribe(data => {
          this.exam = data.body!;
          // this.courseService.find(this.exam.courseId!).subscribe(e => (this.course = e.body!));
          this.templateService.find(this.exam.templateId!).subscribe(t => {
            this.template = t.body!;
          });
        });
      }
    });
  }
}
