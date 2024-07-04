jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ZoneService } from '../service/zone.service';

import { ZoneDeleteDialogComponent } from './zone-delete-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('Zone Management Delete Component', () => {
  let comp: ZoneDeleteDialogComponent;
  let fixture: ComponentFixture<ZoneDeleteDialogComponent>;
  let service: ZoneService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, ZoneDeleteDialogComponent],
      declarations: [],
      providers: [NgbActiveModal, provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
      .overrideTemplate(ZoneDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ZoneDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ZoneService);
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
