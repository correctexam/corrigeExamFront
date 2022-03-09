import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExamSheetDetailComponent } from './exam-sheet-detail.component';

describe('ExamSheet Management Detail Component', () => {
  let comp: ExamSheetDetailComponent;
  let fixture: ComponentFixture<ExamSheetDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamSheetDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ examSheet: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExamSheetDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExamSheetDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load examSheet on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.examSheet).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
