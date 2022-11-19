import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialAlignModalComponent } from './partial-align-modal.component';

describe('PartialAlignModalComponent', () => {
  let component: PartialAlignModalComponent;
  let fixture: ComponentFixture<PartialAlignModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartialAlignModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartialAlignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
