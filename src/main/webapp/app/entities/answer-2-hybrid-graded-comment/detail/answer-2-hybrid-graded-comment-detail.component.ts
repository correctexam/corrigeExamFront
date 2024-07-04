import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';

@Component({
  selector: 'jhi-answer-2-hybrid-graded-comment-detail',
  templateUrl: './answer-2-hybrid-graded-comment-detail.component.html',
  standalone: true,
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
