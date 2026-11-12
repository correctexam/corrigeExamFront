import { describe, expect, it } from '@jest/globals';
import {
  DEFAULT_TOUCH_NAVIGATION,
  ITouchNavigationPreference,
  shouldShowNavigationPad,
  withTouchNavigationDefaults,
} from './touch-navigation.preference';

describe('touch navigation preference', () => {
  it('uses the defaults when nothing is stored', () => {
    expect(withTouchNavigationDefaults(null)).toEqual(DEFAULT_TOUCH_NAVIGATION);
    expect(DEFAULT_TOUCH_NAVIGATION.swipeOnPage).toBe(true);
  });

  it('completes a partial preference', () => {
    expect(withTouchNavigationDefaults({ padSide: 'left' })).toEqual({ ...DEFAULT_TOUCH_NAVIGATION, padSide: 'left' });
  });

  it('replaces invalid stored values', () => {
    const stored = { pad: 'sometimes', padSide: 'top' } as unknown as Partial<ITouchNavigationPreference>;
    expect(withTouchNavigationDefaults(stored)).toEqual(DEFAULT_TOUCH_NAVIGATION);
  });

  it.each([
    ['auto', true, true],
    ['auto', false, false],
    ['always', false, true],
    ['never', true, false],
  ] as const)('pad %s on touch tablet=%s -> shown=%s', (mode, tablet, shown) => {
    expect(shouldShowNavigationPad(mode, tablet)).toBe(shown);
  });
});
