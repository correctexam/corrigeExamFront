import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PredictionListComponent } from './list.component';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { describe, expect } from '@jest/globals';
import { IPrediction } from '../prediction.model';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('PredictionListComponent', () => {
  let component: PredictionListComponent;
  let fixture: ComponentFixture<PredictionListComponent>;
  let service: PredictionService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PredictionListComponent,
        TranslateModule.forRoot({
          defaultLanguage: 'en',
        }),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
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
    jest
      .spyOn(service, 'query')
      .mockReturnValue(of(new HttpResponse<IPrediction[]>({ body: [{ id: 1, text: 'Sample Prediction', questionNumber: 1 }] })));
    component.ngOnInit().then(() => {
      expect(service.query).toHaveBeenCalled();
      expect(component.predictions.length).toBeGreaterThan(0);
    });
  });

  it('should navigate to view page on view', () => {
    component.view(1);

    expect(router.navigate).toHaveBeenCalledWith(['/predictions', 1, 'view']);
  });

  it('should navigate to edit page on edit', () => {
    jest.spyOn(router, 'navigate');
    component.edit(1);

    expect(router.navigate).toHaveBeenCalledWith(['/predictions', 1, 'edit']);
  });

  it('should call delete service and reload predictions on delete', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(service, 'delete');
    jest.spyOn(service, 'query');

    component.delete(1).then(() => {
      expect(service.delete).toHaveBeenCalledWith(1);
      expect(service.query).toHaveBeenCalled();
    });
  });
});
