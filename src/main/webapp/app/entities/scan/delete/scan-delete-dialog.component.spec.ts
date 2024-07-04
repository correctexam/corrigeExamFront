jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ScanService } from '../service/scan.service';

import { ScanDeleteDialogComponent } from './scan-delete-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Scan Management Delete Component', () => {
  let comp: ScanDeleteDialogComponent;
  let fixture: ComponentFixture<ScanDeleteDialogComponent>;
  let service: ScanService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, ScanDeleteDialogComponent],
      declarations: [],
      providers: [NgbActiveModal, provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideTemplate(ScanDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ScanDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ScanService);
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
