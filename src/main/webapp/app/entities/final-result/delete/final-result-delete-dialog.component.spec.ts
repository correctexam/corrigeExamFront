jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FinalResultService } from '../service/final-result.service';

import { FinalResultDeleteDialogComponent } from './final-result-delete-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('FinalResult Management Delete Component', () => {
  let comp: FinalResultDeleteDialogComponent;
  let fixture: ComponentFixture<FinalResultDeleteDialogComponent>;
  let service: FinalResultService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [FinalResultDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(FinalResultDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinalResultDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FinalResultService);
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
      })
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
