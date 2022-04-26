import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TextCommentComponent } from '../list/text-comment.component';
import { TextCommentDetailComponent } from '../detail/text-comment-detail.component';
import { TextCommentUpdateComponent } from '../update/text-comment-update.component';
import { TextCommentRoutingResolveService } from './text-comment-routing-resolve.service';

const textCommentRoute: Routes = [
  {
    path: '',
    component: TextCommentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TextCommentDetailComponent,
    resolve: {
      textComment: TextCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TextCommentUpdateComponent,
    resolve: {
      textComment: TextCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TextCommentUpdateComponent,
    resolve: {
      textComment: TextCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(textCommentRoute)],
  exports: [RouterModule],
})
export class TextCommentRoutingModule {}
