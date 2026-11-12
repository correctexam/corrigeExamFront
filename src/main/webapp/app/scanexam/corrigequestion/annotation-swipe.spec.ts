import { describe, expect, it } from '@jest/globals';
import { DrawingTools } from '../annotate-template/paint/models';
import { isAnnotationGesture } from './annotation-swipe';

describe('isAnnotationGesture', () => {
  const container = document.createElement('div');
  container.className = 'canvas-container';
  const upperCanvas = document.createElement('canvas');
  container.appendChild(upperCanvas);
  const outside = document.createElement('div');

  it('lets gestures outside the annotation canvas navigate', () => {
    expect(isAnnotationGesture(outside, DrawingTools.PENCIL, () => true)).toBe(false);
    expect(isAnnotationGesture(null, DrawingTools.PENCIL, () => true)).toBe(false);
  });

  it.each([DrawingTools.PENCIL, DrawingTools.RECTANGLE, DrawingTools.TEXT, DrawingTools.ERASER, DrawingTools.CUSTOMSVG])(
    'blocks navigation on the canvas with %s',
    tool => {
      expect(isAnnotationGesture(upperCanvas, tool, () => false)).toBe(true);
    },
  );

  it('lets the select tool navigate from an empty area of the canvas', () => {
    expect(isAnnotationGesture(upperCanvas, DrawingTools.SELECT, () => false)).toBe(false);
  });

  it('blocks the select tool when the gesture starts on an annotation', () => {
    expect(isAnnotationGesture(upperCanvas, DrawingTools.SELECT, () => true)).toBe(true);
  });
});
