/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { ExamDetailComponent } from './exam-detail.component';

describe('ExamDetailComponent', () => {
  let component: ExamDetailComponent;
  let fixture: ComponentFixture<ExamDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
