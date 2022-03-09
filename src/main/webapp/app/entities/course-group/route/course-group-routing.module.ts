import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CourseGroupComponent } from '../list/course-group.component';
import { CourseGroupDetailComponent } from '../detail/course-group-detail.component';
import { CourseGroupUpdateComponent } from '../update/course-group-update.component';
import { CourseGroupRoutingResolveService } from './course-group-routing-resolve.service';

const courseGroupRoute: Routes = [
  {
    path: '',
    component: CourseGroupComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CourseGroupDetailComponent,
    resolve: {
      courseGroup: CourseGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CourseGroupUpdateComponent,
    resolve: {
      courseGroup: CourseGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CourseGroupUpdateComponent,
    resolve: {
      courseGroup: CourseGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(courseGroupRoute)],
  exports: [RouterModule],
})
export class CourseGroupRoutingModule {}
