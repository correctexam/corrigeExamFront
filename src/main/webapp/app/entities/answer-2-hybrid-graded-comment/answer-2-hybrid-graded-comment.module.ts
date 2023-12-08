import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Answer2HybridGradedCommentComponent } from './list/answer-2-hybrid-graded-comment.component';
import { Answer2HybridGradedCommentDetailComponent } from './detail/answer-2-hybrid-graded-comment-detail.component';
import { Answer2HybridGradedCommentUpdateComponent } from './update/answer-2-hybrid-graded-comment-update.component';
import { Answer2HybridGradedCommentDeleteDialogComponent } from './delete/answer-2-hybrid-graded-comment-delete-dialog.component';
import { Answer2HybridGradedCommentRoutingModule } from './route/answer-2-hybrid-graded-comment-routing.module';

@NgModule({
  imports: [SharedModule, Answer2HybridGradedCommentRoutingModule],
  declarations: [
    Answer2HybridGradedCommentComponent,
    Answer2HybridGradedCommentDetailComponent,
    Answer2HybridGradedCommentUpdateComponent,
    Answer2HybridGradedCommentDeleteDialogComponent,
  ],
})
export class Answer2HybridGradedCommentModule {}
