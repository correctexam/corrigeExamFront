import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { IQuestion, Question } from '../question.model';

import { QuestionService } from './question.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('Question Service', () => {
  let service: QuestionService;
  let httpMock: HttpTestingController;
  let elemDefault: IQuestion;
  let expectedResult: IQuestion | IQuestion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(QuestionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      numero: 0,
      point: 0,
      step: 0,
      validExpression: 'AAAAAAA',
      gradeType: GradeType.DIRECT,
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

    it('should create a Question', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Question()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Question', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numero: 1,
          point: 1,
          step: 1,
          validExpression: 'BBBBBB',
          gradeType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Question', () => {
      const patchObject = Object.assign(
        {
          numero: 1,
          step: 1,
        },
        new Question()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Question', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numero: 1,
          point: 1,
          step: 1,
          validExpression: 'BBBBBB',
          gradeType: 'BBBBBB',
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

    it('should delete a Question', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addQuestionToCollectionIfMissing', () => {
      it('should add a Question to an empty array', () => {
        const question: IQuestion = { id: 123 };
        expectedResult = service.addQuestionToCollectionIfMissing([], question);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(question);
      });

      it('should not add a Question to an array that contains it', () => {
        const question: IQuestion = { id: 123 };
        const questionCollection: IQuestion[] = [
          {
            ...question,
          },
          { id: 456 },
        ];
        expectedResult = service.addQuestionToCollectionIfMissing(questionCollection, question);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Question to an array that doesn't contain it", () => {
        const question: IQuestion = { id: 123 };
        const questionCollection: IQuestion[] = [{ id: 456 }];
        expectedResult = service.addQuestionToCollectionIfMissing(questionCollection, question);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(question);
      });

      it('should add only unique Question to an array', () => {
        const questionArray: IQuestion[] = [{ id: 123 }, { id: 456 }, { id: 25605 }];
        const questionCollection: IQuestion[] = [{ id: 123 }];
        expectedResult = service.addQuestionToCollectionIfMissing(questionCollection, ...questionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const question: IQuestion = { id: 123 };
        const question2: IQuestion = { id: 456 };
        expectedResult = service.addQuestionToCollectionIfMissing([], question, question2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(question);
        expect(expectedResult).toContain(question2);
      });

      it('should accept null and undefined values', () => {
        const question: IQuestion = { id: 123 };
        expectedResult = service.addQuestionToCollectionIfMissing([], null, question, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(question);
      });

      it('should return initial array if no Question is added', () => {
        const questionCollection: IQuestion[] = [{ id: 123 }];
        expectedResult = service.addQuestionToCollectionIfMissing(questionCollection, undefined, null);
        expect(expectedResult).toEqual(questionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
