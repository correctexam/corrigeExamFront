import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PasswordResetInitService } from './password-reset-init.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  selector: 'jhi-password-reset-init',
  templateUrl: './password-reset-init.component.html',
  standalone: true,
  imports: [AlertErrorComponent, FormsModule, ReactiveFormsModule, TranslateDirective, TranslatePipe],
})
export class PasswordResetInitComponent implements AfterViewInit {
  @ViewChild('email', { static: false })
  email?: ElementRef;

  success = false;
  resetRequestForm: UntypedFormGroup;

  constructor(
    private passwordResetInitService: PasswordResetInitService,
    private fb: UntypedFormBuilder,
  ) {
    this.resetRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    });
  }

  ngAfterViewInit(): void {
    if (this.email) {
      this.email.nativeElement.focus();
    }
  }

  requestReset(): void {
    this.passwordResetInitService.save(this.resetRequestForm.get(['email'])!.value).subscribe(() => (this.success = true));
  }
}
