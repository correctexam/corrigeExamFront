import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GradedCommentDetailComponent } from './graded-comment-detail.component';

describe('GradedComment Management Detail Component', () => {
  let comp: GradedCommentDetailComponent;
  let fixture: ComponentFixture<GradedCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GradedCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ gradedComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GradedCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GradedCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load gradedComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.gradedComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
