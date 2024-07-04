import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { UsableTextInputComponent } from './usable-text-input.component';

describe('UsableTextInputComponent', () => {
  let component: UsableTextInputComponent;
  let fixture: ComponentFixture<UsableTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsableTextInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsableTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
