import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StudentResponseComponent } from './list/student-response.component';
import { StudentResponseDetailComponent } from './detail/student-response-detail.component';
import { StudentResponseUpdateComponent } from './update/student-response-update.component';
import { StudentResponseDeleteDialogComponent } from './delete/student-response-delete-dialog.component';
import { StudentResponseRoutingModule } from './route/student-response-routing.module';

@NgModule({
  imports: [SharedModule, StudentResponseRoutingModule],
  declarations: [
    StudentResponseComponent,
    StudentResponseDetailComponent,
    StudentResponseUpdateComponent,
    StudentResponseDeleteDialogComponent,
  ],
})
export class StudentResponseModule {}
