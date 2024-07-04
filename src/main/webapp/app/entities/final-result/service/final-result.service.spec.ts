import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IFinalResult, FinalResult } from '../final-result.model';

import { FinalResultService } from './final-result.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('FinalResult Service', () => {
  let service: FinalResultService;
  let httpMock: HttpTestingController;
  let elemDefault: IFinalResult;
  let expectedResult: IFinalResult | IFinalResult[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(FinalResultService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      note: 0,
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

    it('should create a FinalResult', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FinalResult()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should update a FinalResult', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          note: 1,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should partial update a FinalResult', () => {
      const patchObject = Object.assign(
        {
          note: 1,
        },
        new FinalResult(),
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchSnapshot(expected);
    });

    it('should return a list of FinalResult', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          note: 1,
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

    it('should delete a FinalResult', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFinalResultToCollectionIfMissing', () => {
      it('should add a FinalResult to an empty array', () => {
        const finalResult: IFinalResult = { id: 123 };
        expectedResult = service.addFinalResultToCollectionIfMissing([], finalResult);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(finalResult);
      });

      it('should not add a FinalResult to an array that contains it', () => {
        const finalResult: IFinalResult = { id: 123 };
        const finalResultCollection: IFinalResult[] = [
          {
            ...finalResult,
          },
          { id: 456 },
        ];
        expectedResult = service.addFinalResultToCollectionIfMissing(finalResultCollection, finalResult);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FinalResult to an array that doesn't contain it", () => {
        const finalResult: IFinalResult = { id: 123 };
        const finalResultCollection: IFinalResult[] = [{ id: 456 }];
        expectedResult = service.addFinalResultToCollectionIfMissing(finalResultCollection, finalResult);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(finalResult);
      });

      it('should add only unique FinalResult to an array', () => {
        const finalResultArray: IFinalResult[] = [{ id: 123 }, { id: 456 }, { id: 87960 }];
        const finalResultCollection: IFinalResult[] = [{ id: 123 }];
        expectedResult = service.addFinalResultToCollectionIfMissing(finalResultCollection, ...finalResultArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const finalResult: IFinalResult = { id: 123 };
        const finalResult2: IFinalResult = { id: 456 };
        expectedResult = service.addFinalResultToCollectionIfMissing([], finalResult, finalResult2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(finalResult);
        expect(expectedResult).toContain(finalResult2);
      });

      it('should accept null and undefined values', () => {
        const finalResult: IFinalResult = { id: 123 };
        expectedResult = service.addFinalResultToCollectionIfMissing([], null, finalResult, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(finalResult);
      });

      it('should return initial array if no FinalResult is added', () => {
        const finalResultCollection: IFinalResult[] = [{ id: 123 }];
        expectedResult = service.addFinalResultToCollectionIfMissing(finalResultCollection, undefined, null);
        expect(expectedResult).toEqual(finalResultCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
