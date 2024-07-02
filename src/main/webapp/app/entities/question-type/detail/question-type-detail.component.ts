import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IQuestionType } from '../question-type.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-question-type-detail',
  templateUrl: './question-type-detail.component.html',
  standalone: true,
  imports: [NgIf, TranslateDirective, AlertErrorComponent, AlertComponent, FaIconComponent, RouterLink],
})
export class QuestionTypeDetailComponent implements OnInit {
  questionType: IQuestionType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionType }) => {
      this.questionType = questionType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
