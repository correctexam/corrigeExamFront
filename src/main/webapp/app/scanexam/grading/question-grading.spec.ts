import { describe, expect, it } from '@jest/globals';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { computeQuestionNote, gradingRuleOf, GradableQuestion, HybridCommentLike } from './question-grading';

describe('question-grading', () => {
  describe('gradingRuleOf', () => {
    it.each([
      [{ gradeType: GradeType.POSITIVE }, 'positive'],
      [{ gradeType: GradeType.NEGATIVE }, 'negative'],
      [{ gradeType: GradeType.HYBRID }, 'hybrid'],
      [{ gradeType: 'POSITIVE' }, 'positive'],
      [{ gradeType: GradeType.DIRECT }, undefined],
      [{}, undefined],
      [{ typeAlgoName: 'QCM', gradeType: GradeType.POSITIVE, step: 2 }, 'qcmWithPenalty'],
      [{ typeAlgoName: 'QCM', step: 0 }, 'qcm'],
      [{ typeAlgoName: 'QCM', step: -1 }, 'qcm'],
      [{ typeAlgoName: 'QCM', step: null }, 'qcm'],
      [{ typeAlgoName: 'QCM' }, undefined],
      [{ typeAlgoName: 'manuscrit', gradeType: GradeType.NEGATIVE }, 'negative'],
    ])('%j -> %s', (question, rule) => {
      expect(gradingRuleOf(question as GradableQuestion)).toBe(rule);
    });
  });

  describe('positive rule', () => {
    const question = { gradeType: GradeType.POSITIVE };

    it('sums the grades of the comments and ignores comments without grade', () => {
      const note = computeQuestionNote(question, { noteSteps: 10, gradedComments: [{ grade: 2 }, { grade: null }, {}, { grade: 3 }] });
      expect(note).toEqual({ rule: 'positive', note: 5 });
    });

    it('caps the note at noteSteps', () => {
      expect(computeQuestionNote(question, { noteSteps: 4, gradedComments: [{ grade: 3 }, { grade: 3 }] })?.note).toBe(4);
    });

    it('gives 0 without comment', () => {
      expect(computeQuestionNote(question, { noteSteps: 4 })?.note).toBe(0);
    });
  });

  describe('negative rule', () => {
    const question = { gradeType: GradeType.NEGATIVE };

    it('removes the grades of the comments from noteSteps', () => {
      expect(computeQuestionNote(question, { noteSteps: 10, gradedComments: [{ grade: 2 }, { grade: null }, { grade: 3 }] })?.note).toBe(5);
    });

    it('never goes below 0', () => {
      expect(computeQuestionNote(question, { noteSteps: 4, gradedComments: [{ grade: 3 }, { grade: 3 }] })?.note).toBe(0);
    });

    it('gives noteSteps without comment', () => {
      expect(computeQuestionNote(question, { noteSteps: 4, gradedComments: null })?.note).toBe(4);
    });
  });

  describe('QCM rules', () => {
    const answers = [
      { description: 'correct a' },
      { description: 'incorrect b' },
      { description: 'correct c' },
      { description: 'blank' },
      {},
    ];

    it('with step > 0: point * step per correct answer, -point per incorrect answer', () => {
      const note = computeQuestionNote({ typeAlgoName: 'QCM', point: 1, step: 4 }, { gradedComments: answers });
      expect(note).toEqual({ rule: 'qcmWithPenalty', note: 2 * 4 - 1 });
    });

    it('with step > 0: the note can be negative', () => {
      const note = computeQuestionNote({ typeAlgoName: 'QCM', point: 2, step: 1 }, { gradedComments: [{ description: 'incorrect' }] });
      expect(note?.note).toBe(-2);
    });

    it('with step <= 0: point per correct answer, no penalty', () => {
      const note = computeQuestionNote({ typeAlgoName: 'QCM', point: 3, step: 0 }, { gradedComments: answers });
      expect(note).toEqual({ rule: 'qcm', note: 6 });
    });
  });

  describe('hybrid rule', () => {
    const comments: HybridCommentLike[] = [
      { id: 1, relative: true, grade: 50, step: 2 },
      { id: 2, relative: false, grade: 1, step: 4 },
      { id: 3, relative: true, grade: -100, step: 1 },
    ];
    const question: GradableQuestion = { gradeType: GradeType.HYBRID, point: 4, defaultpoint: 0 };

    it('adds the relative part as a percentage of the points and the absolute part as points', () => {
      // 4 * (1/2 * 50) / 100 + (2/4 * 1) = 1 + 0.5
      const stepValues = new Map([
        [1, 1],
        [2, 2],
      ]);
      expect(computeQuestionNote(question, { hybridComments: comments, hybridStepValues: stepValues })).toEqual({
        rule: 'hybrid',
        note: 1.5,
      });
    });

    it('starts from the default percentage and ignores comments without a positive step value', () => {
      const stepValues = new Map([
        [1, 0],
        [2, -1],
      ]);
      const note = computeQuestionNote({ ...question, defaultpoint: 25 }, { hybridComments: comments, hybridStepValues: stepValues });
      expect(note?.note).toBe(1);
    });

    it('caps the note at the points unless canExceedTheMax', () => {
      const stepValues = new Map([[2, 4]]);
      const input = { hybridComments: [{ id: 2, relative: false, grade: 10, step: 4 }], hybridStepValues: stepValues };
      expect(computeQuestionNote(question, input)?.note).toBe(4);
      expect(computeQuestionNote({ ...question, canExceedTheMax: true }, input)?.note).toBe(10);
    });

    it('floors the note at 0 unless canBeNegative', () => {
      const stepValues = new Map([[3, 1]]);
      const input = { hybridComments: comments, hybridStepValues: stepValues };
      expect(computeQuestionNote(question, input)?.note).toBe(0);
      expect(computeQuestionNote({ ...question, canBeNegative: true }, input)?.note).toBe(-4);
    });

    it('gives the default percentage without comment', () => {
      expect(computeQuestionNote({ ...question, defaultpoint: 50 }, {})?.note).toBe(2);
    });
  });

  it('returns undefined for a question graded directly', () => {
    expect(computeQuestionNote({ gradeType: GradeType.DIRECT }, { noteSteps: 4, gradedComments: [{ grade: 1 }] })).toBeUndefined();
  });
});
