import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GradedCommentComponent } from '../list/graded-comment.component';
import { GradedCommentDetailComponent } from '../detail/graded-comment-detail.component';
import { GradedCommentUpdateComponent } from '../update/graded-comment-update.component';
import { GradedCommentRoutingResolveService } from './graded-comment-routing-resolve.service';

const gradedCommentRoute: Routes = [
  {
    path: '',
    component: GradedCommentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GradedCommentDetailComponent,
    resolve: {
      gradedComment: GradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GradedCommentUpdateComponent,
    resolve: {
      gradedComment: GradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GradedCommentUpdateComponent,
    resolve: {
      gradedComment: GradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(gradedCommentRoute)],
  exports: [RouterModule],
})
export class GradedCommentRoutingModule {}
