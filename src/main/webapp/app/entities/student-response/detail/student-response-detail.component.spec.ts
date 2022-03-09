import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudentResponseDetailComponent } from './student-response-detail.component';

describe('StudentResponse Management Detail Component', () => {
  let comp: StudentResponseDetailComponent;
  let fixture: ComponentFixture<StudentResponseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentResponseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ studentResponse: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StudentResponseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StudentResponseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load studentResponse on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.studentResponse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
