import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StudentResponseComponent } from '../list/student-response.component';
import { StudentResponseDetailComponent } from '../detail/student-response-detail.component';
import { StudentResponseUpdateComponent } from '../update/student-response-update.component';
import { StudentResponseRoutingResolveService } from './student-response-routing-resolve.service';

export const studentResponseRoute: Routes = [
  {
    path: '',
    component: StudentResponseComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentResponseDetailComponent,
    resolve: {
      studentResponse: StudentResponseRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentResponseUpdateComponent,
    resolve: {
      studentResponse: StudentResponseRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentResponseUpdateComponent,
    resolve: {
      studentResponse: StudentResponseRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];
