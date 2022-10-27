import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GradedCommentComponent } from './list/graded-comment.component';
import { GradedCommentDetailComponent } from './detail/graded-comment-detail.component';
import { GradedCommentUpdateComponent } from './update/graded-comment-update.component';
import { GradedCommentDeleteDialogComponent } from './delete/graded-comment-delete-dialog.component';
import { GradedCommentRoutingModule } from './route/graded-comment-routing.module';

@NgModule({
  imports: [SharedModule, GradedCommentRoutingModule],
  declarations: [GradedCommentComponent, GradedCommentDetailComponent, GradedCommentUpdateComponent, GradedCommentDeleteDialogComponent],
})
export class GradedCommentModule {}
