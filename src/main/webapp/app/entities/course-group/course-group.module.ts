import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CourseGroupComponent } from './list/course-group.component';
import { CourseGroupDetailComponent } from './detail/course-group-detail.component';
import { CourseGroupUpdateComponent } from './update/course-group-update.component';
import { CourseGroupDeleteDialogComponent } from './delete/course-group-delete-dialog.component';
import { CourseGroupRoutingModule } from './route/course-group-routing.module';

@NgModule({
  imports: [SharedModule, CourseGroupRoutingModule],
  declarations: [CourseGroupComponent, CourseGroupDetailComponent, CourseGroupUpdateComponent, CourseGroupDeleteDialogComponent],
})
export class CourseGroupModule {}
