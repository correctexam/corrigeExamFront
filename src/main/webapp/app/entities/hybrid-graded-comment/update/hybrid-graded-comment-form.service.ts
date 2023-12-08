import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHybridGradedComment, NewHybridGradedComment } from '../hybrid-graded-comment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHybridGradedComment for edit and NewHybridGradedCommentFormGroupInput for create.
 */
type HybridGradedCommentFormGroupInput = IHybridGradedComment | PartialWithRequiredKeyOf<NewHybridGradedComment>;

type HybridGradedCommentFormDefaults = Pick<NewHybridGradedComment, 'id' | 'relative'>;

type HybridGradedCommentFormGroupContent = {
  id: FormControl<IHybridGradedComment['id'] | NewHybridGradedComment['id']>;
  text: FormControl<IHybridGradedComment['text']>;
  description: FormControl<IHybridGradedComment['description']>;
  grade: FormControl<IHybridGradedComment['grade']>;
  relative: FormControl<IHybridGradedComment['relative']>;
  step: FormControl<IHybridGradedComment['step']>;
  question: FormControl<IHybridGradedComment['questionId']>;
};

export type HybridGradedCommentFormGroup = FormGroup<HybridGradedCommentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HybridGradedCommentFormService {
  createHybridGradedCommentFormGroup(hybridGradedComment: HybridGradedCommentFormGroupInput = { id: null }): HybridGradedCommentFormGroup {
    const hybridGradedCommentRawValue = {
      ...this.getFormDefaults(),
      ...hybridGradedComment,
    };
    return new FormGroup<HybridGradedCommentFormGroupContent>({
      id: new FormControl(
        { value: hybridGradedCommentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      text: new FormControl(hybridGradedCommentRawValue.text),
      description: new FormControl(hybridGradedCommentRawValue.description),
      grade: new FormControl(hybridGradedCommentRawValue.grade),
      relative: new FormControl(hybridGradedCommentRawValue.relative),
      step: new FormControl(hybridGradedCommentRawValue.step),
      question: new FormControl(hybridGradedCommentRawValue.questionId),
    });
  }

  getHybridGradedComment(form: HybridGradedCommentFormGroup): IHybridGradedComment | NewHybridGradedComment {
    return form.getRawValue() as IHybridGradedComment | NewHybridGradedComment;
  }

  resetForm(form: HybridGradedCommentFormGroup, hybridGradedComment: HybridGradedCommentFormGroupInput): void {
    const hybridGradedCommentRawValue = { ...this.getFormDefaults(), ...hybridGradedComment };
    form.reset(
      {
        ...hybridGradedCommentRawValue,
        id: { value: hybridGradedCommentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): HybridGradedCommentFormDefaults {
    return {
      id: null,
      relative: false,
    };
  }
}
