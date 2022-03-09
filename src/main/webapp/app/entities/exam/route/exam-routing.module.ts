import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExamComponent } from '../list/exam.component';
import { ExamDetailComponent } from '../detail/exam-detail.component';
import { ExamUpdateComponent } from '../update/exam-update.component';
import { ExamRoutingResolveService } from './exam-routing-resolve.service';

const examRoute: Routes = [
  {
    path: '',
    component: ExamComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExamDetailComponent,
    resolve: {
      exam: ExamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExamUpdateComponent,
    resolve: {
      exam: ExamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExamUpdateComponent,
    resolve: {
      exam: ExamRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(examRoute)],
  exports: [RouterModule],
})
export class ExamRoutingModule {}
