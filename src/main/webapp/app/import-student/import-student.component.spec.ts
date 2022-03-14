import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStudentComponent } from './import-student.component';

describe('ImportStudentComponent', () => {
  let component: ImportStudentComponent;
  let fixture: ComponentFixture<ImportStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
