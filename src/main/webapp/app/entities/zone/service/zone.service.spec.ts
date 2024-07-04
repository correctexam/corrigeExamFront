import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { IZone, Zone } from '../zone.model';

import { ZoneService } from './zone.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('Zone Service', () => {
  let service: ZoneService;
  let httpMock: HttpTestingController;
  let elemDefault: IZone;
  let expectedResult: IZone | IZone[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    expectedResult = null;
    service = TestBed.inject(ZoneService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      pageNumber: 0,
      xInit: 0,
      yInit: 0,
      width: 0,
      height: 0,
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

    it('should create a Zone', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Zone()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should update a Zone', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          pageNumber: 1,
          xInit: 1,
          yInit: 1,
          width: 1,
          height: 1,
        },
        elemDefault,
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should partial update a Zone', () => {
      const patchObject = Object.assign({}, new Zone());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected as any);
    });

    it('should return a list of Zone', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          pageNumber: 1,
          xInit: 1,
          yInit: 1,
          width: 1,
          height: 1,
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

    it('should delete a Zone', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addZoneToCollectionIfMissing', () => {
      it('should add a Zone to an empty array', () => {
        const zone: IZone = { id: 123 };
        expectedResult = service.addZoneToCollectionIfMissing([], zone);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(zone);
      });

      it('should not add a Zone to an array that contains it', () => {
        const zone: IZone = { id: 123 };
        const zoneCollection: IZone[] = [
          {
            ...zone,
          },
          { id: 456 },
        ];
        expectedResult = service.addZoneToCollectionIfMissing(zoneCollection, zone);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Zone to an array that doesn't contain it", () => {
        const zone: IZone = { id: 123 };
        const zoneCollection: IZone[] = [{ id: 456 }];
        expectedResult = service.addZoneToCollectionIfMissing(zoneCollection, zone);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(zone);
      });

      it('should add only unique Zone to an array', () => {
        const zoneArray: IZone[] = [{ id: 123 }, { id: 456 }, { id: 8779 }];
        const zoneCollection: IZone[] = [{ id: 123 }];
        expectedResult = service.addZoneToCollectionIfMissing(zoneCollection, ...zoneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const zone: IZone = { id: 123 };
        const zone2: IZone = { id: 456 };
        expectedResult = service.addZoneToCollectionIfMissing([], zone, zone2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(zone);
        expect(expectedResult).toContain(zone2);
      });

      it('should accept null and undefined values', () => {
        const zone: IZone = { id: 123 };
        expectedResult = service.addZoneToCollectionIfMissing([], null, zone, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(zone);
      });

      it('should return initial array if no Zone is added', () => {
        const zoneCollection: IZone[] = [{ id: 123 }];
        expectedResult = service.addZoneToCollectionIfMissing(zoneCollection, undefined, null);
        expect(expectedResult).toEqual(zoneCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
