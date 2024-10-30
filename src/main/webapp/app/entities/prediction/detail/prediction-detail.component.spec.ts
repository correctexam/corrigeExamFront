import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PredictionDetailComponent } from './prediction-detail.component';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { of } from 'rxjs';
import { describe, expect } from '@jest/globals';

describe('PredictionDetailComponent', () => {
  let component: PredictionDetailComponent;
  let fixture: ComponentFixture<PredictionDetailComponent>;
  let service: PredictionService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionDetailComponent],
      providers: [
        {
          provide: PredictionService,
          useValue: {
            delete: jasmine.createSpy('delete').and.returnValue(of({})), // Mock delete method
          },
        },
        NgbActiveModal,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionDetailComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PredictionService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  it('should call delete service on confirmDelete', () => {
    // Arrange
    component.predictionId = 123;

    // Act
    component.confirmDelete();

    // Assert
    expect(service.delete).toHaveBeenCalledWith(123);
    expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
  });

  it('should dismiss the modal on cancel', () => {
    // Arrange
    spyOn(mockActiveModal, 'dismiss');

    // Act
    component.cancel();

    // Assert
    expect(mockActiveModal.dismiss).toHaveBeenCalledWith('cancel');
  });
});
