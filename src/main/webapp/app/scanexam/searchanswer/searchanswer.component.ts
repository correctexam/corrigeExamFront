import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-searchanswer',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './searchanswer.component.html',
  styleUrl: './searchanswer.component.scss',
})
export class SearchanswerComponent {
  @Input() predictions: { [key: number]: string[] } = {}; // Objet avec les prédictions par page
  @Input() pageKey: number = 0; // Clé de la page courante

  @Input() searchControl = new FormControl('');

  // Méthode pour filtrer les prédictions pour la page courante
  constructor() {
    // Pour surveiller les changements dans la valeur de recherche
    this.searchControl.valueChanges.subscribe(value => {
      console.log('Valeur de recherche:', value);
    });
  }

  ngOnInit() {
    console.log('Initial predictions:', this.predictions);
  }

  get filteredPredictions(): string[] {
    const searchText = this.searchControl.value?.toLowerCase() || '';
    const pagePredictions = this.predictions[this.pageKey] || [];
    console.log('pagePredictions:', pagePredictions); // Affiche les prédictions de la page

    return pagePredictions.filter(prediction => prediction.toLowerCase().includes(searchText));
  }
}
