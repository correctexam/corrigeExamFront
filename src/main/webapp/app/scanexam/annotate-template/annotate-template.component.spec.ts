import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotateTemplateComponent } from './annotate-template.component';

describe('AnnotateTemplateComponent', () => {
  let component: AnnotateTemplateComponent;
  let fixture: ComponentFixture<AnnotateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnotateTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
