import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExamSheet } from '../exam-sheet.model';

@Component({
  selector: 'jhi-exam-sheet-detail',
  templateUrl: './exam-sheet-detail.component.html',
})
export class ExamSheetDetailComponent implements OnInit {
  examSheet: IExamSheet | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examSheet }) => {
      this.examSheet = examSheet;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
