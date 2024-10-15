import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { VoirReponsesStarUnstarComponent } from './voirreponsesstarunstarexam.component';

describe('VoirCopieComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirReponsesStarUnstarComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
