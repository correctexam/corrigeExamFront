import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IHybridGradedComment } from '../hybrid-graded-comment.model';
import { DataUtils } from 'app/core/util/data-util.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from 'app/shared/alert/alert-error.component';
import { AlertComponent } from 'app/shared/alert/alert.component';

@Component({
  standalone: true,
  imports: [FontAwesomeModule, AlertErrorComponent, FormsModule, ReactiveFormsModule, RouterLink, AlertComponent],

  selector: 'jhi-hybrid-graded-comment-detail',
  templateUrl: './hybrid-graded-comment-detail.component.html',
})
export class HybridGradedCommentDetailComponent implements OnInit {
  hybridGradedComment: IHybridGradedComment | null = null;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hybridGradedComment }) => {
      this.hybridGradedComment = hybridGradedComment;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
