import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITextComment } from '../text-comment.model';

@Component({
  selector: 'jhi-text-comment-detail',
  templateUrl: './text-comment-detail.component.html',
})
export class TextCommentDetailComponent implements OnInit {
  textComment: ITextComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ textComment }) => {
      this.textComment = textComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
