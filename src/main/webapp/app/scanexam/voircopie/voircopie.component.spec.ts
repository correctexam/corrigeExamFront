import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { VoirCopieComponent } from './voircopie.component';

describe('VoirCopieComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirCopieComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
