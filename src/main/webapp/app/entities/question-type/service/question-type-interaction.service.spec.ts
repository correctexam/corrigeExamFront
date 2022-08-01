import { TestBed } from '@angular/core/testing';

import { QuestionTypeInteractionService } from './question-type-interaction.service';

describe('QuestionTypeInteractionService', () => {
  let service: QuestionTypeInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionTypeInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
