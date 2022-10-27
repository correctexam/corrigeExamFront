import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITextComment, TextComment } from '../text-comment.model';

import { TextCommentService } from './text-comment.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('TextComment Service', () => {
  let service: TextCommentService;
  let httpMock: HttpTestingController;
  let elemDefault: ITextComment;
  let expectedResult: ITextComment | ITextComment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TextCommentService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      text: 'AAAAAAA',
      description: 'AAAAAAA',
      zonegeneratedid: 'AAAAAAA',
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

    it('should create a TextComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TextComment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TextComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          text: 'BBBBBB',
          zonegeneratedid: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TextComment', () => {
      const patchObject = Object.assign(
        {
          text: 'BBBBBB',
          zonegeneratedid: 'BBBBBB',
        },
        new TextComment()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TextComment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          text: 'BBBBBB',
          description: 'BBBBBB',
          zonegeneratedid: 'BBBBBB',
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

    it('should delete a TextComment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTextCommentToCollectionIfMissing', () => {
      it('should add a TextComment to an empty array', () => {
        const textComment: ITextComment = { id: 123 };
        expectedResult = service.addTextCommentToCollectionIfMissing([], textComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(textComment);
      });

      it('should not add a TextComment to an array that contains it', () => {
        const textComment: ITextComment = { id: 123 };
        const textCommentCollection: ITextComment[] = [
          {
            ...textComment,
          },
          { id: 456 },
        ];
        expectedResult = service.addTextCommentToCollectionIfMissing(textCommentCollection, textComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TextComment to an array that doesn't contain it", () => {
        const textComment: ITextComment = { id: 123 };
        const textCommentCollection: ITextComment[] = [{ id: 456 }];
        expectedResult = service.addTextCommentToCollectionIfMissing(textCommentCollection, textComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(textComment);
      });

      it('should add only unique TextComment to an array', () => {
        const textCommentArray: ITextComment[] = [{ id: 123 }, { id: 456 }, { id: 49171 }];
        const textCommentCollection: ITextComment[] = [{ id: 123 }];
        expectedResult = service.addTextCommentToCollectionIfMissing(textCommentCollection, ...textCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const textComment: ITextComment = { id: 123 };
        const textComment2: ITextComment = { id: 456 };
        expectedResult = service.addTextCommentToCollectionIfMissing([], textComment, textComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(textComment);
        expect(expectedResult).toContain(textComment2);
      });

      it('should accept null and undefined values', () => {
        const textComment: ITextComment = { id: 123 };
        expectedResult = service.addTextCommentToCollectionIfMissing([], null, textComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(textComment);
      });

      it('should return initial array if no TextComment is added', () => {
        const textCommentCollection: ITextComment[] = [{ id: 123 }];
        expectedResult = service.addTextCommentToCollectionIfMissing(textCommentCollection, undefined, null);
        expect(expectedResult).toEqual(textCommentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
