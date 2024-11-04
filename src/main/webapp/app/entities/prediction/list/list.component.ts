import { Component, OnInit } from '@angular/core';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { Router } from '@angular/router';
import { IPrediction } from '../prediction.model';
import { HttpResponse } from '@angular/common/http'; // Import HttpResponse
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-prediction-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [NgFor, NgIf],
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
}
