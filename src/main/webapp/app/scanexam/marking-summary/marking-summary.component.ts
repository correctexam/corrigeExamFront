import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../entities/question/service/question.service';
import { StudentService } from '../../entities/student/service/student.service';
import { StudentResponseService } from '../../entities/student-response/service/student-response.service';
import { IExam } from '../../entities/exam/exam.model';

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
          this.fillQuestionsTableSummary(exam);
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

  /**
   * Fills the table that summarizes the questions markings using the given exam.
   * @param exam The exam to use for filling the table.
   */
  private fillQuestionsTableSummary(exam: IExam): void {
    this.nameExam = exam.name ?? '';

    // Getting the students involved in the current course
    this.studentService.query({ courseId: exam.courseId }).subscribe(dataStd => {
      this.nbStd = dataStd.body?.length ?? 0;
    });

    // Getting all the marks of the current exam
    // TODO: does the query only return the remarks of the ongoing exam? Not able to use parameters
    this.studentResponseService.query().subscribe(dataMarking => {
      const marks = dataMarking.body ?? [];

      // Getting all the questions of the current exam
      this.questionService.query({ examId: exam.id }).subscribe(dataQuestion => {
        const questions = dataQuestion.body ?? [];
        // Used to identify the first sheet not marked
        const questionsSerie = Array.from(Array(questions.length - 1).keys()).map(x => x + 1);

        questions.forEach(q => {
          const marksQ = marks.filter(m => m.questionId === q.id);
          const countMarked = marksQ.length;
          const markedSheets = marksQ.filter(m => m.sheetId).map(m => m.sheetId!);
          // removing the marked sheets from 'questionsSerie' to get the unmarked questions
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
}

/**
 * Local type used in the summary table
 */
interface QuestionSummary {
  number: number;
  answeredSheets: number;
  firstSheetNotAnswered: number;
}
