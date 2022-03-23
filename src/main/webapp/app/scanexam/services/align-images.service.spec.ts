import { TestBed } from '@angular/core/testing';

import { AlignImagesService } from './align-images.service';

describe('AlignImagesService', () => {
  let service: AlignImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlignImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
