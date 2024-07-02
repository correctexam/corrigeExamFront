import { AfterContentInit, ContentChild, Directive, Host, HostListener, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

import { SortDirective } from './sort.directive';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Directive({
  selector: '[jhiSortBy]',
  standalone: true,
})
export class SortByDirective<T> implements AfterContentInit, OnDestroy {
  @Input() jhiSortBy!: T;

  @ContentChild(FaIconComponent, { static: false })
  iconComponent?: FaIconComponent;

  sortIcon = faSort as IconProp;
  sortAscIcon = faSortUp as IconProp;
  sortDescIcon = faSortDown as IconProp;

  private readonly destroy$ = new Subject<void>();

  constructor(@Host() private sort: SortDirective<T>) {
    sort.predicateChange.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateIconDefinition());
    sort.ascendingChange.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateIconDefinition());
  }

  @HostListener('click')
  onClick(): void {
    if (this.iconComponent) {
      this.sort.sort(this.jhiSortBy);
    }
  }

  ngAfterContentInit(): void {
    this.updateIconDefinition();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateIconDefinition(): void {
    if (this.iconComponent) {
      let icon = this.sortIcon;
      if (this.sort.predicate === this.jhiSortBy) {
        icon = this.sort.ascending ? this.sortAscIcon : this.sortDescIcon;
      }
      this.iconComponent.icon = icon;
      this.iconComponent.render();
    }
  }
}
