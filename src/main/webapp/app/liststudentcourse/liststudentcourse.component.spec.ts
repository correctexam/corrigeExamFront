import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListstudentcourseComponent } from './liststudentcourse.component';

describe('ListstudentcourseComponent', () => {
  let component: ListstudentcourseComponent;
  let fixture: ComponentFixture<ListstudentcourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListstudentcourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListstudentcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
