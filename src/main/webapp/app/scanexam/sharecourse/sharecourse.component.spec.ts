import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { SharecourseComponent } from './sharecourse.component';

describe('SharecourseComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharecourseComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
