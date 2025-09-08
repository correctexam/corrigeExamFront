import { Component, OnInit } from '@angular/core';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { Router } from '@angular/router';
import { IPrediction } from '../prediction.model';

import { forkJoin, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-prediction-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [],
})
export class PredictionListComponent implements OnInit {
  predictions: IPrediction[] = []; // Array to store predictions

  constructor(
    private predictionService: PredictionService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  // Method to load all predictions
  async loadAll(): Promise<void> {
    const response = await firstValueFrom(this.predictionService.query());
    this.predictions = response.body || [];
  }

  // Method to view prediction details
  view(id: number): void {
    this.router.navigate(['/predictions', id, 'view']);
  }

  // Method to edit a prediction
  edit(id: number): void {
    this.router.navigate(['/predictions', id, 'edit']);
  }

  // Method to delete a prediction
  async delete(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this prediction?')) {
      try {
        await firstValueFrom(this.predictionService.delete(id));
        await this.loadAll(); // Reload the list after deletion
      } catch (err: any) {
        alert(`Failed to delete prediction with id ${id}. Please try again.`);
        console.error(err);
      }
    }
  }

  async deleteByQuestion(questionId: string): Promise<void> {
    const numericQuestionId = parseInt(questionId, 10);
    if (!numericQuestionId) {
      alert('Please enter a valid question ID');
      return;
    }

    const predictionsToDelete = this.predictions.filter(p => p.questionId === numericQuestionId);

    if (predictionsToDelete.length === 0) {
      alert(`No predictions found for exam ${numericQuestionId}`);
      return;
    }

    if (confirm(`Are you sure you want to delete all ${predictionsToDelete.length} predictions for exam ${numericQuestionId}?`)) {
      const deleteObservables = predictionsToDelete.filter(p => p.id !== undefined).map(p => this.predictionService.delete(p.id!));

      try {
        await firstValueFrom(forkJoin(deleteObservables));
        await this.loadAll();
      } catch (err: any) {
        console.error(`Error deleting predictions for question ${numericQuestionId}:`, err);
        alert(`Failed to delete some or all predictions for question ${numericQuestionId}. Please try again.`);
        await this.loadAll();
      }
    }
  }

  async deleteAllPredictions(): Promise<void> {
    const predictionsToDelete = this.predictions.filter(p => p.id !== undefined).map(p => this.predictionService.delete(p.id!));

    if (predictionsToDelete.length === 0) {
      alert(`No predictions found to delete`);
      return;
    }

    if (confirm('Are you sure you want to delete all predictions?')) {
      try {
        await firstValueFrom(forkJoin(predictionsToDelete));
        await this.loadAll();
        alert('Successfully deleted all predictions');
      } catch (err: any) {
        console.error('Error deleting all predictions:', err);
        alert('Failed to delete some or all predictions. Please try again.');
        await this.loadAll();
      }
    }
  }
}
