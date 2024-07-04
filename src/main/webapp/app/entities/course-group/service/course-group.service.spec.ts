/* eslint-disable @typescript-eslint/no-unsafe-return */
import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ICourseGroup, CourseGroup } from '../course-group.model';

import { CourseGroupService } from './course-group.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('CourseGroup Service', () => {
  let service: CourseGroupService;
  let httpMock: HttpTestingController;
  let elemDefault: ICourseGroup;
  let expectedResult: ICourseGroup | ICourseGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CourseGroupService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      groupName: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault as any);
    });

    it('should create a CourseGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CourseGroup()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should update a CourseGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          groupName: 'BBBBBB',
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should return a list of CourseGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          groupName: 'BBBBBB',
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

    it('should delete a CourseGroup', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCourseGroupToCollectionIfMissing', () => {
      it('should add a CourseGroup to an empty array', () => {
        const courseGroup: ICourseGroup = { id: 123 };
        expectedResult = service.addCourseGroupToCollectionIfMissing([], courseGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(courseGroup);
      });

      it('should not add a CourseGroup to an array that contains it', () => {
        const courseGroup: ICourseGroup = { id: 123 };
        const courseGroupCollection: ICourseGroup[] = [
          {
            ...courseGroup,
          },
          { id: 456 },
        ];
        expectedResult = service.addCourseGroupToCollectionIfMissing(courseGroupCollection, courseGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CourseGroup to an array that doesn't contain it", () => {
        const courseGroup: ICourseGroup = { id: 123 };
        const courseGroupCollection: ICourseGroup[] = [{ id: 456 }];
        expectedResult = service.addCourseGroupToCollectionIfMissing(courseGroupCollection, courseGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courseGroup);
      });

      it('should add only unique CourseGroup to an array', () => {
        const courseGroupArray: ICourseGroup[] = [{ id: 123 }, { id: 456 }, { id: 36055 }];
        const courseGroupCollection: ICourseGroup[] = [{ id: 123 }];
        expectedResult = service.addCourseGroupToCollectionIfMissing(courseGroupCollection, ...courseGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const courseGroup: ICourseGroup = { id: 123 };
        const courseGroup2: ICourseGroup = { id: 456 };
        expectedResult = service.addCourseGroupToCollectionIfMissing([], courseGroup, courseGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courseGroup);
        expect(expectedResult).toContain(courseGroup2);
      });

      it('should accept null and undefined values', () => {
        const courseGroup: ICourseGroup = { id: 123 };
        expectedResult = service.addCourseGroupToCollectionIfMissing([], null, courseGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(courseGroup);
      });

      it('should return initial array if no CourseGroup is added', () => {
        const courseGroupCollection: ICourseGroup[] = [{ id: 123 }];
        expectedResult = service.addCourseGroupToCollectionIfMissing(courseGroupCollection, undefined, null);
        expect(expectedResult).toEqual(courseGroupCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
