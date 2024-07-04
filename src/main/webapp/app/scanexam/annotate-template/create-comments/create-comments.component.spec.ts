import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { CreateCommentsComponent } from './create-comments.component';

describe('CreateCommentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCommentsComponent],
    }).compileComponents();
  });

  it('should create', () => {
    expect(true);
  });
});
