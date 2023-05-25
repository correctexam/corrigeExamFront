import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExamSheetComponent } from '../list/exam-sheet.component';
import { ExamSheetDetailComponent } from '../detail/exam-sheet-detail.component';
import { ExamSheetUpdateComponent } from '../update/exam-sheet-update.component';
import { ExamSheetRoutingResolveService } from './exam-sheet-routing-resolve.service';

const examSheetRoute: Routes = [
  {
    path: '',
    component: ExamSheetComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExamSheetDetailComponent,
    resolve: {
      examSheet: ExamSheetRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExamSheetUpdateComponent,
    resolve: {
      examSheet: ExamSheetRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExamSheetUpdateComponent,
    resolve: {
      examSheet: ExamSheetRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(examSheetRoute)],
  exports: [RouterModule],
})
export class ExamSheetRoutingModule {}
