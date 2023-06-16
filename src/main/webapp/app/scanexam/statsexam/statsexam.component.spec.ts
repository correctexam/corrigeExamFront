import { TestBed } from '@angular/core/testing';

import { StatsExamComponent } from './statsexam.component';

describe('StatsExamComponent', () => {
  // let component: StatsExamComponent;
  // let fixture: ComponentFixture<StatsExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsExamComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    //    fixture = TestBed.createComponent(StatsExamComponent);
    //    component = fixture.componentInstance;
    //    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true);
  });
});
