import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION, CAS_SERVER_URL, SERVICE_URL, CONNECTION_METHOD } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PreferencePageComponent } from '../../scanexam/preference-page/preference-page.component';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [DialogService],
})
export class NavbarComponent implements OnInit, OnDestroy {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  ref: DynamicDialogRef | undefined;

  // duplicate in home.component.ts
  public readonly CONNECTION_METHOD_LOCAL = 'local';
  public readonly CONNECTION_METHOD_CAS = 'cas';
  public readonly CONNECTION_METHOD_SHIB = 'shib';
  protected readonly CONNECTION_METHOD = CONNECTION_METHOD;
  protected readonly SERVICE_URL = SERVICE_URL;
  protected readonly CAS_SERVER_URL = CAS_SERVER_URL;

  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    public dialogService: DialogService,
    private zone: NgZone
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.zone.run(() => {
      this.router.navigate(['/login']);
    });
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.zone.run(() => {
      this.router.navigate(['']);
    });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  showPreference(): void {
    this.ref = this.dialogService.open(PreferencePageComponent, {
      header: this.translateService.instant('scanexam.preference'),
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.ref.onClose.subscribe(() => {});
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
