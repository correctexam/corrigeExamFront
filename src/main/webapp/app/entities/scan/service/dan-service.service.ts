import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private apiUrl = 'http://localhost:8080/api/run-dan';

  constructor(private http: HttpClient) {}

  runScript(imageSrc: string): Observable<any> {
    const body = { imagePath: imageSrc };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Http post to make dan start
    return this.http.post(this.apiUrl, body, { headers, responseType: 'json' }).pipe(
      map((response: any) => {
        if (response && response.output) {
          //Replace \n by <br> before returning result
          response.output = response.output.replace(/\\n/g, '\n').replace(/\n/g, '<br>');

          // Get the text between [ ] to avoid debug content
          const regex = /\[(.*?)\]/s;
          const matches = response.output.match(regex);
          if (matches && matches[1]) {
            response.output = matches[1];
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
