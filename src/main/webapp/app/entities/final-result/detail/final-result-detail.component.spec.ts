import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinalResultDetailComponent } from './final-result-detail.component';

describe('FinalResult Management Detail Component', () => {
  let comp: FinalResultDetailComponent;
  let fixture: ComponentFixture<FinalResultDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FinalResultDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ finalResult: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FinalResultDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinalResultDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load finalResult on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.finalResult).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
