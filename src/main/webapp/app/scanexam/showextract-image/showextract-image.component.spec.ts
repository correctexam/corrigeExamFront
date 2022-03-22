import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowextractImageComponent } from './showextract-image.component';

describe('ShowextractImageComponent', () => {
  let component: ShowextractImageComponent;
  let fixture: ComponentFixture<ShowextractImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowextractImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowextractImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
