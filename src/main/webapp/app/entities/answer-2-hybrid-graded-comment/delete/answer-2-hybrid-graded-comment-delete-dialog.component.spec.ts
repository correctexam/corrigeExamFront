jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Answer2HybridGradedCommentService } from '../service/answer-2-hybrid-graded-comment.service';

import { Answer2HybridGradedCommentDeleteDialogComponent } from './answer-2-hybrid-graded-comment-delete-dialog.component';

describe('Answer2HybridGradedComment Management Delete Component', () => {
  let comp: Answer2HybridGradedCommentDeleteDialogComponent;
  let fixture: ComponentFixture<Answer2HybridGradedCommentDeleteDialogComponent>;
  let service: Answer2HybridGradedCommentService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Answer2HybridGradedCommentDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(Answer2HybridGradedCommentDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Answer2HybridGradedCommentDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(Answer2HybridGradedCommentService);
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
