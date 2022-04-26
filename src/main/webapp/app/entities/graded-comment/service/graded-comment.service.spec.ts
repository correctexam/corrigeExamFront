import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGradedComment, GradedComment } from '../graded-comment.model';

import { GradedCommentService } from './graded-comment.service';

describe('GradedComment Service', () => {
  let service: GradedCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: IGradedComment;
  let expectedResult: IGradedComment | IGradedComment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GradedCommentService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      zonegeneratedid: 'AAAAAAA',
      text: 'AAAAAAA',
      grade: 0,
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

    it('should create a GradedComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new GradedComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GradedComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          zonegeneratedid: 'BBBBBB',
          text: 'BBBBBB',
          grade: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GradedComment', () => {
      const patchObject = Object.assign(
        {
          zonegeneratedid: 'BBBBBB',
        },
        new GradedComment()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GradedComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          zonegeneratedid: 'BBBBBB',
          text: 'BBBBBB',
          grade: 1,
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

    it('should delete a GradedComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGradedCommentToCollectionIfMissing', () => {
      it('should add a GradedComment to an empty array', () => {
        const gradedComment: IGradedComment = { id: 123 };
        expectedResult = service.addGradedCommentToCollectionIfMissing([], gradedComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gradedComment);
      });

      it('should not add a GradedComment to an array that contains it', () => {
        const gradedComment: IGradedComment = { id: 123 };
        const gradedCommentCollection: IGradedComment[] = [
          {
            ...gradedComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addGradedCommentToCollectionIfMissing(gradedCommentCollection, gradedComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GradedComment to an array that doesn't contain it", () => {
        const gradedComment: IGradedComment = { id: 123 };
        const gradedCommentCollection: IGradedComment[] = [{ id: 456 }];
        expectedResult = service.addGradedCommentToCollectionIfMissing(gradedCommentCollection, gradedComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gradedComment);
      });

      it('should add only unique GradedComment to an array', () => {
        const gradedCommentArray: IGradedComment[] = [{ id: 123 }, { id: 456 }, { id: 97979 }];
        const gradedCommentCollection: IGradedComment[] = [{ id: 123 }];
        expectedResult = service.addGradedCommentToCollectionIfMissing(gradedCommentCollection, ...gradedCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gradedComment: IGradedComment = { id: 123 };
        const gradedComment2: IGradedComment = { id: 456 };
        expectedResult = service.addGradedCommentToCollectionIfMissing([], gradedComment, gradedComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gradedComment);
        expect(expectedResult).toContain(gradedComment2);
      });

      it('should accept null and undefined values', () => {
        const gradedComment: IGradedComment = { id: 123 };
        expectedResult = service.addGradedCommentToCollectionIfMissing([], null, gradedComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gradedComment);
      });

      it('should return initial array if no GradedComment is added', () => {
        const gradedCommentCollection: IGradedComment[] = [{ id: 123 }];
        expectedResult = service.addGradedCommentToCollectionIfMissing(gradedCommentCollection, undefined, null);
        expect(expectedResult).toEqual(gradedCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
