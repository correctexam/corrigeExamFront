import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private apiUrl = 'http://localhost:8080/api/run-dan'; // L'URL de votre backend Jakarta EE

  constructor(private http: HttpClient) {}

  runScript(): Observable<any> {
    return this.http.post(
      this.apiUrl,
      {},
      {
        // Envoi d'une requête vide
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json', // La réponse est en JSON
      },
    );
  }
}
