import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CourseComponent } from '../list/course.component';
import { CourseDetailComponent } from '../detail/course-detail.component';
import { CourseUpdateComponent } from '../update/course-update.component';
import { CourseRoutingResolveService } from './course-routing-resolve.service';

export const courseRoute: Routes = [
  {
    path: '',
    component: CourseComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CourseDetailComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    resolve: {
      course: CourseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CourseUpdateComponent,
    resolve: {
      course: CourseRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CourseUpdateComponent,
    resolve: {
      course: CourseRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];
