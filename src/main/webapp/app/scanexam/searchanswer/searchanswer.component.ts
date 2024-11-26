import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PredictionService } from '../../entities/prediction/service/prediction.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { IPrediction } from 'app/entities/prediction/prediction.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'jhi-searchanswer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './searchanswer.component.html',
  styleUrls: ['./searchanswer.component.scss'],
})
export class SearchanswerComponent implements OnInit, OnDestroy {
  predictions: IPrediction[] = [];
  searchControl = new FormControl('');
  filteredPredictions: IPrediction[] = [];
  examId: string = '';
  searchMode: 'text' | 'question' = 'text';
  private searchSubscription?: Subscription;

  constructor(
    private predictionService: PredictionService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.loadPredictions(params);
    });
    this.setupSearchListener();
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  // Récupérer les prédictions dans le back
  async loadPredictions(params: ParamMap) {
    if (params.get('examid') !== null) {
      this.examId = params.get('examid')!;
    }
    try {
      const req = {
        page: 0,
        size: 500,
      };
      const predictionResponse = await firstValueFrom(this.predictionService.query(req));
      const predictions = predictionResponse.body || [];

      if (predictions.length > 0) {
        this.predictions = predictions
          .filter(prediction => prediction.examId === this.examId) // Add your desired examId here
          .map(prediction => ({
            examId: prediction.examId,
            questionNumber: prediction.questionNumber,
            studentId: prediction.studentId,
            text: prediction.text,
            imageData: prediction.imageData,
          }));

        this.filterPredictions();
      } else {
        console.warn('No predictions found from backend.');
      }
    } catch (err) {
      console.error('Error fetching predictions from backend:', err);
    }
  }

  //On regarde ce qu'on a tapé dans la barre de recherche
  setupSearchListener() {
    this.searchSubscription = this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.filterPredictions(value ?? '');
    });
  }

  // Set the search mode based on button clicked
  setSearchMode(mode: 'text' | 'question') {
    this.searchMode = mode;
  }

  // On filtre par rapport à ce qui est écrit dans la barre de recherche
  filterPredictions(searchTerm: string = '') {
    if (this.searchMode === 'question') {
      // Regular expression to detect "question X"
      const questionNumber = parseInt(searchTerm.trim(), 10);
      if (!isNaN(questionNumber)) {
        // Filter predictions by question number
        this.filteredPredictions = this.predictions.filter(prediction => prediction.questionNumber == questionNumber);
      } else {
        this.filteredPredictions = this.predictions;
      }
    } else {
      // Default filter by text
      console.log('Text prediction search', searchTerm);
      this.filteredPredictions = this.predictions.filter(prediction =>
        (prediction.text ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
  }
}
