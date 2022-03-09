import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFinalResult, getFinalResultIdentifier } from '../final-result.model';

export type EntityResponseType = HttpResponse<IFinalResult>;
export type EntityArrayResponseType = HttpResponse<IFinalResult[]>;

@Injectable({ providedIn: 'root' })
export class FinalResultService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/final-results');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(finalResult: IFinalResult): Observable<EntityResponseType> {
    return this.http.post<IFinalResult>(this.resourceUrl, finalResult, { observe: 'response' });
  }

  update(finalResult: IFinalResult): Observable<EntityResponseType> {
    return this.http.put<IFinalResult>(`${this.resourceUrl}/${getFinalResultIdentifier(finalResult) as number}`, finalResult, {
      observe: 'response',
    });
  }

  partialUpdate(finalResult: IFinalResult): Observable<EntityResponseType> {
    return this.http.patch<IFinalResult>(`${this.resourceUrl}/${getFinalResultIdentifier(finalResult) as number}`, finalResult, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFinalResult>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFinalResult[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFinalResultToCollectionIfMissing(
    finalResultCollection: IFinalResult[],
    ...finalResultsToCheck: (IFinalResult | null | undefined)[]
  ): IFinalResult[] {
    const finalResults: IFinalResult[] = finalResultsToCheck.filter(isPresent);
    if (finalResults.length > 0) {
      const finalResultCollectionIdentifiers = finalResultCollection.map(finalResultItem => getFinalResultIdentifier(finalResultItem)!);
      const finalResultsToAdd = finalResults.filter(finalResultItem => {
        const finalResultIdentifier = getFinalResultIdentifier(finalResultItem);
        if (finalResultIdentifier == null || finalResultCollectionIdentifiers.includes(finalResultIdentifier)) {
          return false;
        }
        finalResultCollectionIdentifiers.push(finalResultIdentifier);
        return true;
      });
      return [...finalResultsToAdd, ...finalResultCollection];
    }
    return finalResultCollection;
  }
}
