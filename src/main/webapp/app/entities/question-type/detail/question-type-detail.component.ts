import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuestionType } from '../question-type.model';

@Component({
  selector: 'jhi-question-type-detail',
  templateUrl: './question-type-detail.component.html',
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
