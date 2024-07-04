import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IScan, Scan } from '../scan.model';

import { ScanService } from './scan.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('Scan Service', () => {
  let service: ScanService;
  let httpMock: HttpTestingController;
  let elemDefault: IScan;
  let expectedResult: IScan | IScan[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ScanService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      contentContentType: 'image/png',
      content: 'AAAAAAA',
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

    it('should create a Scan', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Scan()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should update a Scan', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          content: 'BBBBBB',
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should partial update a Scan', () => {
      const patchObject = Object.assign({}, new Scan());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should return a list of Scan', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          content: 'BBBBBB',
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

    it('should delete a Scan', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addScanToCollectionIfMissing', () => {
      it('should add a Scan to an empty array', () => {
        const scan: IScan = { id: 123 };
        expectedResult = service.addScanToCollectionIfMissing([], scan);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(scan);
      });

      it('should not add a Scan to an array that contains it', () => {
        const scan: IScan = { id: 123 };
        const scanCollection: IScan[] = [
          {
            ...scan,
          },
          { id: 456 },
        ];
        expectedResult = service.addScanToCollectionIfMissing(scanCollection, scan);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Scan to an array that doesn't contain it", () => {
        const scan: IScan = { id: 123 };
        const scanCollection: IScan[] = [{ id: 456 }];
        expectedResult = service.addScanToCollectionIfMissing(scanCollection, scan);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(scan);
      });

      it('should add only unique Scan to an array', () => {
        const scanArray: IScan[] = [{ id: 123 }, { id: 456 }, { id: 61183 }];
        const scanCollection: IScan[] = [{ id: 123 }];
        expectedResult = service.addScanToCollectionIfMissing(scanCollection, ...scanArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const scan: IScan = { id: 123 };
        const scan2: IScan = { id: 456 };
        expectedResult = service.addScanToCollectionIfMissing([], scan, scan2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(scan);
        expect(expectedResult).toContain(scan2);
      });

      it('should accept null and undefined values', () => {
        const scan: IScan = { id: 123 };
        expectedResult = service.addScanToCollectionIfMissing([], null, scan, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(scan);
      });

      it('should return initial array if no Scan is added', () => {
        const scanCollection: IScan[] = [{ id: 123 }];
        expectedResult = service.addScanToCollectionIfMissing(scanCollection, undefined, null);
        expect(expectedResult).toEqual(scanCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
