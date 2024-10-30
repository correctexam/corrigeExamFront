import { Component, Input } from '@angular/core';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prediction-delete-dialog',
  templateUrl: './prediction-delete-dialog.component.html',
})
export class PredictionDetailComponent {
  @Input() predictionId!: number; // The ID of the prediction to delete
  @Input() predictionText!: string; // Text of the prediction (for display purposes)

  constructor(
    private predictionService: PredictionService,
    private activeModal: NgbActiveModal,
  ) {}

  // Method to confirm deletion of a prediction
  confirmDelete(): void {
    this.predictionService.delete(this.predictionId).subscribe(() => {
      // Closes the modal and sends a 'deleted' signal back to the parent component
      this.activeModal.close('deleted');
    });
  }

  // Method to cancel the deletion action
  cancel(): void {
    // Dismisses the modal without any changes
    this.activeModal.dismiss('cancel');
  }
}
