import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CourseGroupDetailComponent } from './course-group-detail.component';

describe('CourseGroup Management Detail Component', () => {
  let comp: CourseGroupDetailComponent;
  let fixture: ComponentFixture<CourseGroupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseGroupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ courseGroup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CourseGroupDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CourseGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load courseGroup on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.courseGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
