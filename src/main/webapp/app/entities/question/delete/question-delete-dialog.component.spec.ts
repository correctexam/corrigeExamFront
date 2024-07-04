jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { QuestionService } from '../service/question.service';

import { QuestionDeleteDialogComponent } from './question-delete-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Question Management Delete Component', () => {
  let comp: QuestionDeleteDialogComponent;
  let fixture: ComponentFixture<QuestionDeleteDialogComponent>;
  let service: QuestionService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, QuestionDeleteDialogComponent],
      declarations: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), NgbActiveModal],
    })
      .overrideTemplate(QuestionDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(QuestionDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(QuestionService);
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
