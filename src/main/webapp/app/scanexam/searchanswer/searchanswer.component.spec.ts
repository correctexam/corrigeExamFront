import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchanswerComponent } from './searchanswer.component';

describe('SearchanswerComponent', () => {
  let component: SearchanswerComponent;
  let fixture: ComponentFixture<SearchanswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchanswerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchanswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
