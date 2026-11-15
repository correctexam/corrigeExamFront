/** What the students of an exam see in the student portal /my (ADR 0003 of corrigeExamBack). */
export enum StudentAccess {
  /** Not listed. */
  HIDDEN = 'HIDDEN',
  /** Scanned sheet only (default of a new exam). */
  SHEET = 'SHEET',
  /** Corrected sheet: annotations, comments and grade. */
  GRADED = 'GRADED',
}
