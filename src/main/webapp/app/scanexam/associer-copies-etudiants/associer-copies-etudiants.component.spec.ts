import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { AssocierCopiesEtudiantsComponent } from './associer-copies-etudiants.component';

describe('AssocierCopiesEtudiantsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssocierCopiesEtudiantsComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
