import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HybridGradedCommentComponent } from '../list/hybrid-graded-comment.component';
import { HybridGradedCommentDetailComponent } from '../detail/hybrid-graded-comment-detail.component';
import { HybridGradedCommentUpdateComponent } from '../update/hybrid-graded-comment-update.component';
import { HybridGradedCommentRoutingResolveService } from './hybrid-graded-comment-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const hybridGradedCommentRoute: Routes = [
  {
    path: '',
    component: HybridGradedCommentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HybridGradedCommentDetailComponent,
    resolve: {
      hybridGradedComment: HybridGradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HybridGradedCommentUpdateComponent,
    resolve: {
      hybridGradedComment: HybridGradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HybridGradedCommentUpdateComponent,
    resolve: {
      hybridGradedComment: HybridGradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(hybridGradedCommentRoute)],
  exports: [RouterModule],
})
export class HybridGradedCommentRoutingModule {}
