import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ScanComponent } from './list/scan.component';
import { ScanDetailComponent } from './detail/scan-detail.component';
import { ScanUpdateComponent } from './update/scan-update.component';
import { ScanDeleteDialogComponent } from './delete/scan-delete-dialog.component';
import { ScanRoutingModule } from './route/scan-routing.module';

@NgModule({
  imports: [SharedModule, ScanRoutingModule],
  declarations: [ScanComponent, ScanDetailComponent, ScanUpdateComponent, ScanDeleteDialogComponent],
  entryComponents: [ScanDeleteDialogComponent],
})
export class ScanModule {}
