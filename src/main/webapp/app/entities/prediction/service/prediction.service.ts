import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPrediction } from '../prediction.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PredictionService {
  protected resourceUrl = 'api/predictions';

  constructor(protected http: HttpClient) {}

  // Create a new prediction
  create(prediction: IPrediction): Observable<IPrediction> {
    return this.http.post<IPrediction>(this.resourceUrl, prediction);
  }

  // Update an existing prediction
  update(prediction: IPrediction): Observable<IPrediction> {
    return this.http.put<IPrediction>(`${this.resourceUrl}/${prediction.id}`, prediction);
  }

  // Find a prediction by ID
  find(id: number): Observable<IPrediction> {
    return this.http.get<IPrediction>(`${this.resourceUrl}/${id}`);
  }

  // Query all predictions
  query(): Observable<IPrediction[]> {
    return this.http.get<IPrediction[]>(this.resourceUrl).pipe(map((res: IPrediction[]) => res || []));
  }

  // Delete a prediction by ID
  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }
}
