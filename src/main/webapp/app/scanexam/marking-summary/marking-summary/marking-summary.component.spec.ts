import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingSummaryComponent } from './marking-summary.component';

describe('MarkingSummaryComponent', () => {
  let component: MarkingSummaryComponent;
  let fixture: ComponentFixture<MarkingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkingSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
