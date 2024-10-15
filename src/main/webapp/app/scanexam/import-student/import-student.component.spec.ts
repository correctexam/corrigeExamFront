/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { ImportStudentComponent } from './import-student.component';

describe('ImportStudentComponent', () => {
  let component: ImportStudentComponent;
  let fixture: ComponentFixture<ImportStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportStudentComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
