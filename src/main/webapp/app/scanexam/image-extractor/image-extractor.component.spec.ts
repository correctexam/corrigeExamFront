import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageExtractorComponent } from './image-extractor.component';

describe('ImageExtractorComponent', () => {
  let component: ImageExtractorComponent;
  let fixture: ComponentFixture<ImageExtractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageExtractorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageExtractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
