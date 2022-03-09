import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourse, getCourseIdentifier } from '../course.model';

export type EntityResponseType = HttpResponse<ICourse>;
export type EntityArrayResponseType = HttpResponse<ICourse[]>;

@Injectable({ providedIn: 'root' })
export class CourseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/courses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(course: ICourse): Observable<EntityResponseType> {
    return this.http.post<ICourse>(this.resourceUrl, course, { observe: 'response' });
  }

  update(course: ICourse): Observable<EntityResponseType> {
    return this.http.put<ICourse>(`${this.resourceUrl}/${getCourseIdentifier(course) as number}`, course, { observe: 'response' });
  }

  partialUpdate(course: ICourse): Observable<EntityResponseType> {
    return this.http.patch<ICourse>(`${this.resourceUrl}/${getCourseIdentifier(course) as number}`, course, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICourse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICourse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCourseToCollectionIfMissing(courseCollection: ICourse[], ...coursesToCheck: (ICourse | null | undefined)[]): ICourse[] {
    const courses: ICourse[] = coursesToCheck.filter(isPresent);
    if (courses.length > 0) {
      const courseCollectionIdentifiers = courseCollection.map(courseItem => getCourseIdentifier(courseItem)!);
      const coursesToAdd = courses.filter(courseItem => {
        const courseIdentifier = getCourseIdentifier(courseItem);
        if (courseIdentifier == null || courseCollectionIdentifiers.includes(courseIdentifier)) {
          return false;
        }
        courseCollectionIdentifiers.push(courseIdentifier);
        return true;
      });
      return [...coursesToAdd, ...courseCollection];
    }
    return courseCollection;
  }
}
