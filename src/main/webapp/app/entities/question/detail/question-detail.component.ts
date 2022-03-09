import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuestion } from '../question.model';

@Component({
  selector: 'jhi-question-detail',
  templateUrl: './question-detail.component.html',
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
