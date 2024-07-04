import { TestBed } from '@angular/core/testing';
import { describe, expect } from '@jest/globals';

import { sampleWithRequiredData, sampleWithNewData } from '../hybrid-graded-comment.test-samples';

import { HybridGradedCommentFormService } from './hybrid-graded-comment-form.service';

describe('HybridGradedComment Form Service', () => {
  let service: HybridGradedCommentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HybridGradedCommentFormService);
  });

  describe('Service methods', () => {
    describe('createHybridGradedCommentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHybridGradedCommentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            text: expect.any(Object),
            description: expect.any(Object),
            grade: expect.any(Object),
            relative: expect.any(Object),
            step: expect.any(Object),
            question: expect.any(Object),
          }),
        );
      });

      it('passing IHybridGradedComment should create a new form with FormGroup', () => {
        const formGroup = service.createHybridGradedCommentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            text: expect.any(Object),
            description: expect.any(Object),
            grade: expect.any(Object),
            relative: expect.any(Object),
            step: expect.any(Object),
            question: expect.any(Object),
          }),
        );
      });
    });

    describe('getHybridGradedComment', () => {
      it('should return NewHybridGradedComment for default HybridGradedComment initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHybridGradedCommentFormGroup(sampleWithNewData);

        const hybridGradedComment = service.getHybridGradedComment(formGroup) as any;

        expect(hybridGradedComment).toMatchObject(sampleWithNewData);
      });

      it('should return NewHybridGradedComment for empty HybridGradedComment initial value', () => {
        const formGroup = service.createHybridGradedCommentFormGroup();

        const hybridGradedComment = service.getHybridGradedComment(formGroup) as any;

        expect(hybridGradedComment).toMatchObject({});
      });

      it('should return IHybridGradedComment', () => {
        const formGroup = service.createHybridGradedCommentFormGroup(sampleWithRequiredData);

        const hybridGradedComment = service.getHybridGradedComment(formGroup) as any;

        expect(hybridGradedComment).toMatchObject(sampleWithRequiredData as any);
      });
    });

    describe('resetForm', () => {
      it('passing IHybridGradedComment should not enable id FormControl', () => {
        const formGroup = service.createHybridGradedCommentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHybridGradedComment should disable id FormControl', () => {
        const formGroup = service.createHybridGradedCommentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
