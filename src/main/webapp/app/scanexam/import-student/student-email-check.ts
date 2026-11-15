/**
 * Checks of the student e-mail addresses for the student portal /my (ADR 0003 of corrigeExamBack): a student finds
 * their sheets only through the address of their record, compared trimmed and in lower case. Same rules as
 * StudentPortalService in the back-end. Pure module: no Angular.
 */

export type StudentEmailIssue = 'empty' | 'invalid' | 'duplicate';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 254;

/** Trimmed and lower-case address, the form compared by the student portal. */
export function normalizeStudentEmail(email: string | null | undefined): string {
  return (email ?? '').trim().toLowerCase();
}

export function isValidStudentEmail(email: string | null | undefined): boolean {
  const normalized = normalizeStudentEmail(email);
  return normalized.length > 0 && normalized.length <= MAX_LENGTH && EMAIL.test(normalized);
}

/**
 * Issue of each address of a list, by index (addresses without issue are absent): empty, invalid, or used by another
 * entry of the list (whatever the case and the surrounding spaces). Two students with the same address would see
 * each other's sheets in the portal.
 */
export function studentEmailIssues(emails: (string | null | undefined)[]): Map<number, StudentEmailIssue> {
  const issues = new Map<number, StudentEmailIssue>();
  const counts = new Map<string, number>();
  emails.forEach(e => {
    const n = normalizeStudentEmail(e);
    if (n !== '') {
      counts.set(n, (counts.get(n) ?? 0) + 1);
    }
  });
  emails.forEach((e, i) => {
    const n = normalizeStudentEmail(e);
    if (n === '') {
      issues.set(i, 'empty');
    } else if (!isValidStudentEmail(n)) {
      issues.set(i, 'invalid');
    } else if ((counts.get(n) ?? 0) > 1) {
      issues.set(i, 'duplicate');
    }
  });
  return issues;
}
