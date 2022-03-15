import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HOME_ROUTE, } from './home.route';
import { HomeComponent } from './home.component';
import { ScanexamModule } from '../scanexam/scanexam.module';
import {DockModule} from 'primeng/dock';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,ButtonModule,
    SharedModule,
    ScanexamModule,DockModule,
    RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
})
export class HomeModule {}
