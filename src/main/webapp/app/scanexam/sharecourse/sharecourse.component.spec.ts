import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharecourseComponent } from './sharecourse.component';

describe('SharecourseComponent', () => {
  let component: SharecourseComponent;
  let fixture: ComponentFixture<SharecourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharecourseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharecourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
