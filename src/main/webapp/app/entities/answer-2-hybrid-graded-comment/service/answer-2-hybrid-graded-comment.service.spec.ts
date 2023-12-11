import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../answer-2-hybrid-graded-comment.test-samples';

import { Answer2HybridGradedCommentService } from './answer-2-hybrid-graded-comment.service';

const requireRestSample: IAnswer2HybridGradedComment = {
  ...sampleWithRequiredData,
};

describe('Answer2HybridGradedComment Service', () => {
  let service: Answer2HybridGradedCommentService;
  let httpMock: HttpTestingController;
  let expectedResult: IAnswer2HybridGradedComment | IAnswer2HybridGradedComment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Answer2HybridGradedCommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Answer2HybridGradedComment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const answer2HybridGradedComment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(answer2HybridGradedComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Answer2HybridGradedComment', () => {
      const answer2HybridGradedComment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(answer2HybridGradedComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Answer2HybridGradedComment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Answer2HybridGradedComment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Answer2HybridGradedComment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAnswer2HybridGradedCommentToCollectionIfMissing', () => {
      it('should add a Answer2HybridGradedComment to an empty array', () => {
        const answer2HybridGradedComment: IAnswer2HybridGradedComment = sampleWithRequiredData;
        expectedResult = service.addAnswer2HybridGradedCommentToCollectionIfMissing([], answer2HybridGradedComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(answer2HybridGradedComment);
      });

      it('should not add a Answer2HybridGradedComment to an array that contains it', () => {
        const answer2HybridGradedComment: IAnswer2HybridGradedComment = sampleWithRequiredData;
        const answer2HybridGradedCommentCollection: IAnswer2HybridGradedComment[] = [
          {
            ...answer2HybridGradedComment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAnswer2HybridGradedCommentToCollectionIfMissing(
          answer2HybridGradedCommentCollection,
          answer2HybridGradedComment,
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Answer2HybridGradedComment to an array that doesn't contain it", () => {
        const answer2HybridGradedComment: IAnswer2HybridGradedComment = sampleWithRequiredData;
        const answer2HybridGradedCommentCollection: IAnswer2HybridGradedComment[] = [sampleWithPartialData];
        expectedResult = service.addAnswer2HybridGradedCommentToCollectionIfMissing(
          answer2HybridGradedCommentCollection,
          answer2HybridGradedComment,
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(answer2HybridGradedComment);
      });

      it('should add only unique Answer2HybridGradedComment to an array', () => {
        const answer2HybridGradedCommentArray: IAnswer2HybridGradedComment[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const answer2HybridGradedCommentCollection: IAnswer2HybridGradedComment[] = [sampleWithRequiredData];
        expectedResult = service.addAnswer2HybridGradedCommentToCollectionIfMissing(
          answer2HybridGradedCommentCollection,
          ...answer2HybridGradedCommentArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const answer2HybridGradedComment: IAnswer2HybridGradedComment = sampleWithRequiredData;
        const answer2HybridGradedComment2: IAnswer2HybridGradedComment = sampleWithPartialData;
        expectedResult = service.addAnswer2HybridGradedCommentToCollectionIfMissing(
          [],
          answer2HybridGradedComment,
          answer2HybridGradedComment2,
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(answer2HybridGradedComment);
        expect(expectedResult).toContain(answer2HybridGradedComment2);
      });

      it('should accept null and undefined values', () => {
        const answer2HybridGradedComment: IAnswer2HybridGradedComment = sampleWithRequiredData;
        expectedResult = service.addAnswer2HybridGradedCommentToCollectionIfMissing([], null, answer2HybridGradedComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(answer2HybridGradedComment);
      });

      it('should return initial array if no Answer2HybridGradedComment is added', () => {
        const answer2HybridGradedCommentCollection: IAnswer2HybridGradedComment[] = [sampleWithRequiredData];
        expectedResult = service.addAnswer2HybridGradedCommentToCollectionIfMissing(answer2HybridGradedCommentCollection, undefined, null);
        expect(expectedResult).toEqual(answer2HybridGradedCommentCollection);
      });
    });

    describe('compareAnswer2HybridGradedComment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAnswer2HybridGradedComment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAnswer2HybridGradedComment(entity1, entity2);
        const compareResult2 = service.compareAnswer2HybridGradedComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAnswer2HybridGradedComment(entity1, entity2);
        const compareResult2 = service.compareAnswer2HybridGradedComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAnswer2HybridGradedComment(entity1, entity2);
        const compareResult2 = service.compareAnswer2HybridGradedComment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
