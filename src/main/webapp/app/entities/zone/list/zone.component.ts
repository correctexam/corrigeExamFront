import { Component, NgZone, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

import { IZone } from '../zone.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { ZoneService } from '../service/zone.service';
import { ZoneDeleteDialogComponent } from '../delete/zone-delete-dialog.component';
import { ItemCountComponent } from '../../../shared/pagination/item-count.component';
import { SortByDirective } from '../../../shared/sort/sort-by.directive';
import { SortDirective } from '../../../shared/sort/sort.directive';

import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'jhi-zone',
  templateUrl: './zone.component.html',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink,
    AlertErrorComponent,
    AlertComponent,
    SortDirective,
    SortByDirective,
    ItemCountComponent,
    NgbPagination,
  ],
})
export class ZoneComponent implements OnInit {
  zones?: IZone[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected zoneService: ZoneService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected zone: NgZone,
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.zoneService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IZone[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: IZone): number {
    return item.id!;
  }

  delete(zone: IZone): void {
    const modalRef = this.modalService.open(ZoneDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.zone = zone;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IZone[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.zone.run(() => {
        this.router.navigate(['/zone'], {
          queryParams: {
            page: this.page,
            size: this.itemsPerPage,
            sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
          },
        });
      });
    }
    this.zones = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
