import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IFinalResult } from '../final-result.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  selector: 'jhi-final-result-detail',
  templateUrl: './final-result-detail.component.html',
  standalone: true,
  imports: [AlertErrorComponent, AlertComponent, RouterLink, FaIconComponent],
})
export class FinalResultDetailComponent implements OnInit {
  finalResult: IFinalResult | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finalResult }) => {
      this.finalResult = finalResult;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
