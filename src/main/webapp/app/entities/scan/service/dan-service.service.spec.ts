import { TestBed } from '@angular/core/testing';

import { ScriptService } from './dan-service.service';

describe('DanServiceService', () => {
  let service: ScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
