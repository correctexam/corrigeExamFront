import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { CreercoursComponent } from '../creercours/creercours.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
  },
};

export const CREERCOURS_ROUTE: Route = {
  path: 'creercours',
  component: CreercoursComponent,
  data: {
    pageTitle: 'home.creercours',
  },
};
