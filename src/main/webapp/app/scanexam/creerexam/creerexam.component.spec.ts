import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerexamComponent } from './creerexam.component';

describe('CreerexamComponent', () => {
  let component: CreerexamComponent;
  let fixture: ComponentFixture<CreerexamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreerexamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreerexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
