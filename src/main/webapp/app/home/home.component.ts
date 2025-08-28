/* eslint-disable no-console */
import { Component, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { scan, takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ApplicationConfigService } from '../core/config/application-config.service';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { LoginService } from 'app/login/login.service';

import { CONNECTION_METHOD, CAS_SERVER_URL, SERVICE_URL } from 'app/app.constants';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { MesCoursComponent } from 'app/scanexam/mes-cours/mes-cours.component';
import { MesCoursComponent as MesCoursComponent_1 } from '../scanexam/mes-cours/mes-cours.component';
import { PrimeTemplate } from 'primeng/api';
import { DockModule } from 'primeng/dock';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { HasAnyAuthorityDirective } from '../shared/auth/has-any-authority.directive';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface Upload {
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  body?: any;
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress;
}

const initialState: Upload = { state: 'PENDING', progress: 0 };
const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
  if (isHttpProgressEvent(event)) {
    return {
      progress: event.total ? Math.round((100 * event.loaded) / event.total) : upload.progress,
      state: 'IN_PROGRESS',
    };
  }
  if (isHttpResponse(event)) {
    return {
      progress: 100,
      state: 'DONE',
      body: event.body,
    };
  }
  return upload;
};

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    TranslatePipe,
    TranslateDirective,
    CommonModule,
    RouterLink,
    HasAnyAuthorityDirective,
    DrawerModule,
    TooltipModule,
    ToggleSwitchModule,
    FormsModule,
    FileUploadModule,
    ButtonModule,
    DockModule,
    PrimeTemplate,
    MesCoursComponent_1,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  dockItems!: any[];

  faPlus = faPlus;

  courseId = '';
  layoutsidebarVisible = false;
  includeStudentsData = true;

  blocked = false;
  message = '';
  _mescours!: MesCoursComponent;

  @ViewChild(MesCoursComponent)
  set mescours(v: MesCoursComponent) {
    setTimeout(() => {
      this._mescours = v;
    }, 0);
  }

  public readonly CONNECTION_METHOD_LOCAL = 'local';
  public readonly CONNECTION_METHOD_CAS = 'cas';
  public readonly CONNECTION_METHOD_SHIB = 'shib';
  protected readonly CONNECTION_METHOD = CONNECTION_METHOD;
  protected readonly SERVICE_URL = SERVICE_URL;
  protected readonly CAS_SERVER_URL = CAS_SERVER_URL;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private appConfig: ApplicationConfigService,
    private translateService: TranslateService,
    private loginService: LoginService,
    private zone: NgZone,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    switch (CONNECTION_METHOD) {
      case this.CONNECTION_METHOD_CAS:
        // Check if user has been redirected from cas login page
        // eslint-disable-next-line no-case-declarations
        const matchTicket = window.location.href.match(/(.*)[&?]ticket=([^&?]*)$/);
        if (matchTicket) {
          const ticket = matchTicket[2];
          this.loginService.login_cas(ticket).subscribe({
            next: () => {
              this.router.navigate(['']);
            },
            error: () => console.log('failed to connect'),
          });
        }
        break;
      case this.CONNECTION_METHOD_SHIB:
        // Check if user has been redirected from shib login page
        // eslint-disable-next-line no-case-declarations
        const shibPresent = window.location.href.match(/\?shib=true/);
        if (shibPresent) {
          this.loginService.login_shib().subscribe({
            next: () => {
              this.router.navigate(['']);
            },
            error: () => console.log('failed to connect'),
          });
        }
        break;
    }

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.translateService.get('home.creercours').subscribe(() => {
      this.initCmpt();
    });
    /* this.translateService.onLangChange.subscribe(() => {
      this.initCmpt();
    });*/
  }

  initCmpt(): void {
    this.dockItems = [
      {
        label: this.translateService.instant('home.creercours'),
        icon: this.appConfig.getFrontUrl() + 'content/images/plus.svg',
        title: this.translateService.instant('home.creercours'),
        route: 'creercours',
      },
      {
        label: this.translateService.instant('scanexam.import'),
        icon: this.appConfig.getFrontUrl() + 'content/images/import-export-outline-icon.svg',
        title: this.translateService.instant('scanexam.importcoursetooltip'),
        command1: () => {
          this.layoutsidebarVisible = true;
        },
      },
    ];
  }

  login(): void {
    this.zone.run(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUpload($event: any, fileUpload: FileUpload): void {
    if ($event.files && $event.files.length > 0) {
      this.uploadCache($event.files[0]).subscribe(response => {
        if (response.state === 'DONE') {
          fileUpload?.clear();

          this.layoutsidebarVisible = false;
          this.blocked = false;
          this.message = '';

          this._mescours.ngOnInit();
        }
      });
    }
  }
  uploadCache(file: File): Observable<Upload> {
    this.layoutsidebarVisible = false;
    this.message = this.translateService.instant('scanexam.importencours');
    this.blocked = true;

    const formData: FormData = new FormData();
    formData.append('file', file);

    let endpoint = 'api/importCourse';
    if (!this.includeStudentsData) {
      endpoint = 'api/importCourseWithoutStudentData';
    }

    return this.http
      .post(this.appConfig.getEndpointFor(endpoint), formData, {
        reportProgress: true,
        responseType: 'json',
        observe: 'events',
      })
      .pipe(scan(calculateState, initialState));
  }
}
