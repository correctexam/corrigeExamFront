import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { PreferencePageComponent } from './preference-page.component';

describe('PreferencePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
