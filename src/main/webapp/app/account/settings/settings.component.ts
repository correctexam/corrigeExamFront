import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { FindLanguageFromKeyPipe } from '../../shared/language/find-language-from-key.pipe';
import { AlertErrorComponent } from '../../shared/alert/alert-error.component';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  imports: [AlertErrorComponent, FormsModule, ReactiveFormsModule, TranslateDirective, TranslatePipe, FindLanguageFromKeyPipe],
})
export class SettingsComponent implements OnInit {
  account!: Account;
  success = false;
  languages = LANGUAGES;
  settingsForm: UntypedFormGroup;

  constructor(
    private accountService: AccountService,
    private fb: UntypedFormBuilder,
    private translateService: TranslateService,
  ) {
    this.settingsForm = this.fb.group({
      firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
      langKey: [undefined],
    });
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          langKey: account.langKey,
        });

        this.account = account;
      }
    });
  }

  save(): void {
    this.success = false;

    this.account.firstName = this.settingsForm.get('firstName')!.value;
    this.account.lastName = this.settingsForm.get('lastName')!.value;
    this.account.email = this.settingsForm.get('email')!.value;
    this.account.langKey = this.settingsForm.get('langKey')!.value;

    this.accountService.save(this.account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(this.account);

      if (this.account.langKey !== this.translateService.currentLang) {
        this.translateService.use(this.account.langKey);
      }
    });
  }
}
