import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExam } from '../exam.model';

@Component({
  selector: 'jhi-exam-detail',
  templateUrl: './exam-detail.component.html',
})
export class ExamDetailComponent implements OnInit {
  exam: IExam | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exam }) => {
      this.exam = exam;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
