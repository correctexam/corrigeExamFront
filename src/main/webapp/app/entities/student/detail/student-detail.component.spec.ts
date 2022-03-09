import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';

describe('Student Management Detail Component', () => {
  let comp: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ student: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StudentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StudentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load student on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.student).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
