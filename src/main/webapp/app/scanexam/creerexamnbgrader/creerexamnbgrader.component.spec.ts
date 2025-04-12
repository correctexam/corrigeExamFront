/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { CreerexamComponentNbGrader } from './creerexamnbgrader.component';

describe('CreerexamComponent', () => {
  let component: CreerexamComponentNbGrader;
  let fixture: ComponentFixture<CreerexamComponentNbGrader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerexamComponentNbGrader],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
