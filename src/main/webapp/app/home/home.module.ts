import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { CREERCOURS_ROUTE, HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { MesCoursComponent } from '../mes-cours/mes-cours.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ButtonModule} from 'primeng/button';
import {BlockUIModule} from 'primeng/blockui';
import { MenuModule } from 'primeng/menu';
import { CreercoursComponent } from '../creercours/creercours.component';
import {TooltipModule} from 'primeng/tooltip';
import {DockModule} from 'primeng/dock';
@NgModule({
  imports: [ButtonModule,
    SharedModule, FontAwesomeModule, BlockUIModule, MenuModule, DockModule, TooltipModule, RouterModule.forChild([HOME_ROUTE,CREERCOURS_ROUTE ])],
  declarations: [HomeComponent, MesCoursComponent,CreercoursComponent],
})
export class HomeModule {}
