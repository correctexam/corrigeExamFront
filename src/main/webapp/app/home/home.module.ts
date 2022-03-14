import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { COURSMAIN_ROUTE, CREERCOURS_ROUTE, HOME_ROUTE, REGISTERSTUDENT_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { MesCoursComponent } from '../mes-cours/mes-cours.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ButtonModule} from 'primeng/button';
import {BlockUIModule} from 'primeng/blockui';
import { MenuModule } from 'primeng/menu';
import { CreercoursComponent } from '../creercours/creercours.component';
import {TooltipModule} from 'primeng/tooltip';
import {DockModule} from 'primeng/dock';
import { CoursdetailsComponent } from '../coursdetail/coursdetails.component';
import { ImportStudentComponent } from '../import-student/import-student.component';
import { HotTableModule } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import {SliderModule} from 'primeng/slider';
import {ToastModule} from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

registerAllModules();

@NgModule({
  imports: [BrowserAnimationsModule,ButtonModule,
    SharedModule, FontAwesomeModule, BlockUIModule, MenuModule, DockModule, TooltipModule,
    ToastModule,
    SliderModule,
    HotTableModule,
    ConfirmDialogModule,
    RouterModule.forChild([HOME_ROUTE,CREERCOURS_ROUTE,COURSMAIN_ROUTE,REGISTERSTUDENT_ROUTE ])],
  declarations: [HomeComponent, MesCoursComponent,CreercoursComponent,CoursdetailsComponent,ImportStudentComponent],
})
export class HomeModule {}
