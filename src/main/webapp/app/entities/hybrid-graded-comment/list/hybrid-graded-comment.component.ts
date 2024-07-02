import { Component, NgZone, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterLink } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

import { IHybridGradedComment } from '../hybrid-graded-comment.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

import { EntityArrayResponseType, HybridGradedCommentService } from '../service/hybrid-graded-comment.service';
import { HybridGradedCommentDeleteDialogComponent } from '../delete/hybrid-graded-comment-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertErrorComponent } from 'app/shared/alert/alert-error.component';
import { ItemCountComponent } from 'app/shared/pagination/item-count.component';
import { AlertComponent } from 'app/shared/alert/alert.component';
import { SortDirective } from 'app/shared/sort/sort.directive';

export const ITEM_DELETED_EVENT = 'deleted';
export const ASC = 'asc';
export const DESC = 'desc';
export const SORT = 'sort';
export const DEFAULT_SORT_DATA = 'defaultSort';

export const TOTAL_COUNT_RESPONSE_HEADER = 'X-Total-Count';
export const PAGE_HEADER = 'page';

@Component({
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgFor,
    AlertErrorComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ItemCountComponent,
    NgbPagination,
    AlertComponent,
    SortDirective,
  ],

  selector: 'jhi-hybrid-graded-comment',
  templateUrl: './hybrid-graded-comment.component.html',
})
export class HybridGradedCommentComponent implements OnInit {
  hybridGradedComments?: IHybridGradedComment[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  constructor(
    protected hybridGradedCommentService: HybridGradedCommentService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    private zone: NgZone,
  ) {}

  trackId = (_index: number, item: IHybridGradedComment): number => this.hybridGradedCommentService.getHybridGradedCommentIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(hybridGradedComment: IHybridGradedComment): void {
    const modalRef = this.modalService.open(HybridGradedCommentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.hybridGradedComment = hybridGradedComment;
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
    this.hybridGradedComments = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IHybridGradedComment[] | null): IHybridGradedComment[] {
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
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.hybridGradedCommentService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
