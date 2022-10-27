import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExamSheetComponent } from './list/exam-sheet.component';
import { ExamSheetDetailComponent } from './detail/exam-sheet-detail.component';
import { ExamSheetUpdateComponent } from './update/exam-sheet-update.component';
import { ExamSheetDeleteDialogComponent } from './delete/exam-sheet-delete-dialog.component';
import { ExamSheetRoutingModule } from './route/exam-sheet-routing.module';

@NgModule({
  imports: [SharedModule, ExamSheetRoutingModule],
  declarations: [ExamSheetComponent, ExamSheetDetailComponent, ExamSheetUpdateComponent, ExamSheetDeleteDialogComponent],
})
export class ExamSheetModule {}
