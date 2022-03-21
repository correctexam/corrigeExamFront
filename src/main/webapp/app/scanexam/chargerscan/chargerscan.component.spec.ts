import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargerscanComponent } from './chargerscan.component';

describe('ChargerscanComponent', () => {
  let component: ChargerscanComponent;
  let fixture: ComponentFixture<ChargerscanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChargerscanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargerscanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
