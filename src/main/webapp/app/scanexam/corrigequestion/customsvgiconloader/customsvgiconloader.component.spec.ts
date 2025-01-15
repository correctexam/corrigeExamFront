/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { CustomSvgIconLoaderComponent } from './customsvgiconloader.component';

describe('KeyboardshortcutComponent', () => {
  let component: CustomSvgIconLoaderComponent;
  let fixture: ComponentFixture<CustomSvgIconLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSvgIconLoaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
