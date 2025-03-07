import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PredictionDeleteDialogComponent } from './prediction-delete-dialog.component';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { describe, expect } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PredictionDeleteDialogComponent', () => {
  let component: PredictionDeleteDialogComponent;
  let fixture: ComponentFixture<PredictionDeleteDialogComponent>;
  let service: PredictionService;
  let mockActiveModal: NgbActiveModal;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PredictionDeleteDialogComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), NgbActiveModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionDeleteDialogComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PredictionService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  it('should call delete service on confirmDelete', () => {
    // Arrange
    component.predictionId = 123;
    jest.spyOn(mockActiveModal, 'close'); // Ensure close method is spied on properly
    jest.spyOn(service, 'delete');
    // Act
    component.confirmDelete().then(() => {
      expect(service.delete).toHaveBeenCalledWith(123);
      expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
    });

    // Assert
  });

  it('should dismiss the modal on cancel', () => {
    jest.spyOn(mockActiveModal, 'dismiss'); // Ensure dismiss method is spied on properly

    // Act
    component.cancel();

    // Assert
    expect(mockActiveModal.dismiss).toHaveBeenCalledWith('cancel');
  });
});
