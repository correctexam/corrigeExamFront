import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PredictionDeleteDialogComponent } from './prediction-delete-dialog.component';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { of } from 'rxjs';
import { describe, expect } from '@jest/globals';

describe('PredictionDeleteDialogComponent', () => {
  let component: PredictionDeleteDialogComponent;
  let fixture: ComponentFixture<PredictionDeleteDialogComponent>;
  let service: PredictionService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionDeleteDialogComponent],
      providers: [
        {
          provide: PredictionService,
          useValue: {
            delete: jasmine.createSpy('delete').and.returnValue(of({})), // Mock delete method with Jasmine
          },
        },
        NgbActiveModal,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionDeleteDialogComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PredictionService);
    mockActiveModal = TestBed.inject(NgbActiveModal);

    spyOn(mockActiveModal, 'close'); // Ensure close method is spied on properly
    spyOn(mockActiveModal, 'dismiss'); // Ensure dismiss method is spied on properly
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
    // Act
    component.cancel();

    // Assert
    expect(mockActiveModal.dismiss).toHaveBeenCalledWith('cancel');
  });
});
