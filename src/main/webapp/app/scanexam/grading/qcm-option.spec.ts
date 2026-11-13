import { describe, expect, it } from '@jest/globals';

import { findQcmOption, isValidQcmAnswer, normalizeQcmAnswer, qcmOptionFields, qcmOptionForAnswer } from './qcm-option';

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
