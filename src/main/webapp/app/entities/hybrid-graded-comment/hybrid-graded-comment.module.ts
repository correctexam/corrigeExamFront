import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HybridGradedCommentComponent } from './list/hybrid-graded-comment.component';
import { HybridGradedCommentDetailComponent } from './detail/hybrid-graded-comment-detail.component';
import { HybridGradedCommentUpdateComponent } from './update/hybrid-graded-comment-update.component';
import { HybridGradedCommentDeleteDialogComponent } from './delete/hybrid-graded-comment-delete-dialog.component';
import { HybridGradedCommentRoutingModule } from './route/hybrid-graded-comment-routing.module';

@NgModule({
  imports: [SharedModule, HybridGradedCommentRoutingModule],
  declarations: [
    HybridGradedCommentComponent,
    HybridGradedCommentDetailComponent,
    HybridGradedCommentUpdateComponent,
    HybridGradedCommentDeleteDialogComponent,
  ],
})
export class HybridGradedCommentModule {}
