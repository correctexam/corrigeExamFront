import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingSummaryComponent } from './marking-summary.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MarkingSummaryComponent', () => {
  let component: MarkingSummaryComponent;
  let fixture: ComponentFixture<MarkingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkingSummaryComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
