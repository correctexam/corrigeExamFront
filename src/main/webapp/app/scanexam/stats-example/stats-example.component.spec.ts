import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsExampleComponent } from './stats-example.component';

describe('StatsExampleComponent', () => {
  let component: StatsExampleComponent;
  let fixture: ComponentFixture<StatsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsExampleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
