import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { AlignScanComponent } from './alignscan.component';

describe('AssocierCopiesEtudiantsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlignScanComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
