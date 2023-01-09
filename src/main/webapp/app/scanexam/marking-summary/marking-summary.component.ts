import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkingExamStateDTO, ExamService } from 'app/entities/exam/service/exam.service';

@Component({
  selector: 'jhi-marking-summary',
  templateUrl: './marking-summary.component.html',
  styleUrls: ['./marking-summary.component.scss'],
})
export class MarkingSummaryComponent implements OnInit {
  public examId = -1;
  public dataExam: MarkingExamStateDTO = {
    nameExam: '',
    questions: [],
    sheets: [],
  };
  public errorMsg: string | undefined = undefined;

  public constructor(private activatedRoute: ActivatedRoute, private examService: ExamService, private router: Router) {}

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.examId = parseInt(params.get('examid') ?? '-1', 10);

      this.examService
        .getExamDetails(this.examId)
        .then(dataExam => {
          this.dataExam = dataExam;
        })
        .catch(() => {
          this.errorMsg = 'scanexam.error';
        });
    });
  }

  public getTotalAnswered(): number {
    if (this.dataExam.questions.length === 0) {
      return 0;
    }

    return this.dataExam.questions.map(q => q.answeredSheets).reduce((q1, q2) => q1 + q2);
  }

  public goToExam(): void {
    this.router.navigateByUrl(`/exam/${this.examId}`);
  }
}
