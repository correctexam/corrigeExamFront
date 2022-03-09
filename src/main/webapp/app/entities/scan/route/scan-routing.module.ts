import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScanComponent } from '../list/scan.component';
import { ScanDetailComponent } from '../detail/scan-detail.component';
import { ScanUpdateComponent } from '../update/scan-update.component';
import { ScanRoutingResolveService } from './scan-routing-resolve.service';

const scanRoute: Routes = [
  {
    path: '',
    component: ScanComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScanDetailComponent,
    resolve: {
      scan: ScanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScanUpdateComponent,
    resolve: {
      scan: ScanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScanUpdateComponent,
    resolve: {
      scan: ScanRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(scanRoute)],
  exports: [RouterModule],
})
export class ScanRoutingModule {}
