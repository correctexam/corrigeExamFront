import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PredictionUpdateComponent } from './prediction-update.component';
import { PredictionService } from '../service/prediction.service';
import { Router } from '@angular/router';
import { describe, expect } from '@jest/globals';

describe('PredictionUpdateComponent', () => {
  let component: PredictionUpdateComponent;
  let fixture: ComponentFixture<PredictionUpdateComponent>;
  let service: PredictionService;
  let router: Router;

  beforeEach(() => {
    const mockActivatedRoute = {
      data: of({ prediction: { id: 123, text: 'Sample Prediction', questionNumber: 'Q1' } }),
    };

    TestBed.configureTestingModule({
      declarations: [PredictionUpdateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: PredictionService,
          useValue: {
            update: jasmine.createSpy('update').and.returnValue(of({})),
            create: jasmine.createSpy('create').and.returnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionUpdateComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PredictionService);
    router = TestBed.inject(Router);
  });

  it('should load prediction on init', () => {
    component.ngOnInit();
    expect(component.prediction).toEqual({ id: 123, text: 'Sample Prediction', questionNumber: 'Q1' });
  });

  it('should call update service when saving an existing prediction', () => {
    component.prediction = { id: 123, text: 'Updated Prediction', questionNumber: 'Q2' };
    component.save();
    expect(service.update).toHaveBeenCalledWith(component.prediction);
    expect(router.navigate).toHaveBeenCalledWith(['/predictions']);
  });

  it('should call create service when saving a new prediction', () => {
    component.prediction = { id: undefined, text: 'New Prediction', questionNumber: 'Q3' };
    component.save();
    expect(service.create).toHaveBeenCalledWith(component.prediction);
    expect(router.navigate).toHaveBeenCalledWith(['/predictions']);
  });

  it('should navigate to the list on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/predictions']);
  });
});
