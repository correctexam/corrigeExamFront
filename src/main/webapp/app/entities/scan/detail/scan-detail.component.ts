import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IScan } from '../scan.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { CommonModule, NgIf } from '@angular/common';
import { ScriptService } from '../service/dan-service.service';

@Component({
  standalone: true,
  selector: 'jhi-scan-detail',
  templateUrl: './scan-detail.component.html',
  imports: [CommonModule, NgIf, TranslateDirective, AlertErrorComponent, AlertComponent, FaIconComponent, RouterLink],
})
export class ScanDetailComponent implements OnInit {
  scan: IScan | null = null;

  // Variables pour gérer la sortie et l'erreur du script
  output: string = '';
  error: string = '';

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    private scriptService: ScriptService, // Ajout du service ici
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scan }) => {
      console.log('Scan data:', scan); // Add this line to verify
      this.scan = scan;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }

  // Méthode pour exécuter le script
  executeScript(): void {
    this.scriptService.runScript('').subscribe({
      next: response => {
        this.output = response.output; // Utilisez la sortie du script
        this.error = ''; // Réinitialisation de l'erreur
      },
      error: err => {
        this.output = ''; // Réinitialisation de la sortie
        this.error = err.error || 'An error occurred'; // Récupération de l'erreur
      },
    });
  }
}
