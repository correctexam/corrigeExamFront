import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Answer2HybridGradedCommentDetailComponent } from './answer-2-hybrid-graded-comment-detail.component';

describe('Answer2HybridGradedComment Management Detail Component', () => {
  let comp: Answer2HybridGradedCommentDetailComponent;
  let fixture: ComponentFixture<Answer2HybridGradedCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Answer2HybridGradedCommentDetailComponent],
      declarations: [],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ answer2HybridGradedComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Answer2HybridGradedCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Answer2HybridGradedCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load answer2HybridGradedComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.answer2HybridGradedComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
