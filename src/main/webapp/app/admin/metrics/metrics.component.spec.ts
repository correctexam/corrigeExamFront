import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect } from '@jest/globals';

import { MetricsComponent } from './metrics.component';
import { MetricsService } from './metrics.service';
import { Metrics } from './metrics.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MetricsComponent', () => {
  let comp: MetricsComponent;
  let fixture: ComponentFixture<MetricsComponent>;
  let service: MetricsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, MetricsComponent],
      declarations: [],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideTemplate(MetricsComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MetricsService);
  });

  describe('refresh', () => {
    it('should call refresh on init', () => {
      // GIVEN
      jest.spyOn(service, 'getMetrics').mockReturnValue(of({} as Metrics));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.getMetrics).toHaveBeenCalled();
    });
  });
});
