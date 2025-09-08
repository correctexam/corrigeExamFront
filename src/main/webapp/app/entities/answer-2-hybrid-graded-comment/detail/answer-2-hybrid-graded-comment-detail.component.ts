import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';
import { AlertErrorComponent } from 'app/shared/alert/alert-error.component';
import { AlertComponent } from 'app/shared/alert/alert.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'jhi-answer-2-hybrid-graded-comment-detail',
  templateUrl: './answer-2-hybrid-graded-comment-detail.component.html',
  standalone: true,
  imports: [AlertErrorComponent, AlertComponent, FaIconComponent, RouterLink],
})
export class Answer2HybridGradedCommentDetailComponent implements OnInit {
  answer2HybridGradedComment: IAnswer2HybridGradedComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answer2HybridGradedComment }) => {
      this.answer2HybridGradedComment = answer2HybridGradedComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
