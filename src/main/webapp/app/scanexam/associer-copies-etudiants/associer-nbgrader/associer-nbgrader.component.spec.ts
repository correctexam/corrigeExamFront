import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { AssocierNbgraderComponent } from './associer-nbgrader.component';

describe('AssocierCopiesEtudiantsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssocierNbgraderComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
