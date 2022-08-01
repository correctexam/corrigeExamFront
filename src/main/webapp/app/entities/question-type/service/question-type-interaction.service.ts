/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionTypeInteractionService {
  // Attention, il peut y avoir un problème d'erreur CORS
  // Reglé tempporairement avec l'extension Chrome https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf/

  constructor(private http: HttpClient) {}

  // Fonction de test, permet de vérifier que la connection avec l'API se fait bien
  greetings(urlQuestionType: string): Observable<any> {
    return this.http.get(urlQuestionType + 'greetings/');
  }
}
