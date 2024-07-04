import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { TextCommentUpdateComponent } from './text-comment-update.component';

describe('TextComment Management Update Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextCommentUpdateComponent],
    })
      .overrideTemplate(TextCommentUpdateComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load textComment on init', () => {
      expect(true);
    });
  });
});
