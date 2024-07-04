import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PasswordResetFinishService } from './password-reset-finish.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('PasswordResetFinish Service', () => {
  let service: PasswordResetFinishService;
  let httpMock: HttpTestingController;
  let applicationConfigService: ApplicationConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PasswordResetFinishService);
    applicationConfigService = TestBed.inject(ApplicationConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should call reset-password/finish endpoint with correct values', () => {
      // GIVEN
      const key = 'abc';
      const newPassword = 'password';

      // WHEN
      service.save(key, newPassword).subscribe();

      const testRequest = httpMock.expectOne({
        method: 'POST',
        url: applicationConfigService.getEndpointFor('api/account/reset-password/finish'),
      });

      // THEN
      expect(testRequest.request.body).toEqual({ key, newPassword });
    });
  });
});
