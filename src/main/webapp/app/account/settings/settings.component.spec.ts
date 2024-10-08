jest.mock('app/core/auth/account.service');
import { describe, expect } from '@jest/globals';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { throwError, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { SettingsComponent } from './settings.component';
import { provideHttpClient } from '@angular/common/http';

describe('SettingsComponent', () => {
  let comp: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockAccountService: AccountService;
  const account: Account = {
    firstName: 'John',
    lastName: 'Doe',
    activated: true,
    email: 'john.doe@mail.com',
    langKey: 'fr',
    login: 'john',
    authorities: [],
    imageUrl: '',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, TranslateModule.forRoot(), SettingsComponent],
      providers: [FormBuilder, AccountService, provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideTemplate(SettingsComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    comp = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(account));
    mockAccountService.getAuthenticationState = jest.fn(() => of(account));
  });

  it('should send the current identity upon save', () => {
    // GIVEN
    mockAccountService.save = jest.fn(() => of({}));
    const settingsFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      langKey: 'fr',
    };

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(mockAccountService.identity).toHaveBeenCalled();
    expect(mockAccountService.save).toHaveBeenCalledWith(account);
    expect(mockAccountService.authenticate).toHaveBeenCalledWith(account);
    expect(comp.settingsForm.value).toEqual(settingsFormValues);
  });

  it('should notify of success upon successful save', () => {
    // GIVEN
    mockAccountService.save = jest.fn(() => of({}));

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(comp.success).toBe(true);
  });

  it('should notify of error upon failed save', () => {
    // GIVEN
    mockAccountService.save = jest.fn(() => throwError('ERROR'));

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(comp.success).toBe(false);
  });
});
