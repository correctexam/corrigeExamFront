import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: 'user-management',
    loadChildren: () => import('./user-management/user-management.route').then(m => m.userManagementRoute),
    data: {
      pageTitle: 'userManagement.home.title',
    },
  },
  {
    path: 'docs',
    loadChildren: () => import('./docs/docs.route').then(m => m.docsRoute),
  },
  {
    path: 'configuration',
    loadChildren: () => import('./configuration/configuration.route').then(m => m.configurationRoute),
  },
  {
    path: 'health',
    loadChildren: () => import('./health/health.route').then(m => m.healthRoute),
  },
  {
    path: 'logs',
    loadChildren: () => import('./logs/logs.route').then(m => m.logsRoute),
  },
  {
    path: 'metrics',
    loadChildren: () => import('./metrics/metrics.route').then(m => m.metricsRoute),
  },
  /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
];
