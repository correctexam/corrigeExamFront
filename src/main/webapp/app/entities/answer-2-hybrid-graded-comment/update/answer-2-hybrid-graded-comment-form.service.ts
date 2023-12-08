import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAnswer2HybridGradedComment, NewAnswer2HybridGradedComment } from '../answer-2-hybrid-graded-comment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAnswer2HybridGradedComment for edit and NewAnswer2HybridGradedCommentFormGroupInput for create.
 */
type Answer2HybridGradedCommentFormGroupInput = IAnswer2HybridGradedComment | PartialWithRequiredKeyOf<NewAnswer2HybridGradedComment>;

type Answer2HybridGradedCommentFormDefaults = Pick<NewAnswer2HybridGradedComment, 'id'>;

type Answer2HybridGradedCommentFormGroupContent = {
  id: FormControl<IAnswer2HybridGradedComment['id'] | NewAnswer2HybridGradedComment['id']>;
  stepValue: FormControl<IAnswer2HybridGradedComment['stepValue']>;
  hybridcomments: FormControl<IAnswer2HybridGradedComment['hybridcommentsId']>;
  studentResponse: FormControl<IAnswer2HybridGradedComment['studentResponseId']>;
};

export type Answer2HybridGradedCommentFormGroup = FormGroup<Answer2HybridGradedCommentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class Answer2HybridGradedCommentFormService {
  createAnswer2HybridGradedCommentFormGroup(
    answer2HybridGradedComment: Answer2HybridGradedCommentFormGroupInput = { id: null },
  ): Answer2HybridGradedCommentFormGroup {
    const answer2HybridGradedCommentRawValue = {
      ...this.getFormDefaults(),
      ...answer2HybridGradedComment,
    };
    return new FormGroup<Answer2HybridGradedCommentFormGroupContent>({
      id: new FormControl(
        { value: answer2HybridGradedCommentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      stepValue: new FormControl(answer2HybridGradedCommentRawValue.stepValue),
      hybridcomments: new FormControl(answer2HybridGradedCommentRawValue.hybridcommentsId),
      studentResponse: new FormControl(answer2HybridGradedCommentRawValue.studentResponseId),
    });
  }

  getAnswer2HybridGradedComment(form: Answer2HybridGradedCommentFormGroup): IAnswer2HybridGradedComment | NewAnswer2HybridGradedComment {
    return form.getRawValue() as IAnswer2HybridGradedComment | NewAnswer2HybridGradedComment;
  }

  resetForm(form: Answer2HybridGradedCommentFormGroup, answer2HybridGradedComment: Answer2HybridGradedCommentFormGroupInput): void {
    const answer2HybridGradedCommentRawValue = { ...this.getFormDefaults(), ...answer2HybridGradedComment };
    form.reset(
      {
        ...answer2HybridGradedCommentRawValue,
        id: { value: answer2HybridGradedCommentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): Answer2HybridGradedCommentFormDefaults {
    return {
      id: null,
    };
  }
}
