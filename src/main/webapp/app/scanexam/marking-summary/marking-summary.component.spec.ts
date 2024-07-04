/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { MarkingSummaryComponent } from './marking-summary.component';

describe('MarkingSummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkingSummaryComponent],
    }).compileComponents();
  });
  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
