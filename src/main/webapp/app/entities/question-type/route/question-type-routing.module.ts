import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QuestionTypeComponent } from '../list/question-type.component';
import { QuestionTypeDetailComponent } from '../detail/question-type-detail.component';
import { QuestionTypeUpdateComponent } from '../update/question-type-update.component';
import { QuestionTypeRoutingResolveService } from './question-type-routing-resolve.service';

const questionTypeRoute: Routes = [
  {
    path: '',
    component: QuestionTypeComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QuestionTypeDetailComponent,
    resolve: {
      questionType: QuestionTypeRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },

    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QuestionTypeUpdateComponent,
    resolve: {
      questionType: QuestionTypeRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QuestionTypeUpdateComponent,
    resolve: {
      questionType: QuestionTypeRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(questionTypeRoute)],
  exports: [RouterModule],
})
export class QuestionTypeRoutingModule {}
