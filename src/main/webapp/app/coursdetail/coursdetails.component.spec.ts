import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursdetailsComponent } from './coursdetails.component';

describe('CoursdetailsComponent', () => {
  let component: CoursdetailsComponent;
  let fixture: ComponentFixture<CoursdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
