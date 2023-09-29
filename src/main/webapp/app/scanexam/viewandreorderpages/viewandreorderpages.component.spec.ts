import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewandreorderpagesComponent } from './viewandreorderpages.component';

describe('ViewandreorderpagesComponent', () => {
  let component: ViewandreorderpagesComponent;
  let fixture: ComponentFixture<ViewandreorderpagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewandreorderpagesComponent],
    });
    fixture = TestBed.createComponent(ViewandreorderpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
