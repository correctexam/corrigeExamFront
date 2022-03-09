import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExamComponent } from './list/exam.component';
import { ExamDetailComponent } from './detail/exam-detail.component';
import { ExamUpdateComponent } from './update/exam-update.component';
import { ExamDeleteDialogComponent } from './delete/exam-delete-dialog.component';
import { ExamRoutingModule } from './route/exam-routing.module';

@NgModule({
  imports: [SharedModule, ExamRoutingModule],
  declarations: [ExamComponent, ExamDetailComponent, ExamUpdateComponent, ExamDeleteDialogComponent],
  entryComponents: [ExamDeleteDialogComponent],
})
export class ExamModule {}
