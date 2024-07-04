import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IStudentResponse, StudentResponse } from '../student-response.model';

import { StudentResponseService } from './student-response.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('StudentResponse Service', () => {
  let service: StudentResponseService;
  let httpMock: HttpTestingController;
  let elemDefault: IStudentResponse;
  let expectedResult: IStudentResponse | IStudentResponse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(StudentResponseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      note: 0,
      star: false,
      worststar: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(elemDefault);
    });

    it('should create a StudentResponse', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new StudentResponse()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should update a StudentResponse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          note: 1,
          star: true,
          worststar: true,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should partial update a StudentResponse', () => {
      const patchObject = Object.assign(
        {
          star: true,
        },
        new StudentResponse(),
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should return a list of StudentResponse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          note: 1,
          star: true,
          worststar: true,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a StudentResponse', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStudentResponseToCollectionIfMissing', () => {
      it('should add a StudentResponse to an empty array', () => {
        const studentResponse: IStudentResponse = { id: 123 };
        expectedResult = service.addStudentResponseToCollectionIfMissing([], studentResponse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(studentResponse);
      });

      it('should not add a StudentResponse to an array that contains it', () => {
        const studentResponse: IStudentResponse = { id: 123 };
        const studentResponseCollection: IStudentResponse[] = [
          {
            ...studentResponse,
          },
          { id: 456 },
        ];
        expectedResult = service.addStudentResponseToCollectionIfMissing(studentResponseCollection, studentResponse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StudentResponse to an array that doesn't contain it", () => {
        const studentResponse: IStudentResponse = { id: 123 };
        const studentResponseCollection: IStudentResponse[] = [{ id: 456 }];
        expectedResult = service.addStudentResponseToCollectionIfMissing(studentResponseCollection, studentResponse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(studentResponse);
      });

      it('should add only unique StudentResponse to an array', () => {
        const studentResponseArray: IStudentResponse[] = [{ id: 123 }, { id: 456 }, { id: 28658 }];
        const studentResponseCollection: IStudentResponse[] = [{ id: 123 }];
        expectedResult = service.addStudentResponseToCollectionIfMissing(studentResponseCollection, ...studentResponseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const studentResponse: IStudentResponse = { id: 123 };
        const studentResponse2: IStudentResponse = { id: 456 };
        expectedResult = service.addStudentResponseToCollectionIfMissing([], studentResponse, studentResponse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(studentResponse);
        expect(expectedResult).toContain(studentResponse2);
      });

      it('should accept null and undefined values', () => {
        const studentResponse: IStudentResponse = { id: 123 };
        expectedResult = service.addStudentResponseToCollectionIfMissing([], null, studentResponse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(studentResponse);
      });

      it('should return initial array if no StudentResponse is added', () => {
        const studentResponseCollection: IStudentResponse[] = [{ id: 123 }];
        expectedResult = service.addStudentResponseToCollectionIfMissing(studentResponseCollection, undefined, null);
        expect(expectedResult).toEqual(studentResponseCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
