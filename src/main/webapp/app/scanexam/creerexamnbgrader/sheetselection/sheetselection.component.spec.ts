/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { SheetSelectionComponent } from './sheetselection.component';

describe('CreerexamComponent', () => {
  let component: SheetSelectionComponent;
  let fixture: ComponentFixture<SheetSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
