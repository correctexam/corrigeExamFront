import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ZoneDetailComponent } from './zone-detail.component';

describe('Zone Management Detail Component', () => {
  let comp: ZoneDetailComponent;
  let fixture: ComponentFixture<ZoneDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoneDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ zone: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ZoneDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ZoneDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load zone on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.zone).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
