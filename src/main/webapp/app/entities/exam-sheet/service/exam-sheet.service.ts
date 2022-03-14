import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExamSheet, getExamSheetIdentifier } from '../exam-sheet.model';

export type EntityResponseType = HttpResponse<IExamSheet>;
export type EntityArrayResponseType = HttpResponse<IExamSheet[]>;

@Injectable({ providedIn: 'root' })
export class ExamSheetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exam-sheets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(examSheet: IExamSheet): Observable<EntityResponseType> {
    return this.http.post<IExamSheet>(this.resourceUrl, examSheet, { observe: 'response' });
  }

  update(examSheet: IExamSheet): Observable<EntityResponseType> {
    return this.http.put<IExamSheet>(`${this.resourceUrl}`, examSheet, {
      observe: 'response',
    });
  }

  partialUpdate(examSheet: IExamSheet): Observable<EntityResponseType> {
    return this.http.patch<IExamSheet>(`${this.resourceUrl}/${getExamSheetIdentifier(examSheet) as number}`, examSheet, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExamSheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExamSheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExamSheetToCollectionIfMissing(
    examSheetCollection: IExamSheet[],
    ...examSheetsToCheck: (IExamSheet | null | undefined)[]
  ): IExamSheet[] {
    const examSheets: IExamSheet[] = examSheetsToCheck.filter(isPresent);
    if (examSheets.length > 0) {
      const examSheetCollectionIdentifiers = examSheetCollection.map(examSheetItem => getExamSheetIdentifier(examSheetItem)!);
      const examSheetsToAdd = examSheets.filter(examSheetItem => {
        const examSheetIdentifier = getExamSheetIdentifier(examSheetItem);
        if (examSheetIdentifier == null || examSheetCollectionIdentifiers.includes(examSheetIdentifier)) {
          return false;
        }
        examSheetCollectionIdentifiers.push(examSheetIdentifier);
        return true;
      });
      return [...examSheetsToAdd, ...examSheetCollection];
    }
    return examSheetCollection;
  }
}
