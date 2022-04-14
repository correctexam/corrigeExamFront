import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrigequestionComponent } from './corrigequestion.component';

describe('CorrigequestionComponent', () => {
  let component: CorrigequestionComponent;
  let fixture: ComponentFixture<CorrigequestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrigequestionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrigequestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
