import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPrediction } from '../prediction.model';
import { map } from 'rxjs/operators';
import { createRequestOption } from 'app/core/request/request-util';
import { HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { getPredictionIdentifier } from '../prediction.model';

export type EntityResponseType = HttpResponse<IPrediction>;
export type EntityArrayResponseType = HttpResponse<IPrediction[]>;

@Injectable({ providedIn: 'root' })
export class PredictionService {
  protected resourceUrl = 'api/predictions';
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/predictions');
  }

  create(prediction: IPrediction): Observable<EntityResponseType> {
    return this.http.post<IPrediction>(this.resourceUrl, prediction, { observe: 'response' });
  }

  update(prediction: IPrediction): Observable<EntityResponseType> {
    return this.http.put<IPrediction>(this.resourceUrl, prediction, {
      observe: 'response',
    });
  }

  partialUpdate(prediction: IPrediction): Observable<EntityResponseType> {
    return this.http.patch<IPrediction>(`${this.resourceUrl}/${getPredictionIdentifier(prediction) as number}`, prediction, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPrediction>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPrediction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  countHowManyUse(id: number): Observable<number> {
    return this.http.get<number>(`${this.resourceUrl}/countHowManyUse/${id}`);
  }
}
