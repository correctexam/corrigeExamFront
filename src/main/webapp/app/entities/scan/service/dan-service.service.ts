import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private apiUrl = 'http://localhost:8080/api/run-dan2';

  constructor(private http: HttpClient) {}

  // Function to run the DAN inference script
  runScript(imageSrc: string): Observable<any> {
    const body = { image: imageSrc }; // Send the image as "image"
    console.log('Request body:', body); // Log what you are sending
    return this.http.post(this.apiUrl, body).pipe(
      map((response: any) => {
        console.log('Response from backend:', response); // Debugging log
        return response;
      }),
      catchError(error => {
        console.error('Error while running script:', error);
        throw error;
      }),
    );
  }
}
