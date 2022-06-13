import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../entities/question/service/question.service';
import { GradedCommentService } from '../../entities/graded-comment/service/graded-comment.service';
import { StudentService } from '../../entities/student/service/student.service';

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
    private gradedCommentService: GradedCommentService,
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

            this.questionService.query({ examId: exam.id }).subscribe(dataQuestion => {
              const questions = dataQuestion.body ?? [];
              questions.forEach(q => {
                this.gradedCommentService.query({ questionId: q.id }).subscribe(dataMarking => {
                  const marking = dataMarking.body ?? [];
                  let first = marking.findIndex(m => m.grade === null);
                  first = first === -1 ? 1 : first;

                  this.questions.push({
                    answered: marking.filter(m => m.grade).length,
                    number: q.numero ?? -1,
                    firstNotAnswered: first,
                  });
                  // eslint-disable-next-line no-console
                  console.log(this.questions);
                });
              });
            });
          });
        }
      });
    });
  }

  public getTotalAnswered(): number {
    if (this.questions.length === 0) {
      return 0;
    }

    return this.questions.map(q => q.answered).reduce((q1, q2) => q1 + q2);
  }
}

interface QuestionSummary {
  number: number;
  answered: number;
  firstNotAnswered: number;
}
