import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ZoneComponent } from '../list/zone.component';
import { ZoneDetailComponent } from '../detail/zone-detail.component';
import { ZoneUpdateComponent } from '../update/zone-update.component';
import { ZoneRoutingResolveService } from './zone-routing-resolve.service';

const zoneRoute: Routes = [
  {
    path: '',
    component: ZoneComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ZoneDetailComponent,
    resolve: {
      zone: ZoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ZoneUpdateComponent,
    resolve: {
      zone: ZoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ZoneUpdateComponent,
    resolve: {
      zone: ZoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(zoneRoute)],
  exports: [RouterModule],
})
export class ZoneRoutingModule {}
