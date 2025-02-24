import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAccessComponent } from './image-access.component';

describe('ImageAccessComponent', () => {
  let component: ImageAccessComponent;
  let fixture: ComponentFixture<ImageAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
