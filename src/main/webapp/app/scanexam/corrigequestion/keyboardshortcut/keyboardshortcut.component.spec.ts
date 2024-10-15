/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { KeyboardshortcutComponent } from './keyboardshortcut.component';

describe('KeyboardshortcutComponent', () => {
  let component: KeyboardshortcutComponent;
  let fixture: ComponentFixture<KeyboardshortcutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardshortcutComponent],
    }).compileComponents();
  });

  beforeEach(() => {});

  it('should create', () => {
    expect(true);
  });
});
