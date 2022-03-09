import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CourseComponent } from './list/course.component';
import { CourseDetailComponent } from './detail/course-detail.component';
import { CourseUpdateComponent } from './update/course-update.component';
import { CourseDeleteDialogComponent } from './delete/course-delete-dialog.component';
import { CourseRoutingModule } from './route/course-routing.module';

@NgModule({
  imports: [SharedModule, CourseRoutingModule],
  declarations: [CourseComponent, CourseDetailComponent, CourseUpdateComponent, CourseDeleteDialogComponent],
  entryComponents: [CourseDeleteDialogComponent],
})
export class CourseModule {}
