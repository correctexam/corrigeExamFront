import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IHybridGradedComment } from '../hybrid-graded-comment.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../hybrid-graded-comment.test-samples';

import { HybridGradedCommentService } from './hybrid-graded-comment.service';
import { provideHttpClient } from '@angular/common/http';

const requireRestSample: IHybridGradedComment = {
  ...sampleWithRequiredData,
};

describe('HybridGradedComment Service', () => {
  let service: HybridGradedCommentService;
  let httpMock: HttpTestingController;
  let expectedResult: IHybridGradedComment | IHybridGradedComment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(HybridGradedCommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should create a HybridGradedComment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const hybridGradedComment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(hybridGradedComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should update a HybridGradedComment', () => {
      const hybridGradedComment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(hybridGradedComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should partial update a HybridGradedComment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should return a list of HybridGradedComment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HybridGradedComment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHybridGradedCommentToCollectionIfMissing', () => {
      it('should add a HybridGradedComment to an empty array', () => {
        const hybridGradedComment: IHybridGradedComment = sampleWithRequiredData;
        expectedResult = service.addHybridGradedCommentToCollectionIfMissing([], hybridGradedComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hybridGradedComment);
      });

      it('should not add a HybridGradedComment to an array that contains it', () => {
        const hybridGradedComment: IHybridGradedComment = sampleWithRequiredData;
        const hybridGradedCommentCollection: IHybridGradedComment[] = [
          {
            ...hybridGradedComment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHybridGradedCommentToCollectionIfMissing(hybridGradedCommentCollection, hybridGradedComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HybridGradedComment to an array that doesn't contain it", () => {
        const hybridGradedComment: IHybridGradedComment = sampleWithRequiredData;
        const hybridGradedCommentCollection: IHybridGradedComment[] = [sampleWithPartialData];
        expectedResult = service.addHybridGradedCommentToCollectionIfMissing(hybridGradedCommentCollection, hybridGradedComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hybridGradedComment);
      });

      it('should add only unique HybridGradedComment to an array', () => {
        const hybridGradedCommentArray: IHybridGradedComment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const hybridGradedCommentCollection: IHybridGradedComment[] = [sampleWithRequiredData];
        expectedResult = service.addHybridGradedCommentToCollectionIfMissing(hybridGradedCommentCollection, ...hybridGradedCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const hybridGradedComment: IHybridGradedComment = sampleWithRequiredData;
        const hybridGradedComment2: IHybridGradedComment = sampleWithPartialData;
        expectedResult = service.addHybridGradedCommentToCollectionIfMissing([], hybridGradedComment, hybridGradedComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hybridGradedComment);
        expect(expectedResult).toContain(hybridGradedComment2);
      });

      it('should accept null and undefined values', () => {
        const hybridGradedComment: IHybridGradedComment = sampleWithRequiredData;
        expectedResult = service.addHybridGradedCommentToCollectionIfMissing([], null, hybridGradedComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hybridGradedComment);
      });

      it('should return initial array if no HybridGradedComment is added', () => {
        const hybridGradedCommentCollection: IHybridGradedComment[] = [sampleWithRequiredData];
        expectedResult = service.addHybridGradedCommentToCollectionIfMissing(hybridGradedCommentCollection, undefined, null);
        expect(expectedResult).toEqual(hybridGradedCommentCollection);
      });
    });

    describe('compareHybridGradedComment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHybridGradedComment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHybridGradedComment(entity1, entity2);
        const compareResult2 = service.compareHybridGradedComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHybridGradedComment(entity1, entity2);
        const compareResult2 = service.compareHybridGradedComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHybridGradedComment(entity1, entity2);
        const compareResult2 = service.compareHybridGradedComment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
