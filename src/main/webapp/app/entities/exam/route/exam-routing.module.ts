import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExamComponent } from '../list/exam.component';
import { ExamDetailComponent } from '../detail/exam-detail.component';
import { ExamUpdateComponent } from '../update/exam-update.component';
import { ExamRoutingResolveService } from './exam-routing-resolve.service';
import { Routes } from '@angular/router';

export const examRoute: Routes = [
  {
    path: '',
    component: ExamComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExamDetailComponent,
    resolve: {
      exam: ExamRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },

    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExamUpdateComponent,
    resolve: {
      exam: ExamRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExamUpdateComponent,
    resolve: {
      exam: ExamRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];
