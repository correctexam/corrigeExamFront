import { TestBed } from '@angular/core/testing';

import { TextCommentUpdateComponent } from './text-comment-update.component';

describe('TextComment Management Update Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextCommentUpdateComponent],
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
