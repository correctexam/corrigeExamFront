import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommentsComponent } from '../list/comments.component';
import { CommentsDetailComponent } from '../detail/comments-detail.component';
import { CommentsUpdateComponent } from '../update/comments-update.component';
import { CommentsRoutingResolveService } from './comments-routing-resolve.service';

export const commentsRoute: Routes = [
  {
    path: '',
    component: CommentsComponent,
    data: {
      defaultSort: 'id,asc',
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommentsDetailComponent,
    resolve: {
      comments: CommentsRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },

    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommentsUpdateComponent,
    resolve: {
      comments: CommentsRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommentsUpdateComponent,
    resolve: {
      comments: CommentsRoutingResolveService,
    },
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];
