import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkingExamStateDTO, ExamService } from 'app/entities/exam/service/exam.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-marking-summary',
  templateUrl: './marking-summary.component.html',
  styleUrls: ['./marking-summary.component.scss'],
})
export class MarkingSummaryComponent implements OnInit {
  questionNumeros: Array<number> = [];
  public examId = -1;
  public dataExam: MarkingExamStateDTO = {
    nameExam: '',
    questions: [],
    sheets: [],
  };
  public pageInTemplate = 1;
  public errorMsg: string | undefined = undefined;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private examService: ExamService,
    private router: Router,
    private db: CacheServiceImpl,
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.examId = parseInt(params.get('examid') ?? '-1', 10);

      this.db.countPageTemplate(+this.examId).then(pageInTemplate => {
        this.pageInTemplate = pageInTemplate;

        this.examService
          .getExamDetails(this.examId)
          .then(dataExam => {
            this.dataExam = dataExam;
            // eslint-disable-next-line no-console
            this.questionNumeros = Array.from(new Set(this.dataExam.questions.map(q => q.numero))).sort((n1, n2) => n1 - n2);
          })
          .catch(() => {
            this.errorMsg = 'scanexam.error';
          });
      });
    });
  }

  public getTotalAnswered(): number {
    if (this.dataExam.questions.length === 0) {
      return 0;
    }

    return this.dataExam.questions.map(q => q.answeredSheets).reduce((q1, q2) => q1 + q2);
  }

  cleanSheet(): void {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    this.http.delete<any>(this.applicationConfigService.getEndpointFor('api/cleanExamSheet/' + this.examId)).subscribe(() => {
      window.location.reload();
    });
  }

  public goToExam(): void {
    this.router.navigateByUrl(`/exam/${this.examId}`);
  }
}
