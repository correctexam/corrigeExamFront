import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IQuestionType, QuestionType } from '../question-type.model';

import { QuestionTypeService } from './question-type.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('QuestionType Service', () => {
  let service: QuestionTypeService;
  let httpMock: HttpTestingController;
  let elemDefault: IQuestionType;
  let expectedResult: IQuestionType | IQuestionType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(QuestionTypeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      algoName: 'AAAAAAA',
      endpoint: 'AAAAAAA',
      jsFunction: 'AAAAAAA',
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

    it('should create a QuestionType', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new QuestionType()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should update a QuestionType', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          algoName: 'BBBBBB',
          endpoint: 'BBBBBB',
          jsFunction: 'BBBBBB',
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should partial update a QuestionType', () => {
      const patchObject = Object.assign(
        {
          endpoint: 'BBBBBB',
          jsFunction: 'BBBBBB',
        },
        new QuestionType(),
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should return a list of QuestionType', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          algoName: 'BBBBBB',
          endpoint: 'BBBBBB',
          jsFunction: 'BBBBBB',
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

    it('should delete a QuestionType', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addQuestionTypeToCollectionIfMissing', () => {
      it('should add a QuestionType to an empty array', () => {
        const questionType: IQuestionType = { id: 123 };
        expectedResult = service.addQuestionTypeToCollectionIfMissing([], questionType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(questionType);
      });

      it('should not add a QuestionType to an array that contains it', () => {
        const questionType: IQuestionType = { id: 123 };
        const questionTypeCollection: IQuestionType[] = [
          {
            ...questionType,
          },
          { id: 456 },
        ];
        expectedResult = service.addQuestionTypeToCollectionIfMissing(questionTypeCollection, questionType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a QuestionType to an array that doesn't contain it", () => {
        const questionType: IQuestionType = { id: 123 };
        const questionTypeCollection: IQuestionType[] = [{ id: 456 }];
        expectedResult = service.addQuestionTypeToCollectionIfMissing(questionTypeCollection, questionType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(questionType);
      });

      it('should add only unique QuestionType to an array', () => {
        const questionTypeArray: IQuestionType[] = [{ id: 123 }, { id: 456 }, { id: 52692 }];
        const questionTypeCollection: IQuestionType[] = [{ id: 123 }];
        expectedResult = service.addQuestionTypeToCollectionIfMissing(questionTypeCollection, ...questionTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const questionType: IQuestionType = { id: 123 };
        const questionType2: IQuestionType = { id: 456 };
        expectedResult = service.addQuestionTypeToCollectionIfMissing([], questionType, questionType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(questionType);
        expect(expectedResult).toContain(questionType2);
      });

      it('should accept null and undefined values', () => {
        const questionType: IQuestionType = { id: 123 };
        expectedResult = service.addQuestionTypeToCollectionIfMissing([], null, questionType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(questionType);
      });

      it('should return initial array if no QuestionType is added', () => {
        const questionTypeCollection: IQuestionType[] = [{ id: 123 }];
        expectedResult = service.addQuestionTypeToCollectionIfMissing(questionTypeCollection, undefined, null);
        expect(expectedResult).toEqual(questionTypeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
