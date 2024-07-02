import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ITextComment } from '../text-comment.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-text-comment-detail',
  templateUrl: './text-comment-detail.component.html',
  standalone: true,
  imports: [NgIf, TranslateDirective, AlertErrorComponent, AlertComponent, RouterLink, FaIconComponent],
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
