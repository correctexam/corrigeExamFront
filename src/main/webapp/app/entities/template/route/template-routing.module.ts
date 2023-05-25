import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TemplateComponent } from '../list/template.component';
import { TemplateDetailComponent } from '../detail/template-detail.component';
import { TemplateUpdateComponent } from '../update/template-update.component';
import { TemplateRoutingResolveService } from './template-routing-resolve.service';

const templateRoute: Routes = [
  {
    path: '',
    component: TemplateComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TemplateDetailComponent,
    resolve: {
      template: TemplateRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TemplateUpdateComponent,
    resolve: {
      template: TemplateRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TemplateUpdateComponent,
    resolve: {
      template: TemplateRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(templateRoute)],
  exports: [RouterModule],
})
export class TemplateRoutingModule {}
