import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourseGroup, getCourseGroupIdentifier } from '../course-group.model';

export type EntityResponseType = HttpResponse<ICourseGroup>;
export type EntityArrayResponseType = HttpResponse<ICourseGroup[]>;

@Injectable({ providedIn: 'root' })
export class CourseGroupService {
  protected resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/course-groups');
  }

  create(courseGroup: ICourseGroup): Observable<EntityResponseType> {
    return this.http.post<ICourseGroup>(this.resourceUrl, courseGroup, { observe: 'response' });
  }

  update(courseGroup: ICourseGroup): Observable<EntityResponseType> {
    return this.http.put<ICourseGroup>(`${this.resourceUrl}`, courseGroup, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICourseGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICourseGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCourseGroupToCollectionIfMissing(
    courseGroupCollection: ICourseGroup[],
    ...courseGroupsToCheck: (ICourseGroup | null | undefined)[]
  ): ICourseGroup[] {
    const courseGroups: ICourseGroup[] = courseGroupsToCheck.filter(isPresent);
    if (courseGroups.length > 0) {
      const courseGroupCollectionIdentifiers = courseGroupCollection.map(courseGroupItem => getCourseGroupIdentifier(courseGroupItem)!);
      const courseGroupsToAdd = courseGroups.filter(courseGroupItem => {
        const courseGroupIdentifier = getCourseGroupIdentifier(courseGroupItem);
        if (courseGroupIdentifier == null || courseGroupCollectionIdentifiers.includes(courseGroupIdentifier)) {
          return false;
        }
        courseGroupCollectionIdentifiers.push(courseGroupIdentifier);
        return true;
      });
      return [...courseGroupsToAdd, ...courseGroupCollection];
    }
    return courseGroupCollection;
  }
}
