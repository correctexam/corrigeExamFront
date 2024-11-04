import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PredictionListComponent } from './list.component';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { describe, expect } from '@jest/globals';

describe('PredictionListComponent', () => {
  let component: PredictionListComponent;
  let fixture: ComponentFixture<PredictionListComponent>;
  let service: PredictionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionListComponent],
      providers: [
        {
          provide: PredictionService,
          useValue: {
            query: jasmine.createSpy('query').and.returnValue(of([{ id: 1, text: 'Sample Prediction', questionNumber: 'Q1' }])),
            delete: jasmine.createSpy('delete').and.returnValue(of({})),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PredictionService);
    router = TestBed.inject(Router);
  });

  it('should load all predictions on init', () => {
    component.ngOnInit();

    expect(service.query).toHaveBeenCalled();
    expect(component.predictions.length).toBeGreaterThan(0);
  });

  it('should navigate to view page on view', () => {
    component.view(1);

    expect(router.navigate).toHaveBeenCalledWith(['/prediction', 1, 'view']);
  });

  it('should navigate to edit page on edit', () => {
    component.edit(1);

    expect(router.navigate).toHaveBeenCalledWith(['/prediction', 1, 'edit']);
  });

  it('should call delete service and reload predictions on delete', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.delete(1);

    expect(service.delete).toHaveBeenCalledWith(1);
    expect(service.query).toHaveBeenCalled();
  });
});
