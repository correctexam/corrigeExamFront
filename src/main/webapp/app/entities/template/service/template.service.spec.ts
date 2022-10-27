import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITemplate, Template } from '../template.model';

import { TemplateService } from './template.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('Template Service', () => {
  let service: TemplateService;
  let httpMock: HttpTestingController;
  let elemDefault: ITemplate;
  let expectedResult: ITemplate | ITemplate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TemplateService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      contentContentType: 'image/png',
      content: 'AAAAAAA',
      mark: false,
      autoMapStudentCopyToList: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Template', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Template()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Template', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          content: 'BBBBBB',
          mark: true,
          autoMapStudentCopyToList: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Template', () => {
      const patchObject = Object.assign(
        {
          mark: true,
          autoMapStudentCopyToList: true,
        },
        new Template()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Template', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          content: 'BBBBBB',
          mark: true,
          autoMapStudentCopyToList: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Template', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTemplateToCollectionIfMissing', () => {
      it('should add a Template to an empty array', () => {
        const template: ITemplate = { id: 123 };
        expectedResult = service.addTemplateToCollectionIfMissing([], template);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(template);
      });

      it('should not add a Template to an array that contains it', () => {
        const template: ITemplate = { id: 123 };
        const templateCollection: ITemplate[] = [
          {
            ...template,
          },
          { id: 456 },
        ];
        expectedResult = service.addTemplateToCollectionIfMissing(templateCollection, template);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Template to an array that doesn't contain it", () => {
        const template: ITemplate = { id: 123 };
        const templateCollection: ITemplate[] = [{ id: 456 }];
        expectedResult = service.addTemplateToCollectionIfMissing(templateCollection, template);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(template);
      });

      it('should add only unique Template to an array', () => {
        const templateArray: ITemplate[] = [{ id: 123 }, { id: 456 }, { id: 15801 }];
        const templateCollection: ITemplate[] = [{ id: 123 }];
        expectedResult = service.addTemplateToCollectionIfMissing(templateCollection, ...templateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const template: ITemplate = { id: 123 };
        const template2: ITemplate = { id: 456 };
        expectedResult = service.addTemplateToCollectionIfMissing([], template, template2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(template);
        expect(expectedResult).toContain(template2);
      });

      it('should accept null and undefined values', () => {
        const template: ITemplate = { id: 123 };
        expectedResult = service.addTemplateToCollectionIfMissing([], null, template, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(template);
      });

      it('should return initial array if no Template is added', () => {
        const templateCollection: ITemplate[] = [{ id: 123 }];
        expectedResult = service.addTemplateToCollectionIfMissing(templateCollection, undefined, null);
        expect(expectedResult).toEqual(templateCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
