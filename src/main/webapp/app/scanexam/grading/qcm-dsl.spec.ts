import { describe, expect, it } from '@jest/globals';

import {
  describeQcmDsl,
  evaluateQcmDsl,
  isQcmDslExpression,
  isValidQcmExpression,
  parseQcmDsl,
  qcmDslExactAnswers,
  QcmDsl,
  storedPercent,
} from './qcm-dsl';

function dsl(text: string): QcmDsl {
  const parsed = parseQcmDsl(text);
  expect(parsed.errors).toEqual([]);
  return parsed.dsl!;
}

describe('QCM grading DSL', () => {
  it('tells a DSL from a former valid expression', () => {
    expect(isQcmDslExpression('a&b|a&c=100')).toBe(true);
    expect(isQcmDslExpression('a&b|a&c')).toBe(false);
    expect(isQcmDslExpression(null)).toBe(false);
  });

  // Reference examples of ADR 0002 (same cases as QcmDslGradingTest in the back-end, from the percentage on)
  describe('reference examples of ADR 0002', () => {
    const cases: [string, string, number][] = [
      ['a&b|a&c=100; a|b=50; c=-25; *=-33', 'a&b', 100],
      ['a&b|a&c=100; a|b=50; c=-25; *=-33', 'b', 50],
      ['a&b|a&c=100; a|b=50; c=-25; *=-33', 'c', 0],
      ['a&b|a&c=100; a|b=50; c=-25; *=-33', 'a&b&c', 0],
      ['a&b=100; c=-25; *=-33; min=-100', 'c', -25],
      ['a&b=100; c=-25; *=-33; min=-100', 'a&b&c', -33],
      ['a&b=100; c=-25; *=-33; min=-100', '', 0],
      ['a&b=100; void=-10; min=-100', '', -10],
      ['a&b=100; a&b+=60', 'a&b&d', 60],
      ['a&b=100; a&b+=60', 'a&b', 100],
      ['[a]=50; [b]=50; [c]=-25; [d]=-25', 'a&c', 25],
      ['[a]=50; [b]=50; [c]=-25; [d]=-25', 'c&d', 0],
      ['a&b=100; [a]=40; [b]=40; [c]=-30', 'a&b', 100],
      ['a&b=100; [a]=40; [b]=40; [c]=-30', 'a&c', 10],
    ];
    it.each(cases)('%s : %s → %d %%', (text, answer, expected) => {
      expect(evaluateQcmDsl(dsl(text), answer)).toBe(expected);
    });
  });

  it('applies the defaults: void=0, *=0, min=0, max=100', () => {
    const d = dsl('a=100');
    expect(d.void).toBe(0);
    expect(d.other).toBe(0);
    expect(d.min).toBe(0);
    expect(d.max).toBe(100);
    expect(evaluateQcmDsl(d, 'b')).toBe(0);
    expect(evaluateQcmDsl(dsl('a=150; max=100'), 'a')).toBe(100);
  });

  it('applies the first matching answer rule, in writing order', () => {
    expect(evaluateQcmDsl(dsl('a&b+=60; a&b=100'), 'a&b')).toBe(60);
  });

  it('ignores whitespace, line breaks, upper case and a final separator', () => {
    const d = dsl(' A & B | a&c = 100 ;\n [C] = -25 ;\n * = -33.5 ; min = -100 ; ');
    expect(evaluateQcmDsl(d, 'a&c')).toBe(100);
    expect(evaluateQcmDsl(d, 'b&a')).toBe(100);
    expect(evaluateQcmDsl(d, 'c&d')).toBe(-25);
    expect(evaluateQcmDsl(d, 'd')).toBe(-33.5);
  });

  it('only counts the boxes when one of the ticked boxes has a value', () => {
    const d = dsl('[a]=50; *=-10; min=-100');
    expect(evaluateQcmDsl(d, 'a&b')).toBe(50);
    expect(evaluateQcmDsl(d, 'b')).toBe(-10);
  });

  it('lists the exact answers the options are created for', () => {
    expect(qcmDslExactAnswers(dsl('a&b|c&a=100; a&b+=50; d=-25'))).toEqual(['a&b', 'a&c', 'd']);
  });

  it('reports the errors with the rule and its position', () => {
    const errors = parseQcmDsl('a&b=100; c-25; d=x; a&b=50; [e]=1; [e]=2; *=1; *=2; min=-150; z=1=2; =5').errors;
    expect(errors.map(e => e.code)).toEqual([
      'missingEquals',
      'invalidPercent',
      'duplicateAnswer',
      'duplicateBox',
      'duplicateKeyword',
      'boundOutOfRange',
      'syntax',
      'invalidAnswer',
    ]);
    expect(errors[0]).toEqual({ code: 'missingEquals', rule: 'c-25', position: 9 });
    expect(parseQcmDsl('a=1; b|a=2').errors.map(e => e.code)).toEqual(['duplicateAnswer']);
    expect(parseQcmDsl('a=1; min=50; max=20').errors.map(e => e.code)).toEqual(['minGreaterThanMax']);
    expect(parseQcmDsl('a=1; 1=2; a&&b=3; ab=1').errors.map(e => e.code)).toEqual(['invalidAnswer', 'invalidAnswer', 'invalidAnswer']);
    expect(parseQcmDsl('a&b=100; c-25').dsl).toBeUndefined();
  });

  it('rounds the stored percentage to a quarter of a percent like the back-end', () => {
    expect(storedPercent(33.3333)).toBe(33.25);
    expect(storedPercent(-12.4)).toBe(-12.5);
    expect(storedPercent(50)).toBe(50);
  });
});
describe('QCM expression editing (T20 3/3)', () => {
  it('accepts a former expression or a DSL without error', () => {
    expect(isValidQcmExpression('a&b|a&c')).toBe(true);
    expect(isValidQcmExpression('a&b|a&c=100; *=-33')).toBe(true);
    expect(isValidQcmExpression('a&b|')).toBe(false);
    expect(isValidQcmExpression('a&b=100; c-25')).toBe(false);
    expect(isValidQcmExpression('')).toBe(false);
    expect(isValidQcmExpression(null)).toBe(false);
  });

  it('describes what each rule is worth once bounded', () => {
    const parsed = parseQcmDsl('a&b|a&c=100; a&b+=150; [d]=-25; void=-10; *=-33; min=-20');
    expect(describeQcmDsl(parsed.dsl!)).toEqual([
      { kind: 'answers', label: 'a&b | a&c', percent: 100 },
      { kind: 'answers', label: 'a&b+', percent: 100 },
      { kind: 'box', label: '[d]', percent: -25 },
      { kind: 'void', label: '', percent: -10 },
      { kind: 'other', label: '', percent: -20 },
      { kind: 'bounds', label: '', percent: -20, max: 100 },
    ]);
  });
});
