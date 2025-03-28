import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordService } from './password.service';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'jhi-password',
  templateUrl: './password.component.html',
  standalone: true,
  imports: [NgIf, TranslateDirective, FormsModule, ReactiveFormsModule, PasswordStrengthBarComponent, AsyncPipe, TranslateModule],
})
export class PasswordComponent implements OnInit {
  doNotMatch = false;
  error = false;
  success = false;
  account$?: Observable<Account | null>;
  passwordForm: UntypedFormGroup;

  constructor(
    private passwordService: PasswordService,
    private accountService: AccountService,
    private fb: UntypedFormBuilder,
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
  }

  changePassword(): void {
    this.error = false;
    this.success = false;
    this.doNotMatch = false;

    const newPassword = this.passwordForm.get(['newPassword'])!.value;
    if (newPassword !== this.passwordForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      this.passwordService.save(newPassword, this.passwordForm.get(['currentPassword'])!.value).subscribe({
        next: () => (this.success = true),
        error: () => (this.error = true),
      });
    }
  }
}
