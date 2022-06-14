import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../entities/question/service/question.service';
import { StudentService } from '../../entities/student/service/student.service';
import { StudentResponseService } from '../../entities/student-response/service/student-response.service';

@Component({
  selector: 'jhi-marking-summary',
  templateUrl: './marking-summary.component.html',
  styleUrls: ['./marking-summary.component.scss'],
})
export class MarkingSummaryComponent implements OnInit {
  public nameExam = '';
  public examId = 0;
  public questions: QuestionSummary[] = [];
  public nbStd = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private examService: ExamService,
    private questionService: QuestionService,
    private studentResponseService: StudentResponseService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.examId = parseInt(params.get('examid') ?? '-1', 10);
      this.examService.find(this.examId).subscribe(dataExam => {
        const exam = dataExam.body;

        if (exam) {
          this.nameExam = exam.name ?? '';

          this.studentService.query({ courseId: exam.courseId }).subscribe(dataStd => {
            this.nbStd = dataStd.body?.length ?? 0;
          });

          this.studentResponseService.query().subscribe(dataMarking => {
            const marks = dataMarking.body ?? [];

            this.questionService.query({ examId: exam.id }).subscribe(dataQuestion => {
              const questions = dataQuestion.body ?? [];
              const questionsSerie = Array.from(Array(questions.length - 1).keys()).map(x => x + 1);

              questions.forEach(q => {
                const marksQ = marks.filter(m => m.questionId === q.id);
                const countMarked = marksQ.length;
                const markedSheets = marksQ.filter(m => m.sheetId).map(m => m.sheetId!);
                const remainingSheets = questionsSerie.filter(sheet => !markedSheets.includes(sheet));

                this.questions.push({
                  answeredSheets: countMarked,
                  number: q.numero ?? -1,
                  firstSheetNotAnswered: remainingSheets.length === 0 ? 1 : remainingSheets[0],
                });
              });
            });
          });
        }
      });
    });
  }

  public getSortedQuestions(): Array<QuestionSummary> {
    return this.questions.sort((q1, q2) => (q1.number < q2.number ? 0 : 1));
  }

  public getTotalAnswered(): number {
    if (this.questions.length === 0) {
      return 0;
    }

    return this.questions.map(q => q.answeredSheets).reduce((q1, q2) => q1 + q2);
  }
}

interface QuestionSummary {
  number: number;
  answeredSheets: number;
  firstSheetNotAnswered: number;
}
