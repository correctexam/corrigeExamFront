import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QuestionComponent } from '../list/question.component';
import { QuestionDetailComponent } from '../detail/question-detail.component';
import { QuestionUpdateComponent } from '../update/question-update.component';
import { QuestionRoutingResolveService } from './question-routing-resolve.service';

const questionRoute: Routes = [
  {
    path: '',
    component: QuestionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QuestionDetailComponent,
    resolve: {
      question: QuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QuestionUpdateComponent,
    resolve: {
      question: QuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QuestionUpdateComponent,
    resolve: {
      question: QuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(questionRoute)],
  exports: [RouterModule],
})
export class QuestionRoutingModule {}
