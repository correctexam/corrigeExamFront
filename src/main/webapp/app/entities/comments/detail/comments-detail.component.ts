import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IComments } from '../comments.model';

@Component({
  selector: 'jhi-comments-detail',
  templateUrl: './comments-detail.component.html',
})
export class CommentsDetailComponent implements OnInit {
  comments: IComments | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comments }) => {
      this.comments = comments;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
