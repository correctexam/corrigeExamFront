import { describe, expect, it } from '@jest/globals';

import {
  findOptionForSolution,
  findQcmOption,
  InvalidQcmDslError,
  isValidQcmAnswer,
  normalizeQcmAnswer,
  QCM_VOID_OPTION_TEXT,
  qcmOptionFields,
  qcmOptionForAnswer,
  qcmOptionsToCreate,
  regradedQcmOption,
} from './qcm-option';

describe('QCM options', () => {
  const question = { point: 2, step: 4, validExpression: 'a&b|c' };

  it('normalizes the answer typed by a grader', () => {
    expect(normalizeQcmAnswer('C a')).toBe('a&c');
    expect(normalizeQcmAnswer('a,c')).toBe('a&c');
    expect(normalizeQcmAnswer('a&c&a')).toBe('a&c');
    expect(normalizeQcmAnswer('b')).toBe('b');
    expect(normalizeQcmAnswer('  ')).toBe('');
    expect(normalizeQcmAnswer('1 2')).toBe('');
    expect(normalizeQcmAnswer(undefined)).toBe('');
  });

  it('checks an answer against the valid expression whatever the order of the boxes', () => {
    expect(isValidQcmAnswer(question, 'b a')).toBe(true);
    expect(isValidQcmAnswer(question, 'c')).toBe(true);
    expect(isValidQcmAnswer(question, 'a')).toBe(false);
    expect(isValidQcmAnswer(question, '')).toBe(false);
    expect(isValidQcmAnswer({ point: 1, step: 0, validExpression: 'b&a' }, 'a&b')).toBe(true);
    expect(isValidQcmAnswer({ point: 1, step: 0, validExpression: null }, 'a')).toBe(false);
  });

  it('writes the descriptions and grades of the autocorrection', () => {
    expect(qcmOptionFields(question, 'a&b', true)).toEqual({ text: 'a&b', description: 'correct 2pt', grade: 2 });
    expect(qcmOptionFields(question, 'd', false)).toEqual({ text: 'd', description: 'incorrect pénalité  - 0.50pt', grade: 4 });
    expect(qcmOptionFields({ point: 1, step: 0 }, 'd', false)).toEqual({ text: 'd', description: 'incorrect pénalité 0 pt', grade: 0 });
  });

  it('builds the option of an answer added by hand', () => {
    expect(qcmOptionForAnswer(question, 'B A')).toEqual({ text: 'a&b', description: 'correct 2pt', grade: 2 });
    expect(qcmOptionForAnswer(question, 'd')?.description.startsWith('incorrect')).toBe(true);
    expect(qcmOptionForAnswer(question, '')).toBeUndefined();
  });

  it('finds an existing option whatever the order of its boxes', () => {
    const options = [
      { id: 1, text: 'a&b' },
      { id: 2, text: 'c' },
      { id: 3, text: null },
    ];
    expect(findQcmOption(options, 'b,a')?.id).toBe(1);
    expect(findQcmOption(options, 'c')?.id).toBe(2);
    expect(findQcmOption(options, 'd')).toBeUndefined();
    expect(findQcmOption(options, '')).toBeUndefined();
  });
});

describe('QCM options with a grading DSL', () => {
  const dslQuestion = { point: 2, step: 0, validExpression: 'a&b|a&c=100; a=50; c=-25; *=-33; min=-100' };

  it('values the options from the DSL', () => {
    expect(qcmOptionForAnswer(dslQuestion, 'C A')).toEqual({ text: 'a&c', description: 'correct (100 %)', grade: 100 });
    expect(qcmOptionForAnswer(dslQuestion, 'a')).toEqual({ text: 'a', description: 'partiel (50 %)', grade: 50 });
    expect(qcmOptionForAnswer(dslQuestion, 'c')).toEqual({ text: 'c', description: 'incorrect (-25 %)', grade: -25 });
    expect(qcmOptionForAnswer(dslQuestion, 'd')).toEqual({ text: 'd', description: 'incorrect (-33 %)', grade: -33 });
    expect(qcmOptionForAnswer({ ...dslQuestion, validExpression: 'a=1; c-25' }, 'a')).toBeUndefined();
  });

  it('creates the exact answers of the DSL and the detected ones, normalized, once', () => {
    const created = qcmOptionsToCreate(dslQuestion, ['b&a', 'd', 'd', '', undefined], ['a&c']);
    expect(created.map(o => o.text)).toEqual(['a&b', 'a', 'c', 'd']);
    expect(created.map(o => o.grade)).toEqual([100, 50, -25, -33]);
  });

  it('creates an option for copies without any ticked box only when void is not worth 0', () => {
    const withVoid = { ...dslQuestion, validExpression: 'a=100; void=-10; min=-100' };
    const created = qcmOptionsToCreate(withVoid, [''], []);
    expect(created).toContainEqual({ text: QCM_VOID_OPTION_TEXT, description: 'incorrect (-10 %)', grade: -10 });
    expect(qcmOptionsToCreate(withVoid, [''], ['a', QCM_VOID_OPTION_TEXT])).toEqual([]);
    expect(qcmOptionsToCreate(dslQuestion, [''], ['a&b', 'a&c', 'a', 'c'])).toEqual([]);
  });

  it('refuses an invalid DSL', () => {
    expect(() => qcmOptionsToCreate({ ...dslQuestion, validExpression: 'a=1; c-25' }, ['a'], [])).toThrow(InvalidQcmDslError);
  });

  it('finds the option of a detected answer', () => {
    const options = [{ text: 'a&b' }, { text: QCM_VOID_OPTION_TEXT }];
    expect(findOptionForSolution(dslQuestion, options, 'a&b')).toBe(options[0]);
    expect(findOptionForSolution(dslQuestion, options, '')).toBe(options[1]);
    // Former expression: compared as written, as before
    expect(findOptionForSolution({ validExpression: 'b&a' }, [{ text: 'b&a' }], 'a&b')).toBeUndefined();
  });

  it('keeps the former options unchanged for a former expression', () => {
    const legacy = { point: 2, step: 4, validExpression: 'a&b|c' };
    expect(qcmOptionsToCreate(legacy, ['a&b', 'd', 'd', ''], ['c'])).toEqual([
      { text: 'a&b', description: 'correct 2pt', grade: 2 },
      { text: 'd', description: 'incorrect pénalité  - 0.50pt', grade: 4 },
    ]);
  });
});

describe('options valued again when the expression changes (T20 3/3)', () => {
  it('values an option from the new DSL and keeps its text', () => {
    const q = { point: 2, step: 0, validExpression: 'a&b=100; b=50; *=-25; min=-100' };
    expect(regradedQcmOption(q, 'b&a')).toEqual({ text: 'b&a', description: 'correct (100 %)', grade: 100 });
    expect(regradedQcmOption(q, 'b')).toEqual({ text: 'b', description: 'partiel (50 %)', grade: 50 });
    expect(regradedQcmOption(q, 'c')).toEqual({ text: 'c', description: 'incorrect (-25 %)', grade: -25 });
    expect(regradedQcmOption({ ...q, validExpression: 'a=100; void=-10; min=-100' }, QCM_VOID_OPTION_TEXT)).toEqual({
      text: QCM_VOID_OPTION_TEXT,
      description: 'incorrect (-10 %)',
      grade: -10,
    });
  });

  it('gives back the former descriptions for a former expression', () => {
    const q = { point: 2, step: 4, validExpression: 'a&b|c' };
    expect(regradedQcmOption(q, 'a&b')).toEqual({ text: 'a&b', description: 'correct 2pt', grade: 2 });
    expect(regradedQcmOption(q, 'b')).toEqual({ text: 'b', description: 'incorrect pénalité  - 0.50pt', grade: 4 });
    expect(regradedQcmOption(q, QCM_VOID_OPTION_TEXT)).toEqual({ text: QCM_VOID_OPTION_TEXT, description: 'void', grade: 0 });
  });

  it('refuses an invalid DSL', () => {
    expect(() => regradedQcmOption({ validExpression: 'a=1; c-25' }, 'a')).toThrow(InvalidQcmDslError);
  });
});
