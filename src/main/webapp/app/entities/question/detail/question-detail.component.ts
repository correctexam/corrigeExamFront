import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IQuestion } from '../question.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-question-detail',
  templateUrl: './question-detail.component.html',
  standalone: true,
  imports: [NgIf, TranslateDirective, AlertErrorComponent, AlertComponent, RouterLink, FaIconComponent],
})
export class QuestionDetailComponent implements OnInit {
  question: IQuestion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ question }) => {
      this.question = question;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
