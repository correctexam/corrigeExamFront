import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { By } from '@angular/platform-browser';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

import { SortByDirective } from './sort-by.directive';
import { SortDirective } from './sort.directive';

@Component({
  template: `
    <table>
      <thead>
        <tr jhiSort [(predicate)]="predicate" [(ascending)]="ascending" (sortChange)="transition($event)">
          <th jhiSortBy="name">
            ID
            @if (sortAllowed) {
              <fa-icon [icon]="'sort'"></fa-icon>
            }
          </th>
        </tr>
      </thead>
    </table>
  `,
  imports: [FaIconComponent, SortDirective, SortByDirective],
  standalone: true,
})
class TestSortByDirectiveComponent {
  predicate?: string;
  ascending?: boolean;
  sortAllowed = true;
  transition = jest.fn();

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faSort, faSortDown, faSortUp);
  }
}

describe('Directive: SortByDirective', () => {
  let component: TestSortByDirectiveComponent;
  let fixture: ComponentFixture<TestSortByDirectiveComponent>;
  let tableHead: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [FaIconComponent, TestSortByDirectiveComponent],
    });
    fixture = TestBed.createComponent(TestSortByDirectiveComponent);
    component = fixture.componentInstance;
    tableHead = fixture.debugElement.query(By.directive(SortByDirective));
  });

  it('should not run sorting on click if sorting icon is hidden', () => {
    // GIVEN
    component.predicate = 'id';
    component.ascending = false;
    component.sortAllowed = false;

    // WHEN
    fixture.detectChanges();

    tableHead.triggerEventHandler('click', null);
    fixture.detectChanges();

    // THEN
    expect(component.predicate).toEqual('id');
    expect(component.ascending).toEqual(false);
    expect(component.transition).not.toHaveBeenCalled();
  });
});
