import { Component, NgZone, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { EntityArrayResponseType, Answer2HybridGradedCommentService } from '../service/answer-2-hybrid-graded-comment.service';
import { Answer2HybridGradedCommentDeleteDialogComponent } from '../delete/answer-2-hybrid-graded-comment-delete-dialog.component';
import { ITEM_DELETED_EVENT } from 'app/entities/hybrid-graded-comment/delete/hybrid-graded-comment-delete-dialog.component';
import {
  DEFAULT_SORT_DATA,
  PAGE_HEADER,
  SORT,
  TOTAL_COUNT_RESPONSE_HEADER,
} from 'app/entities/hybrid-graded-comment/list/hybrid-graded-comment.component';

@Component({
  selector: 'jhi-answer-2-hybrid-graded-comment',
  templateUrl: './answer-2-hybrid-graded-comment.component.html',
})
export class Answer2HybridGradedCommentComponent implements OnInit {
  answer2HybridGradedComments?: IAnswer2HybridGradedComment[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  constructor(
    protected answer2HybridGradedCommentService: Answer2HybridGradedCommentService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal,
    private zone: NgZone,
  ) {}

  trackId = (_index: number, item: IAnswer2HybridGradedComment): number =>
    this.answer2HybridGradedCommentService.getAnswer2HybridGradedCommentIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(answer2HybridGradedComment: IAnswer2HybridGradedComment): void {
    const modalRef = this.modalService.open(Answer2HybridGradedCommentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.answer2HybridGradedComment = answer2HybridGradedComment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.answer2HybridGradedComments = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IAnswer2HybridGradedComment[] | null): IAnswer2HybridGradedComment[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.answer2HybridGradedCommentService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    this.zone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
