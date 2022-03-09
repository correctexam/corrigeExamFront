import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStudent, getStudentIdentifier } from '../student.model';

export type EntityResponseType = HttpResponse<IStudent>;
export type EntityArrayResponseType = HttpResponse<IStudent[]>;

@Injectable({ providedIn: 'root' })
export class StudentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/students');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(student: IStudent): Observable<EntityResponseType> {
    return this.http.post<IStudent>(this.resourceUrl, student, { observe: 'response' });
  }

  update(student: IStudent): Observable<EntityResponseType> {
    return this.http.put<IStudent>(`${this.resourceUrl}/${getStudentIdentifier(student) as number}`, student, { observe: 'response' });
  }

  partialUpdate(student: IStudent): Observable<EntityResponseType> {
    return this.http.patch<IStudent>(`${this.resourceUrl}/${getStudentIdentifier(student) as number}`, student, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStudent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStudent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStudentToCollectionIfMissing(studentCollection: IStudent[], ...studentsToCheck: (IStudent | null | undefined)[]): IStudent[] {
    const students: IStudent[] = studentsToCheck.filter(isPresent);
    if (students.length > 0) {
      const studentCollectionIdentifiers = studentCollection.map(studentItem => getStudentIdentifier(studentItem)!);
      const studentsToAdd = students.filter(studentItem => {
        const studentIdentifier = getStudentIdentifier(studentItem);
        if (studentIdentifier == null || studentCollectionIdentifiers.includes(studentIdentifier)) {
          return false;
        }
        studentCollectionIdentifiers.push(studentIdentifier);
        return true;
      });
      return [...studentsToAdd, ...studentCollection];
    }
    return studentCollection;
  }
}
