import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommentsComponent } from './list/comments.component';
import { CommentsDetailComponent } from './detail/comments-detail.component';
import { CommentsUpdateComponent } from './update/comments-update.component';
import { CommentsDeleteDialogComponent } from './delete/comments-delete-dialog.component';
import { CommentsRoutingModule } from './route/comments-routing.module';

@NgModule({
  imports: [SharedModule, CommentsRoutingModule],
  declarations: [CommentsComponent, CommentsDetailComponent, CommentsUpdateComponent, CommentsDeleteDialogComponent],
  entryComponents: [CommentsDeleteDialogComponent],
})
export class CommentsModule {}
