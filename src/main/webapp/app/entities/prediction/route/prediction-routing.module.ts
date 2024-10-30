import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredictionListComponent } from '../list/list.component';
import { PredictionDetailComponent } from '../detail/prediction-detail.component';
import { PredictionUpdateComponent } from '../update/prediction-update.component';
import { PredictionDeleteDialogComponent } from '../delete/prediction-delete-dialog.component';
import { PredictionRoutingResolveService } from './prediction-routing-resolve.service';

const predictionRoute: Routes = [
  {
    path: '',
    component: PredictionListComponent,
    data: {
      pageTitle: 'Predictions',
    },
  },
  {
    path: ':id/view',
    component: PredictionDetailComponent,
    resolve: {
      prediction: PredictionRoutingResolveService,
    },
    data: {
      pageTitle: 'Prediction Details',
    },
  },
  {
    path: ':id/edit',
    component: PredictionUpdateComponent,
    resolve: {
      prediction: PredictionRoutingResolveService,
    },
    data: {
      pageTitle: 'Edit Prediction',
    },
  },
  {
    path: ':id/delete',
    component: PredictionDeleteDialogComponent,
    resolve: {
      prediction: PredictionRoutingResolveService,
    },
    outlet: 'popup',
    data: {
      pageTitle: 'Delete Prediction',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(predictionRoute)],
  exports: [RouterModule],
})
export class PredictionRoutingModule {}
