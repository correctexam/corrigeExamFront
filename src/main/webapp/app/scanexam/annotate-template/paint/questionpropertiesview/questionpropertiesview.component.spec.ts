import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionpropertiesviewComponent } from './questionpropertiesview.component';

describe('QuestionpropertiesviewComponent', () => {
  let component: QuestionpropertiesviewComponent;
  let fixture: ComponentFixture<QuestionpropertiesviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionpropertiesviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionpropertiesviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
