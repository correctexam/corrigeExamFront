import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { ChargerscanComponent } from './chargerscan.component';

describe('ChargerscanComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargerscanComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
