import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TextCommentComponent } from './list/text-comment.component';
import { TextCommentDetailComponent } from './detail/text-comment-detail.component';
import { TextCommentUpdateComponent } from './update/text-comment-update.component';
import { TextCommentDeleteDialogComponent } from './delete/text-comment-delete-dialog.component';
import { TextCommentRoutingModule } from './route/text-comment-routing.module';

@NgModule({
  imports: [SharedModule, TextCommentRoutingModule],
  declarations: [TextCommentComponent, TextCommentDetailComponent, TextCommentUpdateComponent, TextCommentDeleteDialogComponent],
})
export class TextCommentModule {}
