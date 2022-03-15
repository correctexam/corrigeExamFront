import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesCoursComponent } from './mes-cours.component';

describe('MesCoursComponent', () => {
  let component: MesCoursComponent;
  let fixture: ComponentFixture<MesCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesCoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
