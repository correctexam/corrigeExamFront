/**
 * Options of a QCM question (T19b). An option is a graded comment whose text is an answer (`a&c`: the ticked boxes,
 * in order) and whose description starts with `correct` or `incorrect` (see `qcmNote()` in `question-grading.ts`).
 * Shared by the autocorrection and by the answers added by hand. Pure module: no Angular, no HTTP.
 */

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

/** Option for an answer typed by a grader; undefined when no box is given. */
export function qcmOptionForAnswer(question: QcmQuestionLike, input: string): QcmOptionFields | undefined {
  const text = normalizeQcmAnswer(input);
  if (text === '') {
    return undefined;
  }
  return qcmOptionFields(question, text, isValidQcmAnswer(question, text));
}

/** The existing option matching an answer, whatever the order of its boxes. */
export function findQcmOption<T extends { text?: string | null }>(options: T[], answer: string): T | undefined {
  const normalized = normalizeQcmAnswer(answer);
  if (normalized === '') {
    return undefined;
  }
  return options.find(o => normalizeQcmAnswer(o.text) === normalized);
}
