import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class PasswordResetFinishService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
  ) {}

  save(key: string, newPassword: string): Observable<any> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account/reset-password/finish'), { key, newPassword });
  }
}
