import { describe, expect, it } from '@jest/globals';
import { SwipeEvent, SwipeGestureTracker, SwipeTouchEvent, SwipeTouchPoint } from './swipe-gesture';

const down = (x: number, y: number, touchType?: string, touches = 1): SwipeTouchEvent => ({
  touches: { length: touches },
  changedTouches: [{ clientX: x, clientY: y, touchType } as SwipeTouchPoint],
});
const up = (x: number, y: number, remaining = 0): SwipeTouchEvent => ({
  touches: { length: remaining },
  changedTouches: [{ clientX: x, clientY: y }],
});

function swipe(tracker: SwipeGestureTracker, from: [number, number], to: [number, number], ignored = false): SwipeEvent | undefined {
  tracker.touchStart(down(...from), ignored);
  tracker.touchMove(down(...to));
  return tracker.touchEnd(up(...to));
}

describe('SwipeGestureTracker', () => {
  it('recognises a horizontal finger swipe', () => {
    const t = new SwipeGestureTracker();
    expect(swipe(t, [300, 200], [150, 210])).toEqual({ direction: 'x', distance: -150 });
  });

  it('recognises a vertical finger swipe', () => {
    const t = new SwipeGestureTracker();
    expect(swipe(t, [300, 200], [310, 320])).toEqual({ direction: 'y', distance: 120 });
  });

  it('ignores short moves', () => {
    expect(swipe(new SwipeGestureTracker(), [300, 200], [250, 200])).toBeUndefined();
  });

  it('ignores diagonal strokes', () => {
    expect(swipe(new SwipeGestureTracker(), [0, 0], [100, 90])).toBeUndefined();
  });

  it('ignores gestures whose target is ignored (annotation canvas)', () => {
    expect(swipe(new SwipeGestureTracker(), [300, 200], [100, 200], true)).toBeUndefined();
  });

  it('ignores the stylus reported by pointer events (Android, Surface)', () => {
    const t = new SwipeGestureTracker();
    t.notePointerDown('pen');
    expect(swipe(t, [300, 200], [100, 200])).toBeUndefined();
    // Le doigt suivant navigue de nouveau.
    t.notePointerDown('touch');
    expect(swipe(t, [300, 200], [100, 200])).toEqual({ direction: 'x', distance: -200 });
  });

  it('ignores the Apple Pencil reported by Touch.touchType', () => {
    const t = new SwipeGestureTracker();
    t.touchStart(down(300, 200, 'stylus'));
    expect(t.touchEnd(up(100, 200))).toBeUndefined();
  });

  it('accepts the stylus when allowed', () => {
    const t = new SwipeGestureTracker({ threshold: 70, axisRatio: 1.5, allowPen: true });
    t.notePointerDown('pen');
    expect(swipe(t, [300, 200], [100, 200])).toEqual({ direction: 'x', distance: -200 });
  });

  it('ignores multi-touch gestures (pinch-zoom)', () => {
    const t = new SwipeGestureTracker();
    t.touchStart(down(300, 200));
    t.touchStart(down(400, 200, undefined, 2));
    expect(t.touchEnd(up(100, 200, 1))).toBeUndefined();
    expect(t.touchEnd(up(100, 200, 0))).toBeUndefined();
    // Le geste suivant à un doigt fonctionne.
    expect(swipe(t, [300, 200], [100, 200])).toEqual({ direction: 'x', distance: -200 });
  });

  it('forgets a gesture cancelled by the browser', () => {
    const t = new SwipeGestureTracker();
    t.touchStart(down(300, 200));
    t.touchCancel();
    expect(t.touchEnd(up(100, 200))).toBeUndefined();
  });
});
