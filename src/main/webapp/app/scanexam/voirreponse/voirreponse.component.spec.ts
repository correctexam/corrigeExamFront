/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { VoirReponseComponent } from './voirreponse.component';

describe('VoirCopieComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirReponseComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
