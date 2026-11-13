import { describe, expect, it } from '@jest/globals';

import { addOutcome, canAutocorrect, emptyReport } from './qcm-autocorrection';

describe('QCM autocorrection rules', () => {
  it('keeps the answers corrected by hand unless everything is corrected again', () => {
    expect(canAutocorrect({ manuallyGraded: true }, 'keepManual')).toBe(false);
    expect(canAutocorrect({ manuallyGraded: true }, 'all')).toBe(true);
  });

  it('corrects the answers that were not corrected by hand, including those of an older back-end', () => {
    expect(canAutocorrect({ manuallyGraded: false }, 'keepManual')).toBe(true);
    expect(canAutocorrect({ manuallyGraded: null }, 'keepManual')).toBe(true);
    expect(canAutocorrect({}, 'keepManual')).toBe(true);
  });

  it('counts the updated and kept answers', () => {
    let report = emptyReport();
    report = addOutcome(report, 'updated');
    report = addOutcome(report, 'kept');
    report = addOutcome(report, 'updated');
    report = addOutcome(report, 'ignored');
    expect(report).toEqual({ updated: 2, kept: 1 });
  });
});
