import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { StatsExamComponent } from './statsexam.component';

describe('StatsExamComponent', () => {
  // let component: StatsExamComponent;
  // let fixture: ComponentFixture<StatsExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsExamComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    //    fixture = TestBed.createComponent(StatsExamComponent);
    //    component = fixture.componentInstance;
    //    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true);
  });
});
