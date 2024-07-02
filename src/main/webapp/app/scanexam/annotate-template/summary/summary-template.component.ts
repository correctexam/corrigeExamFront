import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from 'app/entities/question/question.model';
import { NgFor, NgIf } from '@angular/common';
import { TranslateDirective } from '../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-summary-template',
  templateUrl: './summary-template.component.html',
  styleUrls: ['./summary-template.component.scss'],
  standalone: true,
  imports: [TranslateDirective, NgFor, NgIf],
})
export class SummaryTemplateComponent {
  @Input()
  questions: Map<number, Question> = new Map();

  @Output()
  gotoQ: EventEmitter<Question> = new EventEmitter<Question>();

  public getSortedQuestions(): Array<Question> {
    return [...this.questions.values()].sort((a, b) => a.numero! - b.numero!);
  }

  /**
   * @returns Computes the total number of points of the exam.
   */
  public sumPoints(): number {
    return this.getSortedQuestions()
      .filter((q, i) => !this.isFollowingQuestion(i, q))
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

  public goToQuestion(q: Question): void {
    this.gotoQ.emit(q);
  }
}
