import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGradedComment } from '../graded-comment.model';

@Component({
  selector: 'jhi-graded-comment-detail',
  templateUrl: './graded-comment-detail.component.html',
})
export class GradedCommentDetailComponent implements OnInit {
  gradedComment: IGradedComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gradedComment }) => {
      this.gradedComment = gradedComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
