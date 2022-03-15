import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesCoursComponent } from './mes-cours/mes-cours.component';
import { CreercoursComponent } from './creercours/creercours.component';
import { CoursdetailsComponent } from './coursdetail/coursdetails.component';
import { ImportStudentComponent } from './import-student/import-student.component';
import { ListstudentcourseComponent } from './liststudentcourse/liststudentcourse.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ButtonModule} from 'primeng/button';
import {BlockUIModule} from 'primeng/blockui';
import { MenuModule } from 'primeng/menu';
import {TooltipModule} from 'primeng/tooltip';
import {DockModule} from 'primeng/dock';
import { HotTableModule } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import {SliderModule} from 'primeng/slider';
import {ToastModule} from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';


registerAllModules();


export const COURSMAIN_ROUTE: Route = {
  path: 'course/:courseid',
  component: CoursdetailsComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.creercours',
  },
};

export const CREERCOURS_ROUTE: Route = {
  path: 'creercours',
  component: CreercoursComponent,
  data: {
    pageTitle: 'home.creercours',
  },
};

export const REGISTERSTUDENT_ROUTE: Route = {
  path: 'registerstudents/:courseid',
  component: ImportStudentComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.creercours',
  },
};

export const LISTESTUDENT_ROUTE: Route = {
  path: 'liststudents/:courseid',
  component: ListstudentcourseComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.creercours',
  },
};


@NgModule({
  declarations: [ MesCoursComponent,CreercoursComponent,CoursdetailsComponent,ImportStudentComponent,ListstudentcourseComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,ButtonModule,
    SharedModule, FontAwesomeModule, BlockUIModule, MenuModule, DockModule, TooltipModule,
    ToastModule,
    SliderModule,
    HotTableModule,
    TableModule,
    ConfirmDialogModule,
    RouterModule.forChild([CREERCOURS_ROUTE,COURSMAIN_ROUTE,REGISTERSTUDENT_ROUTE,LISTESTUDENT_ROUTE ])
  ],
  exports:[ MesCoursComponent,CreercoursComponent,CoursdetailsComponent,ImportStudentComponent,ListstudentcourseComponent]
})
export class ScanexamModule { }
