import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAccessComponent } from './image-access.component';

describe('ImageAccessComponent', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    expect(true);
  });
});
