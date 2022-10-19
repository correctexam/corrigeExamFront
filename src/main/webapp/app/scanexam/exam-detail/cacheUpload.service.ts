import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Observable, scan } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

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
    // eslint-disable-next-line no-console
    console.log('current');

    return {
      progress: event.total ? Math.round((100 * event.loaded) / event.total) : upload.progress,
      state: 'IN_PROGRESS',
    };
  }
  if (isHttpResponse(event)) {
    // eslint-disable-next-line no-console
    return {
      progress: 100,
      state: 'DONE',
      body: event.body,
    };
  }
  return upload;
};

@Injectable({
  providedIn: 'root',
})
export class CacheUploadService {
  constructor(private http: HttpClient, public applicationConfigService: ApplicationConfigService) {}
  uploadCache(file: File): Observable<Upload> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http
      .post(this.applicationConfigService.getEndpointFor('api/uploadCache'), formData, {
        reportProgress: true,
        responseType: 'json',
        observe: 'events',
      })
      .pipe(scan(calculateState, initialState));

    /* const req = new HttpRequest('POST', this.applicationConfigService.getEndpointFor('api/uploadCache'), formData, {
      reportProgress: true,
      responseType: 'json',
      observe: 'events'
    });
    return this.http.request(req);*/
  }
  getCache(filename: string): Observable<any> {
    // eslint-disable-next-line no-console
    // console.log(this.applicationConfigService.getEndpointFor('api/getCache/' + filename));
    return this.http.get(this.applicationConfigService.getEndpointFor('api/getCache/' + filename), {
      //  reportProgress: true,
      // observe: 'events',
      responseType: 'blob',
    });
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
