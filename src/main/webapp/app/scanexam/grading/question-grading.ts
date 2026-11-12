import { GradeType } from 'app/entities/enumerations/grade-type.model';

/**
 * Grading rules of a question, shared by the correction screen and the PDF export.
 *
 * The back end applies the same rules in `FinalNoteService` (in quarter points).
 * Keep both sides in sync when a rule changes.
 */

/** How the note of a question is computed. */
export type GradingRule =
  /** Sum of the graded comments, capped at `noteSteps`. */
  | 'positive'
  /** `noteSteps` minus the graded comments, never below 0. */
  | 'negative'
  /** Percentage of the points plus absolute bonuses, from the hybrid comments and their step values. */
  | 'hybrid'
  /** QCM with `step > 0`: `point * step` per correct answer, `-point` per incorrect answer. */
  | 'qcmWithPenalty'
  /** QCM with `step <= 0`: `point` per correct answer. */
  | 'qcm';

export interface GradableQuestion {
  gradeType?: GradeType | string | null;
  typeAlgoName?: string | null;
  point?: number;
  step?: number | null;
  defaultpoint?: number | null;
  canExceedTheMax?: boolean;
  canBeNegative?: boolean;
}

export interface GradedCommentLike {
  grade?: number | null;
  description?: string | null;
}

export interface HybridCommentLike {
  id: number;
  grade?: number | null;
  relative?: boolean | null;
  step?: number | null;
}

export interface QuestionNoteInput {
  /** Graded comments of the response (positive, negative and QCM rules). */
  gradedComments?: GradedCommentLike[] | null;
  /** `point * step` of the question (positive and negative rules). */
  noteSteps?: number;
  /** Hybrid comments of the question (hybrid rule). */
  hybridComments?: HybridCommentLike[];
  /** Step value chosen for each hybrid comment, by comment id (hybrid rule). */
  hybridStepValues?: Map<number, number>;
}

export interface QuestionNote {
  rule: GradingRule;
  /**
   * Note of the question: in steps for the positive, negative and QCM rules,
   * in points for the hybrid rule (stored × 100 in `StudentResponse.note`).
   */
  note: number;
}

/**
 * Rule applied to a question, or `undefined` when its note is entered directly
 * (`DIRECT`, no grade type, or a QCM whose `step` is undefined).
 */
export function gradingRuleOf(question: GradableQuestion): GradingRule | undefined {
  if (question.typeAlgoName === 'QCM') {
    // Comparisons kept as in the original code: a null step counts as <= 0, an undefined step matches neither.
    if (question.step! > 0) {
      return 'qcmWithPenalty';
    }
    if (question.step! <= 0) {
      return 'qcm';
    }
    return undefined;
  }
  switch (question.gradeType) {
    case GradeType.POSITIVE:
      return 'positive';
    case GradeType.NEGATIVE:
      return 'negative';
    case GradeType.HYBRID:
      return 'hybrid';
    default:
      return undefined;
  }
}

/** Computes the note of a question, or returns `undefined` when no rule applies (see {@link gradingRuleOf}). */
export function computeQuestionNote(question: GradableQuestion, input: QuestionNoteInput): QuestionNote | undefined {
  const rule = gradingRuleOf(question);
  switch (rule) {
    case 'positive':
      return { rule, note: positiveNote(input.gradedComments, input.noteSteps ?? 0) };
    case 'negative':
      return { rule, note: negativeNote(input.gradedComments, input.noteSteps ?? 0) };
    case 'hybrid':
      return { rule, note: hybridNote(question, input.hybridComments, input.hybridStepValues) };
    case 'qcmWithPenalty':
    case 'qcm':
      return { rule, note: qcmNote(question, input.gradedComments, rule === 'qcmWithPenalty') };
    default:
      return undefined;
  }
}

export function positiveNote(comments: GradedCommentLike[] | null | undefined, noteSteps: number): number {
  let note = 0;
  comments?.forEach(c => {
    if (c.grade !== undefined && c.grade !== null) {
      note = note + c.grade;
    }
  });
  return note > noteSteps ? noteSteps : note;
}

export function negativeNote(comments: GradedCommentLike[] | null | undefined, noteSteps: number): number {
  let note = noteSteps;
  comments?.forEach(c => {
    if (c.grade !== undefined && c.grade !== null) {
      note = note - c.grade;
    }
  });
  return note < 0 ? 0 : note;
}

export function qcmNote(question: GradableQuestion, comments: GradedCommentLike[] | null | undefined, withPenalty: boolean): number {
  let note = 0;
  comments?.forEach(c => {
    if (c.description?.startsWith('correct')) {
      note = note + (withPenalty ? question.point! * question.step! : question.point!);
    } else if (withPenalty && c.description?.startsWith('incorrect')) {
      note = note - question.point!;
    }
  });
  return note;
}

export function hybridNote(
  question: GradableQuestion,
  comments: HybridCommentLike[] | undefined,
  stepValues: Map<number, number> | undefined,
): number {
  let percentage = question.defaultpoint ? question.defaultpoint : 0;
  let absoluteNote2Add = 0;
  comments?.forEach(c => {
    const stepValue = stepValues?.get(c.id);
    if (stepValue !== undefined && stepValue > 0) {
      if (c.relative) {
        percentage = percentage + (stepValue / c.step!) * c.grade!;
      } else {
        absoluteNote2Add = absoluteNote2Add + (stepValue / c.step!) * c.grade!;
      }
    }
  });
  const note = (question.point! * percentage) / 100.0 + absoluteNote2Add;
  if (note > question.point! && !question.canExceedTheMax) {
    return question.point!;
  }
  if (note < 0 && !question.canBeNegative) {
    return 0;
  }
  return note;
}
