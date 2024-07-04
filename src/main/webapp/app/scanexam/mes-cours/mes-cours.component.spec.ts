/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { MesCoursComponent } from './mes-cours.component';

describe('MesCoursComponent', () => {
  let component: MesCoursComponent;
  let fixture: ComponentFixture<MesCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesCoursComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
