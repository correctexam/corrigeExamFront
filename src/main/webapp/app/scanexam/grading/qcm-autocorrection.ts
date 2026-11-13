/**
 * Rules of the QCM autocorrection about the answers a grader corrected by hand (T19a).
 * Pure module: no Angular, no HTTP.
 */

/**
 * - `keepManual`: the answers corrected by hand (`manuallyGraded`) are left untouched; the options of the question
 *   are kept and only the missing ones are created.
 * - `all`: every correction and option of the question is erased first, then everything is corrected again.
 */
export type QcmAutocorrectionMode = 'keepManual' | 'all';

/** What the autocorrection did with the answer of one copy. */
export type QcmAnswerOutcome = 'updated' | 'kept' | 'ignored';

export interface QcmAutocorrectionReport {
  /** Answers set from the detection. */
  updated: number;
  /** Answers corrected by hand, left untouched. */
  kept: number;
}

export interface ManuallyGradable {
  manuallyGraded?: boolean | null;
}

/** Whether the autocorrection may overwrite this answer. */
export function canAutocorrect(answer: ManuallyGradable, mode: QcmAutocorrectionMode): boolean {
  return mode === 'all' || answer.manuallyGraded !== true;
}

export function emptyReport(): QcmAutocorrectionReport {
  return { updated: 0, kept: 0 };
}

export function addOutcome(report: QcmAutocorrectionReport, outcome: QcmAnswerOutcome): QcmAutocorrectionReport {
  switch (outcome) {
    case 'updated':
      return { ...report, updated: report.updated + 1 };
    case 'kept':
      return { ...report, kept: report.kept + 1 };
    default:
      return report;
  }
}
