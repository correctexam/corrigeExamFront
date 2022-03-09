import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TemplateComponent } from './list/template.component';
import { TemplateDetailComponent } from './detail/template-detail.component';
import { TemplateUpdateComponent } from './update/template-update.component';
import { TemplateDeleteDialogComponent } from './delete/template-delete-dialog.component';
import { TemplateRoutingModule } from './route/template-routing.module';

@NgModule({
  imports: [SharedModule, TemplateRoutingModule],
  declarations: [TemplateComponent, TemplateDetailComponent, TemplateUpdateComponent, TemplateDeleteDialogComponent],
  entryComponents: [TemplateDeleteDialogComponent],
})
export class TemplateModule {}
