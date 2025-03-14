import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IPrediction } from '../prediction.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-text-comment-detail',
  templateUrl: './prediction-detail.component.html',
  standalone: true,
})
export class PredictionDetailComponent implements OnInit {
  prediction: IPrediction | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prediction }) => {
      this.prediction = prediction;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
