import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../entities/question/service/question.service';
import { StudentService } from '../../entities/student/service/student.service';
import { StudentResponseService } from '../../entities/student-response/service/student-response.service';
import { IExam } from '../../entities/exam/exam.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'jhi-marking-summary',
  templateUrl: './marking-summary.component.html',
  styleUrls: ['./marking-summary.component.scss'],
})
export class MarkingSummaryComponent implements OnInit {
  public nameExam = '';
  public examId = -1;
  public questions: ItemSummary[] = [];
  public students: ItemSummary[] = [];
  public nbStd = 0;
  public exam: IExam | null = null;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private examService: ExamService,
    private questionService: QuestionService,
    private studentResponseService: StudentResponseService,
    private studentService: StudentService
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.examId = parseInt(params.get('examid') ?? '-1', 10);
      this.examService.find(this.examId).subscribe(dataExam => {
        this.exam = dataExam.body;

        if (this.exam) {
          this.nameExam = this.exam.name ?? '';
          this.fillQuestionsTableSummary(this.exam);
        }
      });
    });
  }

  public getSortedQuestions(): Array<ItemSummary> {
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
    // Getting the students involved in the current course
    this.studentService.query({ courseId: exam.courseId }).subscribe(dataStd => {
      this.nbStd = dataStd.body?.length ?? 0;
    });

    // Getting all the marks of the current exam
    // FIXME: it returns all the responses of all the exams
    this.studentResponseService.query().subscribe(dataMarking => {
      const marks = dataMarking.body ?? [];
      const allMarkedSheets: Array<Array<number>> = [];

      // Getting all the questions of the current exam
      lastValueFrom(this.questionService.query({ examId: exam.id }))
        .then(dataQuestion => {
          const questions = dataQuestion.body ?? [];
          // Used to identify the first sheet not marked
          const studentsSerie = Array.from(Array(questions.length - 1).keys()).map(x => x + 1);

          this.questions = questions.map(q => {
            const marksQ = marks.filter(m => m.questionId === q.id);
            const markedSheets = marksQ.filter(m => m.sheetId).map(m => m.sheetId!);
            allMarkedSheets.push(markedSheets);

            // removing the marked sheets from 'questionsSerie' to get the unmarked questions
            const remainingSheets = studentsSerie.filter(sheet => !markedSheets.includes(sheet));

            return {
              answeredSheets: marksQ.length,
              number: q.numero ?? -1,
              firstSheetNotAnswered: remainingSheets.length === 0 ? 1 : remainingSheets[0],
            };
          });
        })
        .then(() => {
          // FIXME: firstSheetNotAnswered to compute
          this.studentService.query({ courseId: exam.courseId }).subscribe(studentsData => {
            const nbStds = (studentsData.body ?? []).length;

            Array.from(Array(nbStds).keys()).forEach(sheetID => {
              const stdQuestionsMarked = allMarkedSheets.filter(q => q.includes(sheetID + 1)).length;

              this.students.push({
                answeredSheets: stdQuestionsMarked,
                number: sheetID + 1,
                firstSheetNotAnswered: 1,
              });
            });
          });
        });
    });
  }
}

/**
 * Local type used in the summary table
 */
interface ItemSummary {
  number: number;
  answeredSheets: number;
  firstSheetNotAnswered: number;
}
