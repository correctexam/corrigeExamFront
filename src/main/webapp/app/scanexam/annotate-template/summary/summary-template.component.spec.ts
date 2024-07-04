import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { SummaryTemplateComponent } from './summary-template.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SummaryTemplateComponent', () => {
  let component: SummaryTemplateComponent;
  let fixture: ComponentFixture<SummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryTemplateComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
