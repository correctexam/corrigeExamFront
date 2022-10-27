import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IComments, Comments } from '../comments.model';

import { CommentsService } from './comments.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('Comments Service', () => {
  let service: CommentsService;
  let httpMock: HttpTestingController;
  let elemDefault: IComments;
  let expectedResult: IComments | IComments[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      zonegeneratedid: 'AAAAAAA',
      jsonData: 'AAAAAAA',
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

    it('should create a Comments', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Comments()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Comments', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jsonData: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Comments', () => {
      const patchObject = Object.assign(
        {
          jsonData: 'BBBBBB',
        },
        new Comments()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Comments', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          jsonData: 'BBBBBB',
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

    it('should delete a Comments', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCommentsToCollectionIfMissing', () => {
      it('should add a Comments to an empty array', () => {
        const comments: IComments = { id: 123 };
        expectedResult = service.addCommentsToCollectionIfMissing([], comments);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(comments);
      });

      it('should not add a Comments to an array that contains it', () => {
        const comments: IComments = { id: 123 };
        const commentsCollection: IComments[] = [
          {
            ...comments,
          },
          { id: 456 },
        ];
        expectedResult = service.addCommentsToCollectionIfMissing(commentsCollection, comments);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Comments to an array that doesn't contain it", () => {
        const comments: IComments = { id: 123 };
        const commentsCollection: IComments[] = [{ id: 456 }];
        expectedResult = service.addCommentsToCollectionIfMissing(commentsCollection, comments);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(comments);
      });

      it('should add only unique Comments to an array', () => {
        const commentsArray: IComments[] = [{ id: 123 }, { id: 456 }, { id: 5934 }];
        const commentsCollection: IComments[] = [{ id: 123 }];
        expectedResult = service.addCommentsToCollectionIfMissing(commentsCollection, ...commentsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const comments: IComments = { id: 123 };
        const comments2: IComments = { id: 456 };
        expectedResult = service.addCommentsToCollectionIfMissing([], comments, comments2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(comments);
        expect(expectedResult).toContain(comments2);
      });

      it('should accept null and undefined values', () => {
        const comments: IComments = { id: 123 };
        expectedResult = service.addCommentsToCollectionIfMissing([], null, comments, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(comments);
      });

      it('should return initial array if no Comments is added', () => {
        const commentsCollection: IComments[] = [{ id: 123 }];
        expectedResult = service.addCommentsToCollectionIfMissing(commentsCollection, undefined, null);
        expect(expectedResult).toEqual(commentsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
