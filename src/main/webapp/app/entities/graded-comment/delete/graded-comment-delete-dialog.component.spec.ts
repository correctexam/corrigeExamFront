jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GradedCommentService } from '../service/graded-comment.service';

import { GradedCommentDeleteDialogComponent } from './graded-comment-delete-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GradedComment Management Delete Component', () => {
  let comp: GradedCommentDeleteDialogComponent;
  let fixture: ComponentFixture<GradedCommentDeleteDialogComponent>;
  let service: GradedCommentService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, GradedCommentDeleteDialogComponent],
      declarations: [],
      providers: [NgbActiveModal, provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideTemplate(GradedCommentDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GradedCommentDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GradedCommentService);
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
