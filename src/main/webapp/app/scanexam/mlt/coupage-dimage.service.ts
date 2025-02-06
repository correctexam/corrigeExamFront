import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CoupageDimageService {
  private apiUrl = 'http://localhost:8080/api/coupage-dimage';

  constructor(private http: HttpClient) {}
  runScript(imageSrc: string): Observable<any> {
    const body = { image: imageSrc }; // Payload
    // console.log('Sending request to:', this.apiUrl);
    // console.log('Request body:', body);

    return this.http.post(this.apiUrl, body).pipe(
      map((response: any) => {
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
