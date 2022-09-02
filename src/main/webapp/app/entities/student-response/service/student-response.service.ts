import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStudentResponse, getStudentResponseIdentifier } from '../student-response.model';

export type EntityResponseType = HttpResponse<IStudentResponse>;
export type EntityArrayResponseType = HttpResponse<IStudentResponse[]>;

@Injectable({ providedIn: 'root' })
export class StudentResponseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/student-responses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(studentResponse: IStudentResponse): Observable<EntityResponseType> {
    return this.http.post<IStudentResponse>(this.resourceUrl, studentResponse, { observe: 'response' });
  }

  update(studentResponse: IStudentResponse): Observable<EntityResponseType> {
    return this.http.put<IStudentResponse>(`${this.resourceUrl}`, studentResponse, { observe: 'response' });
  }

  partialUpdate(studentResponse: IStudentResponse): Observable<EntityResponseType> {
    return this.http.patch<IStudentResponse>(
      `${this.resourceUrl}/${getStudentResponseIdentifier(studentResponse) as number}`,
      {
        currentNote: studentResponse.note,
      },
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStudentResponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStudentResponse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStudentResponseToCollectionIfMissing(
    studentResponseCollection: IStudentResponse[],
    ...studentResponsesToCheck: (IStudentResponse | null | undefined)[]
  ): IStudentResponse[] {
    const studentResponses: IStudentResponse[] = studentResponsesToCheck.filter(isPresent);
    if (studentResponses.length > 0) {
      const studentResponseCollectionIdentifiers = studentResponseCollection.map(
        studentResponseItem => getStudentResponseIdentifier(studentResponseItem)!
      );
      const studentResponsesToAdd = studentResponses.filter(studentResponseItem => {
        const studentResponseIdentifier = getStudentResponseIdentifier(studentResponseItem);
        if (studentResponseIdentifier == null || studentResponseCollectionIdentifiers.includes(studentResponseIdentifier)) {
          return false;
        }
        studentResponseCollectionIdentifiers.push(studentResponseIdentifier);
        return true;
      });
      return [...studentResponsesToAdd, ...studentResponseCollection];
    }
    return studentResponseCollection;
  }
}
