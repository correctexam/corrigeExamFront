import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { QuestionTypeComponent } from './list/question-type.component';
import { QuestionTypeDetailComponent } from './detail/question-type-detail.component';
import { QuestionTypeUpdateComponent } from './update/question-type-update.component';
import { QuestionTypeDeleteDialogComponent } from './delete/question-type-delete-dialog.component';
import { QuestionTypeRoutingModule } from './route/question-type-routing.module';

@NgModule({
  imports: [SharedModule, QuestionTypeRoutingModule],
  declarations: [QuestionTypeComponent, QuestionTypeDetailComponent, QuestionTypeUpdateComponent, QuestionTypeDeleteDialogComponent],
})
export class QuestionTypeModule {}
