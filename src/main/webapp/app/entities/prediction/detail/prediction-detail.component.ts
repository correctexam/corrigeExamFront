import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPrediction } from '../prediction.model';

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
