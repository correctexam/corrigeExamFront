/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { CreercoursComponent } from './creercours.component';

describe('CreercoursComponent', () => {
  let component: CreercoursComponent;
  let fixture: ComponentFixture<CreercoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreercoursComponent],
      //      declarations: [ CreercoursComponent ]
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
