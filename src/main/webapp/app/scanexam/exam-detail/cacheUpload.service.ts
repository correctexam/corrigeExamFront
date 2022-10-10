import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
@Injectable({
  providedIn: 'root',
})
export class CacheUploadService {
  constructor(private http: HttpClient, public applicationConfigService: ApplicationConfigService) {}
  uploadCache(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', this.applicationConfigService.getEndpointFor('api/uploadCache'), formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }
  getCache(filename: string): Observable<any> {
    // eslint-disable-next-line no-console
    // console.log(this.applicationConfigService.getEndpointFor('api/getCache/' + filename));
    return this.http.get(this.applicationConfigService.getEndpointFor('api/getCache/' + filename), { responseType: 'blob' });
  }

  getNoAlignImage(examId: number, pageNumber: number): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return this.http.get(this.applicationConfigService.getEndpointFor('api/getCacheNonAlignPage/' + examId + '/' + pageNumber), {
      responseType: 'text',
    });
  }
  getAlignImage(examId: number, pageNumber: number): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return this.http.get(this.applicationConfigService.getEndpointFor('api/getCacheAlignPage/' + examId + '/' + pageNumber), {
      responseType: 'text',
    });
  }
}
