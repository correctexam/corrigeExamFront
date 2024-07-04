jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TemplateService } from '../service/template.service';

import { TemplateDeleteDialogComponent } from './template-delete-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('Template Management Delete Component', () => {
  let comp: TemplateDeleteDialogComponent;
  let fixture: ComponentFixture<TemplateDeleteDialogComponent>;
  let service: TemplateService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, TemplateDeleteDialogComponent],
      declarations: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), NgbActiveModal],
    })
      .overrideTemplate(TemplateDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TemplateDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TemplateService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
