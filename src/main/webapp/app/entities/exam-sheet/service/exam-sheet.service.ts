import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExamSheet, getExamSheetIdentifier } from '../exam-sheet.model';
import { StudentResponse } from 'app/entities/student-response/student-response.model';

export type EntityResponseType = HttpResponse<IExamSheet>;
export type EntityArrayResponseType = HttpResponse<IExamSheet[]>;

@Injectable({ providedIn: 'root' })
export class ExamSheetService {
  protected resourceUrl: string;

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/exam-sheets');
  }

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

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  updateStudents(sheetid: number, studentId: number[]): Observable<EntityResponseType> {
    return this.http.put<IExamSheet>(`${this.resourceUrl}/boundstudents/${sheetid}`, studentId, {
      observe: 'response',
    });
  }

  updateStudentsResponseWithTComment(
    examid: number,
    commentid: number,
    numero: number,
    checked: boolean,
    sheetsid: number[],
  ): Observable<EntityArrayResponseType> {
    return this.http.put<StudentResponse[]>(`${this.resourceUrl}/toggletcomments/${examid}/${commentid}/${numero}/${checked}`, sheetsid, {
      observe: 'response',
    });
  }

  updateStudentsResponseWithGComment(
    examid: number,
    commentid: number,
    numero: number,
    checked: boolean,
    sheetsid: number[],
  ): Observable<EntityArrayResponseType> {
    return this.http.put<IExamSheet[]>(`${this.resourceUrl}/togglegcomments/${examid}/${commentid}/${numero}/${checked}`, sheetsid, {
      observe: 'response',
    });
  }

  updateStudentsResponseWithHComment(
    examid: number,
    commentid: number,
    numero: number,
    step: number,
    sheetsid: number[],
  ): Observable<EntityArrayResponseType> {
    return this.http.put<IExamSheet[]>(`${this.resourceUrl}/togglehcomments/${examid}/${commentid}/${numero}/${step}`, sheetsid, {
      observe: 'response',
    });
  }

  updateStudentsResponseWithNotes(examid: number, numero: number, step: number, sheetsid: number[]): Observable<EntityArrayResponseType> {
    return this.http.put<IExamSheet[]>(`${this.resourceUrl}/updatenotes/${examid}/${numero}/${step}`, sheetsid, {
      observe: 'response',
    });
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
