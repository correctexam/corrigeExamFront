import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssocierCopiesEtudiantsComponent } from './associer-copies-etudiants.component';

describe('AssocierCopiesEtudiantsComponent', () => {
  let component: AssocierCopiesEtudiantsComponent;
  let fixture: ComponentFixture<AssocierCopiesEtudiantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssocierCopiesEtudiantsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssocierCopiesEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
