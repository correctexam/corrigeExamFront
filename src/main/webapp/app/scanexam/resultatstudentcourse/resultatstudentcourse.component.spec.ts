/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
HTMLCanvasElement.prototype.getContext = jest.fn();

import { ResultatStudentcourseComponent } from './resultatstudentcourse.component';

describe('ListstudentcourseComponent', () => {
  let component: ResultatStudentcourseComponent;
  let fixture: ComponentFixture<ResultatStudentcourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatStudentcourseComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
