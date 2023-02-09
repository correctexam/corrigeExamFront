import { Component, Input } from '@angular/core';
import { Question } from 'app/entities/question/question.model';

@Component({
  selector: 'jhi-summary-template',
  templateUrl: './summary-template.component.html',
  styleUrls: ['./summary-template.component.scss'],
})
export class SummaryTemplateComponent {
  @Input()
  questions: Map<number, Question> = new Map();

  public getSortedQuestions(): Array<Question> {
    return [...this.questions.values()].sort((a, b) => a.numero! - b.numero!);
  }

  /**
   * @returns Computes the total number of points of the exam.
   */
  public sumPoints(): number {
    return this.getSortedQuestions()
      .map(q => q.point ?? 0)
      .reduce((a, b) => a + b, 0);
  }

  public isFollowingQuestion(i: number, q: Question): boolean {
    return (
      this.getSortedQuestions()
        .slice(0, i)
        .filter(q2 => q2.numero === q.numero).length > 0
    );
  }
}
