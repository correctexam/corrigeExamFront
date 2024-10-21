import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private apiUrl = 'http://localhost:8080/api/run-dan'; // L'URL de votre backend Jakarta EE

  constructor(private http: HttpClient) {}

  runScript(imageSrc: string): Observable<any> {
    const body = { imagePath: imageSrc }; // Create a request body with the image path
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Set the correct content type
    });

    // Make a POST request to the backend with the image path
    return this.http.post(this.apiUrl, body, { headers, responseType: 'json' });
  }
}
