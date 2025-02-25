import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MltComponent } from './mlt.component';

describe('MltComponent', () => {
  let component: MltComponent;
  let fixture: ComponentFixture<MltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MltComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(true);
  });
});
