import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IComments } from '../comments.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  selector: 'jhi-comments-detail',
  templateUrl: './comments-detail.component.html',
  standalone: true,
  imports: [AlertErrorComponent, AlertComponent, RouterLink, FaIconComponent],
})
export class CommentsDetailComponent implements OnInit {
  comments: IComments | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comments }) => {
      this.comments = comments;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
