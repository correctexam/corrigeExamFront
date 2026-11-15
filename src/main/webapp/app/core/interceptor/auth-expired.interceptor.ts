import { Injectable, NgZone } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { AccountService } from 'app/core/auth/account.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private stateStorageService: StateStorageService,
    private router: Router,
    private accountService: AccountService,
    private zone: NgZone,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          // A 401 of the student portal ends the student session, not the session of the instructor
          if (
            err.status === 401 &&
            err.url &&
            !err.url.includes('api/account') &&
            !err.url.includes('api/student/me') &&
            !err.url.includes('api/public/') &&
            this.accountService.isAuthenticated()
          ) {
            this.stateStorageService.storeUrl(this.router.routerState.snapshot.url);
            this.loginService.logout();
            this.zone.run(() => {
              this.router.navigate(['/login']);
            });
          }
        },
      }),
    );
  }
}
