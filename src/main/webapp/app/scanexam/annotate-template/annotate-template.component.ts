import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { ConfirmationService } from 'primeng/api';
import { TemplateService } from '../../entities/template/service/template.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { PaintComponent } from './paint/paint.component';

@Component({
  selector: 'jhi-annotate-template',
  templateUrl: './annotate-template.component.html',
  styleUrls: ['./annotate-template.component.scss'],
  providers: [ConfirmationService],
  standalone: true,
  imports: [PaintComponent],
})
export class AnnotateTemplateComponent implements OnInit {
  examId = '';
  exam?: IExam;
  pdf: any;
  dockItems!: any[];

  // completes the subscriptions to application-wide observables when the component is destroyed
  private readonly destroyRef = inject(DestroyRef);

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
            this.updateTitle();
            this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
              this.updateTitle();
            });
            this.templateService.getPdf(this.exam.templateId!).subscribe(t => {
              this.pdf = t;
            });
          }
        });
      }
    });
  }

  updateTitle(): void {
    this.activatedRoute.data.subscribe(e => {
      this.translateService.get(e['pageTitle'], { examName: this.exam?.name, courseName: this.exam?.courseName }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }
}
