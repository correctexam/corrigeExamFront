import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StudentResponseComponent } from '../list/student-response.component';
import { StudentResponseDetailComponent } from '../detail/student-response-detail.component';
import { StudentResponseUpdateComponent } from '../update/student-response-update.component';
import { StudentResponseRoutingResolveService } from './student-response-routing-resolve.service';

const studentResponseRoute: Routes = [
  {
    path: '',
    component: StudentResponseComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentResponseDetailComponent,
    resolve: {
      studentResponse: StudentResponseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentResponseUpdateComponent,
    resolve: {
      studentResponse: StudentResponseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentResponseUpdateComponent,
    resolve: {
      studentResponse: StudentResponseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(studentResponseRoute)],
  exports: [RouterModule],
})
export class StudentResponseRoutingModule {}
