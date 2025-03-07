import { Component, Input } from '@angular/core';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-prediction-delete-dialog',
  templateUrl: './prediction-delete-dialog.component.html',
  standalone: true,
})
export class PredictionDeleteDialogComponent {
  @Input() predictionId!: number;
  @Input() predictionText!: string;

  constructor(
    private predictionService: PredictionService,
    private activeModal: NgbActiveModal,
  ) {}

  // Method to confirm the deletion of a prediction
  async confirmDelete(): Promise<void> {
    await firstValueFrom(this.predictionService.delete(this.predictionId));
    this.activeModal.close('deleted');
  }

  // Method to cancel the deletion
  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
