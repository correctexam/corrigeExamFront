import { Route } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
// import { DEBUG_INFO_ENABLED } from 'app/app.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

export const APP_ROUTES: Route[] = [
  {
    path: 'admin',
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.ROUTES),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route').then(m => m.accountState),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.route').then(m => m.LOGIN_ROUTE),
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.ENTITIES_ROUTES),
  },
  ...navbarRoute,
  ...errorRoute,
];
