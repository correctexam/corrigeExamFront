import { Component, Input } from '@angular/core';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prediction-delete-dialog',
  templateUrl: './prediction-delete-dialog.component.html',
})
export class PredictionDeleteDialogComponent {
  @Input() predictionId!: number;
  @Input() predictionText!: string;

  constructor(
    private predictionService: PredictionService,
    private activeModal: NgbActiveModal,
  ) {}

  // Method to confirm the deletion of a prediction
  confirmDelete(): void {
    this.predictionService.delete(this.predictionId).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }

  // Method to cancel the deletion
  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
