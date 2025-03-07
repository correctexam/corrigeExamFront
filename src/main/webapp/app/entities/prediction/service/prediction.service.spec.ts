import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PredictionService } from './prediction.service';
import { IPrediction } from '../prediction.model';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';

describe('PredictionService', () => {
  let service: PredictionService;
  let httpMock: HttpTestingController;
  let expectedResult: HttpResponse<IPrediction> | HttpResponse<IPrediction[]> | boolean | null;

  const samplePrediction: IPrediction = {
    id: 123,
    text: 'Sample Prediction Text',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), PredictionService],
    });
    expectedResult = null;
    service = TestBed.inject(PredictionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a prediction', () => {
    const returnedFromService = { ...samplePrediction };
    service.create(samplePrediction).subscribe(resp => (expectedResult = resp));

    const req = httpMock.expectOne({ method: 'POST' });
    req.flush(returnedFromService, { status: 200, statusText: 'OK' });

    if (expectedResult instanceof HttpResponse) {
      expect(expectedResult.body).toEqual(samplePrediction);
    }
  });

  it('should update a prediction', () => {
    const returnedFromService = { ...samplePrediction, text: 'Updated Prediction Text' };
    service.update(returnedFromService).subscribe(resp => (expectedResult = resp));

    const req = httpMock.expectOne({ method: 'PUT' });
    req.flush(returnedFromService, { status: 200, statusText: 'OK' });

    if (expectedResult instanceof HttpResponse) {
      expect(expectedResult.body).toEqual(returnedFromService);
    }
  });

  it('should find a prediction by ID', () => {
    const returnedFromService = { ...samplePrediction };
    service.find(123).subscribe(resp => (expectedResult = resp));

    const req = httpMock.expectOne({ method: 'GET' });
    req.flush(returnedFromService, { status: 200, statusText: 'OK' });

    if (expectedResult instanceof HttpResponse) {
      expect(expectedResult.body).toEqual(samplePrediction);
    }
  });

  it('should return a list of predictions', () => {
    const returnedFromService = [{ ...samplePrediction }];
    service.query().subscribe(resp => (expectedResult = resp));

    const req = httpMock.expectOne({ method: 'GET' });
    req.flush(returnedFromService, { status: 200, statusText: 'OK' });

    if (expectedResult instanceof HttpResponse) {
      expect(expectedResult.body).toEqual(returnedFromService);
    }
  });

  it('should delete a prediction', () => {
    service.delete(123).subscribe(resp => (expectedResult = resp));

    const req = httpMock.expectOne({ method: 'DELETE' });
    req.flush({}, { status: 200, statusText: 'OK' });

    //    expect(expectedResult).toBe(true);
  });
});
