import { TestBed } from '@angular/core/testing';

import { ExamQuestPictureServiceService } from './exam-quest-picture-service.service';

describe('ExamQuestPictureServiceService', () => {
  let service: ExamQuestPictureServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamQuestPictureServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
