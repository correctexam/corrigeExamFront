import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IGradedComment } from '../graded-comment.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-graded-comment-detail',
  templateUrl: './graded-comment-detail.component.html',
  standalone: true,
  imports: [NgIf, TranslateDirective, AlertErrorComponent, AlertComponent, RouterLink, FaIconComponent],
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
