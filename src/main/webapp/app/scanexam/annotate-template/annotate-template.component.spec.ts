/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { AnnotateTemplateComponent } from './annotate-template.component';

describe('AnnotateTemplateComponent', () => {
  let component: AnnotateTemplateComponent;
  let fixture: ComponentFixture<AnnotateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotateTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
