jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentResponseService } from '../service/student-response.service';

import { StudentResponseDeleteDialogComponent } from './student-response-delete-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('StudentResponse Management Delete Component', () => {
  let comp: StudentResponseDeleteDialogComponent;
  let fixture: ComponentFixture<StudentResponseDeleteDialogComponent>;
  let service: StudentResponseService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [StudentResponseDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(StudentResponseDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StudentResponseDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StudentResponseService);
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
