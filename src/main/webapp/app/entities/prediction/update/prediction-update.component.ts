import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PredictionService } from '../service/prediction.service';
import { IPrediction } from '../prediction.model';

@Component({
  selector: 'app-prediction-update',
  templateUrl: './prediction-update.component.html',
  standalone: true,
})
export class PredictionUpdateComponent implements OnInit {
  prediction: IPrediction = { id: undefined, text: '', questionNumber: undefined };

  constructor(
    protected predictionService: PredictionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prediction }) => {
      if (prediction) {
        this.prediction = prediction;
      }
    });
  }

  save(): void {
    if (this.prediction.id !== undefined) {
      this.predictionService.update(this.prediction).subscribe(() => this.onSaveSuccess());
    } else {
      this.predictionService.create(this.prediction).subscribe(() => this.onSaveSuccess());
    }
  }

  protected onSaveSuccess(): void {
    this.router.navigate(['/predictions']);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  cancel(): void {
    this.router.navigate(['/predictions']);
  }
}
