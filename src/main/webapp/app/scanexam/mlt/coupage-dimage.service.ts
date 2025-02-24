import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlignImagesService } from '../services/align-images.service';

@Injectable({
  providedIn: 'root',
})
export class CoupageDimageService {
  private apiUrl = 'http://localhost:8080/api/coupage-dimage';

  constructor(
    private http: HttpClient,
    private alignImagesService: AlignImagesService,
  ) {}
  runScript(imageSrc: ImageData): Observable<any> {
    // console.error('imageSrc:', imageSrc);
    return this.alignImagesService.getLinesFromImage({ image: imageSrc });
  }

  runScript1(imageSrc: string): Observable<any> {
    const body = { image: imageSrc }; // Payload
    // console.log('Sending request to:', this.apiUrl);
    // console.log('Request body:', body);

    return this.http.post(this.apiUrl, body).pipe(
      map((response: any) => {
        // eslint-disable-next-line no-console
        console.log('Response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error in CoupageDimageService:', error);
        throw error;
      }),
    );
  }
}
