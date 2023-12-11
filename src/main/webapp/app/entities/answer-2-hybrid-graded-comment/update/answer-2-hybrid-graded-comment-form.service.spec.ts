import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../answer-2-hybrid-graded-comment.test-samples';

import { Answer2HybridGradedCommentFormService } from './answer-2-hybrid-graded-comment-form.service';

describe('Answer2HybridGradedComment Form Service', () => {
  let service: Answer2HybridGradedCommentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Answer2HybridGradedCommentFormService);
  });

  describe('Service methods', () => {
    describe('createAnswer2HybridGradedCommentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAnswer2HybridGradedCommentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            stepValue: expect.any(Object),
            hybridcomments: expect.any(Object),
            studentResponse: expect.any(Object),
          }),
        );
      });

      it('passing IAnswer2HybridGradedComment should create a new form with FormGroup', () => {
        const formGroup = service.createAnswer2HybridGradedCommentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            stepValue: expect.any(Object),
            hybridcomments: expect.any(Object),
            studentResponse: expect.any(Object),
          }),
        );
      });
    });

    describe('getAnswer2HybridGradedComment', () => {
      it('should return NewAnswer2HybridGradedComment for default Answer2HybridGradedComment initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAnswer2HybridGradedCommentFormGroup(sampleWithNewData);

        const answer2HybridGradedComment = service.getAnswer2HybridGradedComment(formGroup) as any;

        expect(answer2HybridGradedComment).toMatchObject(sampleWithNewData);
      });

      it('should return NewAnswer2HybridGradedComment for empty Answer2HybridGradedComment initial value', () => {
        const formGroup = service.createAnswer2HybridGradedCommentFormGroup();

        const answer2HybridGradedComment = service.getAnswer2HybridGradedComment(formGroup) as any;

        expect(answer2HybridGradedComment).toMatchObject({});
      });

      it('should return IAnswer2HybridGradedComment', () => {
        const formGroup = service.createAnswer2HybridGradedCommentFormGroup(sampleWithRequiredData);

        const answer2HybridGradedComment = service.getAnswer2HybridGradedComment(formGroup) as any;

        expect(answer2HybridGradedComment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAnswer2HybridGradedComment should not enable id FormControl', () => {
        const formGroup = service.createAnswer2HybridGradedCommentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAnswer2HybridGradedComment should disable id FormControl', () => {
        const formGroup = service.createAnswer2HybridGradedCommentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
