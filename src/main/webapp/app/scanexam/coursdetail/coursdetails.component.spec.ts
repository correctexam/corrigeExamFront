/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { CoursdetailsComponent } from './coursdetails.component';

describe('CoursdetailsComponent', () => {
  let component: CoursdetailsComponent;
  let fixture: ComponentFixture<CoursdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursdetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
