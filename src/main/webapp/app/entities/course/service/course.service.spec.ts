import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ICourse, Course } from '../course.model';

import { CourseService } from './course.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Course Service', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;
  let elemDefault: ICourse;
  let expectedResult: ICourse | ICourse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    expectedResult = null;
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
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

    it('should create a Course', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Course()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should update a Course', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should return a list of Course', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should delete a Course', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCourseToCollectionIfMissing', () => {
      it('should add a Course to an empty array', () => {
        const course: ICourse = { id: 123 };
        expectedResult = service.addCourseToCollectionIfMissing([], course);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(course);
      });

      it('should not add a Course to an array that contains it', () => {
        const course: ICourse = { id: 123 };
        const courseCollection: ICourse[] = [
          {
            ...course,
          },
          { id: 456 },
        ];
        expectedResult = service.addCourseToCollectionIfMissing(courseCollection, course);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Course to an array that doesn't contain it", () => {
        const course: ICourse = { id: 123 };
        const courseCollection: ICourse[] = [{ id: 456 }];
        expectedResult = service.addCourseToCollectionIfMissing(courseCollection, course);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(course);
      });

      it('should add only unique Course to an array', () => {
        const courseArray: ICourse[] = [{ id: 123 }, { id: 456 }, { id: 4484 }];
        const courseCollection: ICourse[] = [{ id: 123 }];
        expectedResult = service.addCourseToCollectionIfMissing(courseCollection, ...courseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const course: ICourse = { id: 123 };
        const course2: ICourse = { id: 456 };
        expectedResult = service.addCourseToCollectionIfMissing([], course, course2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(course);
        expect(expectedResult).toContain(course2);
      });

      it('should accept null and undefined values', () => {
        const course: ICourse = { id: 123 };
        expectedResult = service.addCourseToCollectionIfMissing([], null, course, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(course);
      });

      it('should return initial array if no Course is added', () => {
        const courseCollection: ICourse[] = [{ id: 123 }];
        expectedResult = service.addCourseToCollectionIfMissing(courseCollection, undefined, null);
        expect(expectedResult).toEqual(courseCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
