import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private apiUrl = 'http://localhost:8080/api/run-dan3';

  constructor(private http: HttpClient) {}

  // Function to run the DAN inference script
  runScript(imageSrc: string): Observable<any> {
    const body = { image: imageSrc }; // Send the image as "image"
    console.log('Request body:', body); // Log what you are sending
    return this.http.post(this.apiUrl, body).pipe(
      map((response: any) => {
        if (response && response.prediction) {
          console.log('I am in service DAN');
          // Replace \n by <br> before returning result
          response.prediction = response.prediction.replace(/\\n/g, '\n').replace(/\n/g, '<br>');

          // Get the text between [ ] to avoid debug content
          const regex = /\[(.*?)\]/s;
          const matches = response.prediction.match(regex);
          if (matches && matches[1]) {
            response.prediction = matches[1];
          }
        }
        return response;
      }),
      catchError(error => {
        console.error("Erreur lors de l'exécution du script", error);
        throw error;
      }),
    );
  }
}
