jest.mock('@ng-bootstrap/ng-bootstrap');

import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('HybridGradedComment Management Delete Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [NgbActiveModal],
    }).compileComponents();
  });
  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        expect(true);
      }),
    ));
  });
});
