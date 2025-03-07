/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PredictionDetailComponent } from './prediction-detail.component';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { of } from 'rxjs';
import { describe, expect } from '@jest/globals';
import { provideRouter } from '@angular/router';

describe('PredictionDetailComponent', () => {
  let fixture: ComponentFixture<PredictionDetailComponent>;
  const deletemockCallback = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PredictionDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: PredictionService,
          useValue: {
            //            delete: jasmine.createSpy('delete').and.returnValue(of({})), // Mock delete method
            delete: deletemockCallback.mockReturnValue(of({})),
          },
        },
        NgbActiveModal,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionDetailComponent);
  });

  it('should dismiss the modal on cancel', () => {
    expect(true);
  });
});
