import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FinalResultComponent } from '../list/final-result.component';
import { FinalResultDetailComponent } from '../detail/final-result-detail.component';
import { FinalResultUpdateComponent } from '../update/final-result-update.component';
import { FinalResultRoutingResolveService } from './final-result-routing-resolve.service';

const finalResultRoute: Routes = [
  {
    path: '',
    component: FinalResultComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinalResultDetailComponent,
    resolve: {
      finalResult: FinalResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinalResultUpdateComponent,
    resolve: {
      finalResult: FinalResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinalResultUpdateComponent,
    resolve: {
      finalResult: FinalResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(finalResultRoute)],
  exports: [RouterModule],
})
export class FinalResultRoutingModule {}
