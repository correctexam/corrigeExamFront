import { describe, expect, it } from '@jest/globals';

import { isValidStudentEmail, normalizeStudentEmail, studentEmailIssues } from './student-email-check';

describe('student e-mail checks for the student portal', () => {
  it('normalizes like the back-end', () => {
    expect(normalizeStudentEmail('  Alice.Martin@Univ-Rennes.FR ')).toBe('alice.martin@univ-rennes.fr');
    expect(normalizeStudentEmail(undefined)).toBe('');
  });

  it('accepts any domain but refuses malformed addresses', () => {
    expect(isValidStudentEmail('alice@gmail.com')).toBe(true);
    expect(isValidStudentEmail(' Alice@Etudiant.Univ-Rennes.fr ')).toBe(true);
    expect(isValidStudentEmail('alice')).toBe(false);
    expect(isValidStudentEmail('alice@univ')).toBe(false);
    expect(isValidStudentEmail('alice martin@univ.fr')).toBe(false);
    expect(isValidStudentEmail('a@b.c'.padStart(260, 'x'))).toBe(false);
  });

  it('reports empty, invalid and duplicate addresses by index', () => {
    const issues = studentEmailIssues(['alice@univ.fr', '', 'bob', ' ALICE@univ.fr', 'carol@univ.fr', null]);
    expect([...issues.entries()]).toEqual([
      [0, 'duplicate'],
      [1, 'empty'],
      [2, 'invalid'],
      [3, 'duplicate'],
      [5, 'empty'],
    ]);
  });
});
