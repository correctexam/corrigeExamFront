import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TextCommentDetailComponent } from './text-comment-detail.component';

describe('TextComment Management Detail Component', () => {
  let comp: TextCommentDetailComponent;
  let fixture: ComponentFixture<TextCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ textComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TextCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TextCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load textComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.textComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
