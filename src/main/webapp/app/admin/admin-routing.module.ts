import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

export const ROUTES: Route[] = [
  {
    path: 'user-management',
    loadChildren: () => import('./user-management/user-management.route').then(m => m.userManagementRoute),
    data: {
      pageTitle: 'userManagement.home.title',
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    // Intentionally open to any authenticated user (shows the Swagger UI / OpenAPI docs).
    path: 'docs',
    loadChildren: () => import('./docs/docs.route').then(m => m.docsRoute),
  },
  {
    path: 'configuration',
    loadChildren: () => import('./configuration/configuration.route').then(m => m.configurationRoute),
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  {
    path: 'health',
    loadChildren: () => import('./health/health.route').then(m => m.healthRoute),
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  {
    path: 'logs',
    loadChildren: () => import('./logs/logs.route').then(m => m.logsRoute),
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  {
    path: 'metrics',
    loadChildren: () => import('./metrics/metrics.route').then(m => m.metricsRoute),
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.ADMIN],
    },
  },
  /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
];
