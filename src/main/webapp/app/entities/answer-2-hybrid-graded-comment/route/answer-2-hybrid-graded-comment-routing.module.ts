import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Answer2HybridGradedCommentComponent } from '../list/answer-2-hybrid-graded-comment.component';
import { Answer2HybridGradedCommentDetailComponent } from '../detail/answer-2-hybrid-graded-comment-detail.component';
import { Answer2HybridGradedCommentUpdateComponent } from '../update/answer-2-hybrid-graded-comment-update.component';
import { Answer2HybridGradedCommentRoutingResolveService } from './answer-2-hybrid-graded-comment-routing-resolve.service';
import { ASC } from 'app/config/pagination.constants';

export const answer2HybridGradedCommentRoute: Routes = [
  {
    path: '',
    component: Answer2HybridGradedCommentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Answer2HybridGradedCommentDetailComponent,
    resolve: {
      answer2HybridGradedComment: Answer2HybridGradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Answer2HybridGradedCommentUpdateComponent,
    resolve: {
      answer2HybridGradedComment: Answer2HybridGradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Answer2HybridGradedCommentUpdateComponent,
    resolve: {
      answer2HybridGradedComment: Answer2HybridGradedCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];
