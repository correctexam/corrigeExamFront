/**
 * Options of a QCM question (T19b). An option is a graded comment whose text is an answer (`a&c`: the ticked boxes,
 * in order) and whose description starts with `correct`, `partiel` or `incorrect`.
 * - Former valid expression (`a&b|a&c`): the note comes from the description (see `qcmNote()` in `question-grading.ts`).
 * - Grading DSL (`a&b=100; c=-25`, ADR 0002): `grade` holds the percentage of the question points the answer is
 *   worth, computed here from the DSL; the note comes from it (`qcmDslNote()`).
 * Shared by the autocorrection and by the answers added by hand. Pure module: no Angular, no HTTP.
 */

import { evaluateQcmDsl, isQcmDslExpression, parseQcmDsl, qcmDslExactAnswers, QcmDsl, storedPercent } from './qcm-dsl';

export interface QcmQuestionLike {
  point?: number;
  step?: number | null;
  /** Valid answers separated by `|`, e.g. `a&b|a&c`. */
  validExpression?: string | null;
}

export interface QcmOptionFields {
  text: string;
  description: string;
  grade: number | null | undefined;
}

/**
 * Normalizes an answer typed by a grader: letters only, lower case, each box once, in order, joined by `&`.
 * `"C a"`, `"a,c"`, `"a&c&a"` → `"a&c"`. Returns `""` when no box is given.
 */
export function normalizeQcmAnswer(input: string | null | undefined): string {
  const letters = (input ?? '').toLowerCase().match(/[a-z]/g) ?? [];
  return [...new Set(letters)].sort().join('&');
}

/** Valid answers of the question, as written in `validExpression`. */
export function validQcmAnswers(question: QcmQuestionLike): string[] {
  return (question.validExpression ?? '')
    .split('|')
    .map(a => a.trim())
    .filter(a => a !== '');
}

/** Whether `answer` is one of the valid answers (both normalized, so `b&a` matches `a&b`). */
export function isValidQcmAnswer(question: QcmQuestionLike, answer: string): boolean {
  const normalized = normalizeQcmAnswer(answer);
  return normalized !== '' && validQcmAnswers(question).some(v => normalizeQcmAnswer(v) === normalized);
}

/** Description and grade of an option, exactly as the autocorrection has always written them. */
export function qcmOptionFields(question: QcmQuestionLike, text: string, valid: boolean): QcmOptionFields {
  if (valid) {
    return { text, description: 'correct ' + question.point! + 'pt', grade: question.point };
  }
  return {
    text,
    description:
      question.step! > 0
        ? 'incorrect pénalité ' + ' - ' + ((1 / question.step!) * question.point!).toFixed(2) + 'pt'
        : 'incorrect pénalité ' + '0 pt',
    grade: question.step,
  };
}

/** Text of the option of a DSL question for a copy where no box is ticked (`void`, when it is not worth 0). */
export const QCM_VOID_OPTION_TEXT = '∅';

/** Raised when the grading DSL of a question cannot be parsed: no option can be valued. */
export class InvalidQcmDslError extends Error {
  constructor(public readonly validExpression: string | null | undefined) {
    super('Invalid QCM grading expression: ' + (validExpression ?? ''));
    this.name = 'InvalidQcmDslError';
  }
}

/** Parsed grading DSL of the question; undefined for a former expression; throws when the DSL is invalid. */
export function qcmDslOf(question: QcmQuestionLike): QcmDsl | undefined {
  if (!isQcmDslExpression(question.validExpression)) {
    return undefined;
  }
  const parsed = parseQcmDsl(question.validExpression);
  if (parsed.dsl === undefined) {
    throw new InvalidQcmDslError(question.validExpression);
  }
  return parsed.dsl;
}

/** Description of a DSL option: `correct (100 %)`, `partiel (50 %)`, `incorrect (-25 %)`. */
export function qcmDslDescription(percent: number): string {
  const prefix = percent >= 100 ? 'correct' : percent > 0 ? 'partiel' : 'incorrect';
  return prefix + ' (' + percent + ' %)';
}

/** Option of an answer (already normalized) for a question graded by DSL. */
export function qcmDslOptionFields(dsl: QcmDsl, text: string): QcmOptionFields {
  const percent = storedPercent(evaluateQcmDsl(dsl, text));
  return { text, description: qcmDslDescription(percent), grade: percent };
}

/** Option for an answer typed by a grader; undefined when no box is given or when the DSL is invalid. */
export function qcmOptionForAnswer(question: QcmQuestionLike, input: string): QcmOptionFields | undefined {
  const text = normalizeQcmAnswer(input);
  if (text === '') {
    return undefined;
  }
  let dsl: QcmDsl | undefined;
  try {
    dsl = qcmDslOf(question);
  } catch {
    return undefined;
  }
  return dsl !== undefined ? qcmDslOptionFields(dsl, text) : qcmOptionFields(question, text, isValidQcmAnswer(question, text));
}

/**
 * Options the autocorrection must create: the answers named by the valid expression or the DSL, and the detected
 * answers, minus those that already exist. With a former expression the texts are compared as written, as before;
 * with a DSL they are normalized. Throws InvalidQcmDslError when the DSL is invalid.
 */
export function qcmOptionsToCreate(
  question: QcmQuestionLike,
  detected: (string | null | undefined)[],
  existing: (string | null | undefined)[],
): QcmOptionFields[] {
  const dsl = qcmDslOf(question);
  if (dsl !== undefined) {
    const known = new Set(existing.map(e => normalizeQcmAnswer(e)));
    const texts = [...qcmDslExactAnswers(dsl), ...detected.map(d => normalizeQcmAnswer(d))].filter(t => t !== '');
    const options = [...new Set(texts)].filter(t => !known.has(t)).map(t => qcmDslOptionFields(dsl, t));
    // A copy without any ticked box gets an option only when `void` is not worth 0
    const voidPercent = storedPercent(evaluateQcmDsl(dsl, ''));
    if (voidPercent !== 0 && !existing.includes(QCM_VOID_OPTION_TEXT)) {
      options.push({ text: QCM_VOID_OPTION_TEXT, description: qcmDslDescription(voidPercent), grade: voidPercent });
    }
    return options;
  }
  const validExp = (question.validExpression ?? '').split('|');
  const validToCreate = validExp.filter(c => !existing.includes(c));
  const invalidToCreate = [
    ...new Set(
      detected.filter((c): c is string => c !== undefined && c !== null && !existing.includes(c) && !validExp.includes(c) && c !== ''),
    ),
  ];
  return [...validToCreate.map(t => qcmOptionFields(question, t, true)), ...invalidToCreate.map(t => qcmOptionFields(question, t, false))];
}

/** Option of the question matching a detected answer: as written for a former expression, normalized for a DSL. */
export function findOptionForSolution<T extends { text?: string | null }>(
  question: QcmQuestionLike,
  options: T[],
  solution: string,
): T | undefined {
  if (isQcmDslExpression(question.validExpression)) {
    return normalizeQcmAnswer(solution) === '' ? options.find(o => o.text === QCM_VOID_OPTION_TEXT) : findQcmOption(options, solution);
  }
  return options.find(o => o.text === solution);
}

/** The existing option matching an answer, whatever the order of its boxes. */
export function findQcmOption<T extends { text?: string | null }>(options: T[], answer: string): T | undefined {
  const normalized = normalizeQcmAnswer(answer);
  if (normalized === '') {
    return undefined;
  }
  return options.find(o => normalizeQcmAnswer(o.text) === normalized);
}
