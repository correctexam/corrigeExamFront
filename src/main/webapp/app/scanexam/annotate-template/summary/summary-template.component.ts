import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Question } from 'app/entities/question/question.model';

/** Request to delete the zone of a question; `done` must be called once the deletion is over (accepted, cancelled or failed). */
export interface DeleteQuestionRequest {
  question: Question;
  done: () => void;
}

@Component({
  selector: 'jhi-summary-template',
  templateUrl: './summary-template.component.html',
  styleUrls: ['./summary-template.component.scss'],
  standalone: true,
  imports: [FaIconComponent, TranslateDirective, TranslatePipe],
})
export class SummaryTemplateComponent {
  @Input()
  questions: Map<number, Question> = new Map();

  @Output()
  gotoQ: EventEmitter<Question> = new EventEmitter<Question>();

  @Output()
  deleteQ: EventEmitter<DeleteQuestionRequest> = new EventEmitter<DeleteQuestionRequest>();

  /** Questions whose deletion is in progress (avoids double clicks) */
  private readonly deleting = new Set<Question>();

  public getSortedQuestions(): Array<Question> {
    return [...this.questions.values()].sort((a, b) => a.numero! - b.numero!);
  }

  /**
   * @returns Computes the total number of points of the exam.
   */
  public sumPoints(): number {
    return this.getSortedQuestions()
      .filter((q, i) => !this.isFollowingQuestion(i, q))
      .filter(q => !q.mustBeIgnoreInGlobalScale)
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

  public deleteQuestion(q: Question): void {
    if (this.deleting.has(q)) {
      return;
    }
    this.deleting.add(q);
    this.deleteQ.emit({ question: q, done: () => this.deleting.delete(q) });
  }

  public isDeleting(q: Question): boolean {
    return this.deleting.has(q);
  }
}
