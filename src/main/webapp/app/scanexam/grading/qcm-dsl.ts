/**
 * Grading DSL of the QCM questions (ADR 0002 in corrigeExamBack/docs/adr), e.g.
 * `a&b|a&c=100; a|b=50; c=-25; *=-33`. Percentages are of the points of the question.
 *
 * ```
 * dsl     = rule { ";" rule } [ ";" ]                 whitespace and line breaks are ignored
 * rule    = answers "=" percent                       a&b|a&c=100   exact answers ; a&b+=25: at least a and b
 *         | "[" letter "]" "=" percent                [c]=-25       per box
 *         | "void" "=" percent                        no box ticked (default 0)
 *         | "*" "=" percent                           anything else (default 0)
 *         | ("min" | "max") "=" percent               bounds (default -100 and 100, within [-100, 100])
 * answers = answer { "|" answer } ; answer = letter { "&" letter } [ "+" ]
 * percent = [ "+" | "-" ] digits [ "." digits ]
 * ```
 *
 * Evaluation of an answer: no box → `void`; else the first answer rule that matches (in writing order); else the sum
 * of the `[x]` of the ticked boxes when at least one of them is defined; else `*`; then the bounds.
 *
 * This is the only parser of the DSL: the back-end only reads the percentage stored on each option.
 * Pure module: no Angular, no HTTP.
 */

/** A valid expression containing '=' is a grading DSL; otherwise it is the former `a&b|a&c` (same test in the back-end). */
export function isQcmDslExpression(validExpression: string | null | undefined): boolean {
  return (validExpression ?? '').includes('=');
}

export interface QcmDslAnswer {
  /** Ticked boxes, sorted, each once. */
  boxes: string[];
  /** `a&b+`: at least these boxes (others may be ticked too). */
  atLeast: boolean;
}

export interface QcmDslAnswerRule {
  answers: QcmDslAnswer[];
  percent: number;
}

export interface QcmDsl {
  answerRules: QcmDslAnswerRule[];
  /** Percentage of each box (`[a]=50`). */
  boxes: Map<string, number>;
  void: number;
  other: number;
  min: number;
  max: number;
}

export type QcmDslErrorCode =
  | 'syntax'
  | 'missingEquals'
  | 'invalidPercent'
  | 'invalidAnswer'
  | 'duplicateAnswer'
  | 'duplicateBox'
  | 'duplicateKeyword'
  | 'boundOutOfRange'
  | 'minGreaterThanMax';

export interface QcmDslError {
  code: QcmDslErrorCode;
  /** Text of the rule in error, trimmed. */
  rule: string;
  /** Index of the rule in the expression (for highlighting). */
  position: number;
}

export interface QcmDslParseResult {
  /** Undefined when there is at least one error. */
  dsl?: QcmDsl;
  errors: QcmDslError[];
}

const PERCENT = /^[+-]?\d+(\.\d+)?$/;
const ANSWER = /^[a-z](&[a-z])*\+?$/;
const BOX = /^\[([a-z])\]$/;
const KEYWORDS = ['void', '*', 'min', 'max'] as const;
type Keyword = (typeof KEYWORDS)[number];

const DEFAULTS: Record<Keyword, number> = { void: 0, '*': 0, min: -100, max: 100 };

function answerKey(answer: QcmDslAnswer): string {
  return answer.boxes.join('&') + (answer.atLeast ? '+' : '');
}

function parseAnswer(text: string): QcmDslAnswer | undefined {
  if (!ANSWER.test(text)) {
    return undefined;
  }
  const atLeast = text.endsWith('+');
  const letters = (atLeast ? text.slice(0, -1) : text).split('&');
  return { boxes: [...new Set(letters)].sort(), atLeast };
}

export function parseQcmDsl(text: string | null | undefined): QcmDslParseResult {
  const errors: QcmDslError[] = [];
  const dsl: QcmDsl = {
    answerRules: [],
    boxes: new Map(),
    void: DEFAULTS.void,
    other: DEFAULTS['*'],
    min: DEFAULTS.min,
    max: DEFAULTS.max,
  };
  const seenAnswers = new Set<string>();
  const seenKeywords = new Set<Keyword>();
  const source = text ?? '';

  let offset = 0;
  for (const segment of source.split(';')) {
    const position = offset + (segment.length - segment.trimStart().length);
    offset += segment.length + 1;
    const rule = segment.trim();
    if (rule === '') {
      continue;
    }
    const fail = (code: QcmDslErrorCode): void => {
      errors.push({ code, rule, position });
    };

    const parts = rule.split('=');
    if (parts.length !== 2) {
      fail(parts.length === 1 ? 'missingEquals' : 'syntax');
      continue;
    }
    const lhs = parts[0].replace(/\s+/g, '').toLowerCase();
    const rhs = parts[1].replace(/\s+/g, '');
    if (!PERCENT.test(rhs)) {
      fail('invalidPercent');
      continue;
    }
    const percent = Number(rhs);

    if ((KEYWORDS as readonly string[]).includes(lhs)) {
      const keyword = lhs as Keyword;
      if (seenKeywords.has(keyword)) {
        fail('duplicateKeyword');
        continue;
      }
      seenKeywords.add(keyword);
      if ((keyword === 'min' || keyword === 'max') && (percent < -100 || percent > 100)) {
        fail('boundOutOfRange');
        continue;
      }
      if (keyword === 'void') {
        dsl.void = percent;
      } else if (keyword === '*') {
        dsl.other = percent;
      } else if (keyword === 'min') {
        dsl.min = percent;
      } else {
        dsl.max = percent;
      }
      continue;
    }

    const box = BOX.exec(lhs);
    if (box) {
      if (dsl.boxes.has(box[1])) {
        fail('duplicateBox');
        continue;
      }
      dsl.boxes.set(box[1], percent);
      continue;
    }

    const answers: QcmDslAnswer[] = [];
    let valid = lhs !== '';
    for (const answerText of lhs.split('|')) {
      const answer = parseAnswer(answerText);
      if (answer === undefined) {
        valid = false;
        break;
      }
      answers.push(answer);
    }
    if (!valid) {
      fail('invalidAnswer');
      continue;
    }
    const keys = answers.map(answerKey);
    if (keys.some(k => seenAnswers.has(k)) || new Set(keys).size !== keys.length) {
      fail('duplicateAnswer');
      continue;
    }
    keys.forEach(k => seenAnswers.add(k));
    dsl.answerRules.push({ answers, percent });
  }

  if (errors.length === 0 && dsl.min > dsl.max) {
    errors.push({ code: 'minGreaterThanMax', rule: 'min=' + dsl.min + '; max=' + dsl.max, position: 0 });
  }
  return errors.length === 0 ? { dsl, errors } : { errors };
}

/** Boxes of an answer as detected (`a&c`) or typed; empty when no box is ticked. */
function ticked(answer: string | null | undefined): string[] {
  const letters = (answer ?? '').toLowerCase().match(/[a-z]/g) ?? [];
  return [...new Set(letters)].sort();
}

function matches(rule: QcmDslAnswer, boxes: string[]): boolean {
  if (rule.atLeast) {
    return rule.boxes.every(b => boxes.includes(b));
  }
  return rule.boxes.length === boxes.length && rule.boxes.every((b, i) => b === boxes[i]);
}

/** Percentage of the question points that `answer` (`a&c`, or empty when no box is ticked) is worth. */
export function evaluateQcmDsl(dsl: QcmDsl, answer: string | null | undefined): number {
  const boxes = ticked(answer);
  let percent: number;
  if (boxes.length === 0) {
    percent = dsl.void;
  } else {
    const rule = dsl.answerRules.find(r => r.answers.some(a => matches(a, boxes)));
    if (rule !== undefined) {
      percent = rule.percent;
    } else if (boxes.some(b => dsl.boxes.has(b))) {
      percent = boxes.reduce((sum, b) => sum + (dsl.boxes.get(b) ?? 0), 0);
    } else {
      percent = dsl.other;
    }
  }
  return Math.min(dsl.max, Math.max(dsl.min, percent));
}

/** Exact answers named by the DSL (`a&b|a&c=100` → `a&b`, `a&c`): options created before any copy is corrected. */
export function qcmDslExactAnswers(dsl: QcmDsl): string[] {
  return dsl.answerRules.flatMap(r => r.answers.filter(a => !a.atLeast).map(a => a.boxes.join('&')));
}

/** Percentage as stored in `GradedComment.grade`: the back-end keeps quarters of a percent. */
export function storedPercent(percent: number): number {
  return Math.round(percent * 4) / 4;
}

/** Former valid expression of a QCM: exact valid answers separated by `|` (`a&b|a&c`). */
export const LEGACY_QCM_EXPRESSION = /^[a-z]([&|][a-z])*$/;

/** Whether the valid expression of a QCM can be saved: a former expression or a DSL without error. */
export function isValidQcmExpression(validExpression: string | null | undefined): boolean {
  const text = validExpression ?? '';
  if (isQcmDslExpression(text)) {
    return parseQcmDsl(text).dsl !== undefined;
  }
  return LEGACY_QCM_EXPRESSION.test(text);
}

export interface QcmDslPreviewLine {
  kind: 'answers' | 'box' | 'void' | 'other' | 'bounds';
  /** `a&b | a&c`, `a&b+`, `[c]`; empty for void, other and bounds. */
  label: string;
  /** Percentage after bounds for answers, void and other; value of the box; `min` for bounds. */
  percent: number;
  /** `max` for bounds. */
  max?: number;
}

/** What each rule of a DSL is worth once bounded, to show the grader how the expression is understood. */
export function describeQcmDsl(dsl: QcmDsl): QcmDslPreviewLine[] {
  const bound = (p: number): number => Math.min(dsl.max, Math.max(dsl.min, p));
  const lines: QcmDslPreviewLine[] = dsl.answerRules.map(r => ({
    kind: 'answers',
    label: r.answers.map(a => a.boxes.join('&') + (a.atLeast ? '+' : '')).join(' | '),
    percent: bound(r.percent),
  }));
  [...dsl.boxes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([box, percent]) => lines.push({ kind: 'box', label: '[' + box + ']', percent }));
  lines.push({ kind: 'void', label: '', percent: bound(dsl.void) });
  lines.push({ kind: 'other', label: '', percent: bound(dsl.other) });
  lines.push({ kind: 'bounds', label: '', percent: dsl.min, max: dsl.max });
  return lines;
}
