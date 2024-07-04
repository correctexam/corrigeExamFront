import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CourseDetailComponent } from './course-detail.component';

describe('Course Management Detail Component', () => {
  let comp: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ course: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CourseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CourseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load course on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.course).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
