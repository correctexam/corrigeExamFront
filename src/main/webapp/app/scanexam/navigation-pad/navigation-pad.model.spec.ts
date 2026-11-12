import { describe, expect, it } from '@jest/globals';
import { padSwipeAction } from './navigation-pad.model';

describe('padSwipeAction', () => {
  it.each([
    [{ direction: 'x', distance: -60 }, 'nextStudent'],
    [{ direction: 'x', distance: 60 }, 'previousStudent'],
    [{ direction: 'y', distance: -60 }, 'nextQuestion'],
    [{ direction: 'y', distance: 60 }, 'previousQuestion'],
  ] as const)('with copies: %o -> %s', (event, action) => {
    expect(padSwipeAction(event, true)).toBe(action);
  });

  it.each([
    [{ direction: 'x', distance: -60 }, 'nextQuestion'],
    [{ direction: 'x', distance: 60 }, 'previousQuestion'],
    [{ direction: 'y', distance: -60 }, 'nextQuestion'],
    [{ direction: 'y', distance: 60 }, 'previousQuestion'],
  ] as const)('student view (questions only): %o -> %s', (event, action) => {
    expect(padSwipeAction(event, false)).toBe(action);
  });
});
