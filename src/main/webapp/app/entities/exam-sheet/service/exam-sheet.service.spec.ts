import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IExamSheet, ExamSheet } from '../exam-sheet.model';

import { ExamSheetService } from './exam-sheet.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('ExamSheet Service', () => {
  let service: ExamSheetService;
  let httpMock: HttpTestingController;
  let elemDefault: IExamSheet;
  let expectedResult: IExamSheet | IExamSheet[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ExamSheetService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      pagemin: 0,
      pagemax: 0,
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

    it('should create a ExamSheet', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ExamSheet()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should update a ExamSheet', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          pagemin: 1,
          pagemax: 1,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should partial update a ExamSheet', () => {
      const patchObject = Object.assign(
        {
          pagemin: 1,
          pagemax: 1,
        },
        new ExamSheet(),
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should return a list of ExamSheet', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          pagemin: 1,
          pagemax: 1,
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

    it('should delete a ExamSheet', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExamSheetToCollectionIfMissing', () => {
      it('should add a ExamSheet to an empty array', () => {
        const examSheet: IExamSheet = { id: 123 };
        expectedResult = service.addExamSheetToCollectionIfMissing([], examSheet);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(examSheet);
      });

      it('should not add a ExamSheet to an array that contains it', () => {
        const examSheet: IExamSheet = { id: 123 };
        const examSheetCollection: IExamSheet[] = [
          {
            ...examSheet,
          },
          { id: 456 },
        ];
        expectedResult = service.addExamSheetToCollectionIfMissing(examSheetCollection, examSheet);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExamSheet to an array that doesn't contain it", () => {
        const examSheet: IExamSheet = { id: 123 };
        const examSheetCollection: IExamSheet[] = [{ id: 456 }];
        expectedResult = service.addExamSheetToCollectionIfMissing(examSheetCollection, examSheet);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(examSheet);
      });

      it('should add only unique ExamSheet to an array', () => {
        const examSheetArray: IExamSheet[] = [{ id: 123 }, { id: 456 }, { id: 92735 }];
        const examSheetCollection: IExamSheet[] = [{ id: 123 }];
        expectedResult = service.addExamSheetToCollectionIfMissing(examSheetCollection, ...examSheetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const examSheet: IExamSheet = { id: 123 };
        const examSheet2: IExamSheet = { id: 456 };
        expectedResult = service.addExamSheetToCollectionIfMissing([], examSheet, examSheet2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(examSheet);
        expect(expectedResult).toContain(examSheet2);
      });

      it('should accept null and undefined values', () => {
        const examSheet: IExamSheet = { id: 123 };
        expectedResult = service.addExamSheetToCollectionIfMissing([], null, examSheet, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(examSheet);
      });

      it('should return initial array if no ExamSheet is added', () => {
        const examSheetCollection: IExamSheet[] = [{ id: 123 }];
        expectedResult = service.addExamSheetToCollectionIfMissing(examSheetCollection, undefined, null);
        expect(expectedResult).toEqual(examSheetCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
