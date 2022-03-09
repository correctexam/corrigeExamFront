import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StudentComponent } from '../list/student.component';
import { StudentDetailComponent } from '../detail/student-detail.component';
import { StudentUpdateComponent } from '../update/student-update.component';
import { StudentRoutingResolveService } from './student-routing-resolve.service';

const studentRoute: Routes = [
  {
    path: '',
    component: StudentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentDetailComponent,
    resolve: {
      student: StudentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentUpdateComponent,
    resolve: {
      student: StudentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentUpdateComponent,
    resolve: {
      student: StudentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(studentRoute)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
