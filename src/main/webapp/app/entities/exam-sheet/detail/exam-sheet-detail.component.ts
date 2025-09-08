import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IExamSheet } from '../exam-sheet.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  selector: 'jhi-exam-sheet-detail',
  templateUrl: './exam-sheet-detail.component.html',
  standalone: true,
  imports: [AlertErrorComponent, AlertComponent, RouterLink, FaIconComponent],
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
