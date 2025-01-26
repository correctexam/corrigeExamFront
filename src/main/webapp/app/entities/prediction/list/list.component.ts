import { Component, OnInit } from '@angular/core';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { Router } from '@angular/router';
import { IPrediction } from '../prediction.model';
import { HttpResponse } from '@angular/common/http'; // Import HttpResponse
import { NgIf, NgFor } from '@angular/common';
import { forkJoin } from 'rxjs';
import { TranslateDirective } from 'app/shared/language/translate.directive';

@Component({
  selector: 'app-prediction-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [TranslateDirective, NgFor, NgIf],
})
export class PredictionListComponent implements OnInit {
  predictions: IPrediction[] = []; // Array to store predictions

  constructor(
    private predictionService: PredictionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // Method to load all predictions
  loadAll(): void {
    this.predictionService.query().subscribe((response: HttpResponse<IPrediction[]>) => {
      this.predictions = response.body || [];
    });
    console.log('Loaded predictions:', this.predictions);
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
  delete(id: number): void {
    if (confirm('Are you sure you want to delete this prediction?')) {
      this.predictionService.delete(id).subscribe({
        next: () => {
          console.log(`Deleted prediction with id: ${id}`);
          this.loadAll(); // Reload the list after deletion
        },
        error: err => {
          console.error(`Error deleting prediction with id ${id}:`, err);
          alert(`Failed to delete prediction with id ${id}. Please try again.`);
        },
      });
    }
  }

  deleteByExam(examId: string): void {
    const numericExamId = parseInt(examId, 10);
    if (!numericExamId) {
      alert('Please enter a valid exam ID');
      return;
    }

    const predictionsToDelete = this.predictions.filter(p => p.examId && parseInt(p.examId, 10) === numericExamId);

    if (predictionsToDelete.length === 0) {
      alert(`No predictions found for exam ${numericExamId}`);
      return;
    }

    if (confirm(`Are you sure you want to delete all ${predictionsToDelete.length} predictions for exam ${numericExamId}?`)) {
      const deleteObservables = predictionsToDelete.filter(p => p.id !== undefined).map(p => this.predictionService.delete(p.id!));

      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.loadAll();
          alert(`Successfully deleted ${predictionsToDelete.length} predictions for exam ${numericExamId}`);
        },
        error: err => {
          console.error(`Error deleting predictions for exam ${numericExamId}:`, err);
          alert(`Failed to delete some or all predictions for exam ${numericExamId}. Please try again.`);
          this.loadAll();
        },
      });
    }
  }

  deleteAllPredictions(): void {
    const predictionsToDelete = this.predictions.filter(p => p.id !== undefined).map(p => this.predictionService.delete(p.id!));

    if (predictionsToDelete.length === 0) {
      alert(`No predictions found to delete`);
      return;
    }

    if (confirm('Are you sure you want to delete all predictions?')) {
      forkJoin(predictionsToDelete).subscribe({
        next: () => {
          this.loadAll();
          alert('Successfully deleted all predictions');
        },
        error: err => {
          console.error('Error deleting all predictions:', err);
          alert('Failed to delete some or all predictions. Please try again.');
          this.loadAll();
        },
      });
    }
  }
}
