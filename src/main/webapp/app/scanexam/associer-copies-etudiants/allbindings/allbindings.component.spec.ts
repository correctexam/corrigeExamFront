import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllbindingsComponent } from './allbindings.component';

describe('AllbindingsComponent', () => {
  let component: AllbindingsComponent;
  let fixture: ComponentFixture<AllbindingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllbindingsComponent],
    });
    fixture = TestBed.createComponent(AllbindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
