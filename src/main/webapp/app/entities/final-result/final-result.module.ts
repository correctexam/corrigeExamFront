import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FinalResultComponent } from './list/final-result.component';
import { FinalResultDetailComponent } from './detail/final-result-detail.component';
import { FinalResultUpdateComponent } from './update/final-result-update.component';
import { FinalResultDeleteDialogComponent } from './delete/final-result-delete-dialog.component';
import { FinalResultRoutingModule } from './route/final-result-routing.module';

@NgModule({
  imports: [SharedModule, FinalResultRoutingModule],
  declarations: [FinalResultComponent, FinalResultDetailComponent, FinalResultUpdateComponent, FinalResultDeleteDialogComponent],
})
export class FinalResultModule {}
