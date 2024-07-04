import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QuestionTypeDetailComponent } from './question-type-detail.component';

describe('QuestionType Management Detail Component', () => {
  let comp: QuestionTypeDetailComponent;
  let fixture: ComponentFixture<QuestionTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestionTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ questionType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(QuestionTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(QuestionTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load questionType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.questionType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
