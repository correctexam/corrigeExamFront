import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITemplate, getTemplateIdentifier } from '../template.model';

export type EntityResponseType = HttpResponse<ITemplate>;
export type EntityArrayResponseType = HttpResponse<ITemplate[]>;

@Injectable({ providedIn: 'root' })
export class TemplateService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/templates');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(template: ITemplate): Observable<EntityResponseType> {
    return this.http.post<ITemplate>(this.resourceUrl, template, { observe: 'response' });
  }

  update(template: ITemplate): Observable<EntityResponseType> {
    return this.http.put<ITemplate>(`${this.resourceUrl}/${getTemplateIdentifier(template) as number}`, template, { observe: 'response' });
  }

  partialUpdate(template: ITemplate): Observable<EntityResponseType> {
    return this.http.patch<ITemplate>(`${this.resourceUrl}/${getTemplateIdentifier(template) as number}`, template, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITemplate>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITemplate[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTemplateToCollectionIfMissing(templateCollection: ITemplate[], ...templatesToCheck: (ITemplate | null | undefined)[]): ITemplate[] {
    const templates: ITemplate[] = templatesToCheck.filter(isPresent);
    if (templates.length > 0) {
      const templateCollectionIdentifiers = templateCollection.map(templateItem => getTemplateIdentifier(templateItem)!);
      const templatesToAdd = templates.filter(templateItem => {
        const templateIdentifier = getTemplateIdentifier(templateItem);
        if (templateIdentifier == null || templateCollectionIdentifiers.includes(templateIdentifier)) {
          return false;
        }
        templateCollectionIdentifiers.push(templateIdentifier);
        return true;
      });
      return [...templatesToAdd, ...templateCollection];
    }
    return templateCollection;
  }
}
