import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommentsDetailComponent } from './comments-detail.component';

describe('Comments Management Detail Component', () => {
  let comp: CommentsDetailComponent;
  let fixture: ComponentFixture<CommentsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ comments: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CommentsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CommentsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load comments on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.comments).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
