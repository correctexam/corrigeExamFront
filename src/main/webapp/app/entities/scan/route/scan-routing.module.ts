import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScanComponent } from '../list/scan.component';
import { ScanDetailComponent } from '../detail/scan-detail.component';
import { ScanUpdateComponent } from '../update/scan-update.component';
import { ScanRoutingResolveService } from './scan-routing-resolve.service';

export const scanRoute: Routes = [
  {
    path: '',
    component: ScanComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScanDetailComponent,
    resolve: {
      scan: ScanRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScanUpdateComponent,
    resolve: {
      scan: ScanRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScanUpdateComponent,
    resolve: {
      scan: ScanRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];
