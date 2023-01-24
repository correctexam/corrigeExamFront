/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-console */
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AlignImagesService } from 'app/scanexam/services/align-images.service';
import { ApplicationConfigService } from '../core/config/application-config.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'app/login/login.service';

import { environment } from 'app/environment/environment';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  dockItems!: any[];
  cas_url: string;
  service_url: string;

  faPlus = faPlus;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private alignImagesService: AlignImagesService,
    private appConfig: ApplicationConfigService,
    private translateService: TranslateService,
    private loginService: LoginService
  ) {
    this.cas_url = environment.cas_server_url;
    this.service_url = environment.service_url;
  }

  ngOnInit(): void {
    // Check if user has been redirected from cas login page
    const matchTicket = window.location.href.match(/(.*)[&?]ticket=([^&?]*)$/);
    if (matchTicket) {
      // startValidationProcedure
      // const [_, x, ticket] = matchTicket;
      const ticket = matchTicket[2];
      this.loginService.login_cas(ticket).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: () => console.log('failed to connect'),
      });
    }

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.translateService.get('home.creercours').subscribe(() => {
      this.initCmpt();
    });
    this.translateService.onLangChange.subscribe(() => {
      console.log('language change');
      this.initCmpt();
    });
  }

  initCmpt(): void {
    this.dockItems = [
      {
        label: this.translateService.instant('home.creercours'),
        icon: this.appConfig.getFrontUrl() + 'content/images/plus.svg',
        title: this.translateService.instant('home.creercours'),
        route: 'creercours',
      },
    ];
  }
  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
