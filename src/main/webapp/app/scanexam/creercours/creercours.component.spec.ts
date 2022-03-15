import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreercoursComponent } from './creercours.component';

describe('CreercoursComponent', () => {
  let component: CreercoursComponent;
  let fixture: ComponentFixture<CreercoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreercoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreercoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
