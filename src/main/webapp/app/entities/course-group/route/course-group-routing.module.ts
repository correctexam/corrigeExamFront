import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CourseGroupComponent } from '../list/course-group.component';
import { CourseGroupDetailComponent } from '../detail/course-group-detail.component';
import { CourseGroupUpdateComponent } from '../update/course-group-update.component';
import { CourseGroupRoutingResolveService } from './course-group-routing-resolve.service';
import { Routes } from '@angular/router';

export const courseGroupRoute: Routes = [
  {
    path: '',
    component: CourseGroupComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CourseGroupDetailComponent,
    resolve: {
      courseGroup: CourseGroupRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CourseGroupUpdateComponent,
    resolve: {
      courseGroup: CourseGroupRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CourseGroupUpdateComponent,
    resolve: {
      courseGroup: CourseGroupRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];
