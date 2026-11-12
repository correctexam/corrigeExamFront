/**
 * Display-only rotation of the answer zones in the correction view (issue #653).
 *
 * Some students write their answer with the sheet in landscape. The corrector can turn the displayed zone by a
 * quarter turn. The rotation is applied as a view transform only:
 * - the scan image is drawn rotated on the image canvas;
 * - the annotation canvas (fabric) gets the same matrix as viewport transform, so annotations stay stored in the
 *   coordinates of the unrotated zone and are exported, reloaded and printed exactly as before.
 */

/** Clockwise rotation, in degrees. */
export type QuarterTurn = 0 | 90 | 180 | 270;

/** 1: clockwise, -1: counter-clockwise. */
export type RotationDirection = 1 | -1;

/** 2D affine matrix [a, b, c, d, e, f], same convention as CanvasRenderingContext2D.transform and fabric. */
export type RotationMatrix = [number, number, number, number, number, number];

export interface Size {
  width: number;
  height: number;
}

export function rotateQuarter(current: QuarterTurn, direction: RotationDirection): QuarterTurn {
  return ((((current + direction * 90) % 360) + 360) % 360) as QuarterTurn;
}

/** Size of the displayed (rotated) box for a zone of the given unrotated size. */
export function rotatedSize(width: number, height: number, rotation: QuarterTurn): Size {
  return rotation === 90 || rotation === 270 ? { width: height, height: width } : { width, height };
}

/**
 * Matrix mapping a point of the unrotated zone (size width x height) to the rotated display box, whose top-left
 * corner stays at (0, 0).
 */
export function rotationMatrix(rotation: QuarterTurn, width: number, height: number): RotationMatrix {
  switch (rotation) {
    case 90:
      // (x, y) -> (height - y, x)
      return [0, 1, -1, 0, height, 0];
    case 180:
      // (x, y) -> (width - x, height - y)
      return [-1, 0, 0, -1, width, height];
    case 270:
      // (x, y) -> (y, width - x)
      return [0, -1, 1, 0, 0, width];
    default:
      return [1, 0, 0, 1, 0, 0];
  }
}

export interface CorrectionPosition {
  examId: string | undefined;
  questionIndex: number | undefined;
}

/**
 * Rotation to apply after a navigation in the correction view: the corrector's choice is kept while moving from one
 * student to another on the same question, and reset to 0 when the question (or the exam) changes.
 */
export function rotationAfterNavigation(rotation: QuarterTurn, previous: CorrectionPosition, next: CorrectionPosition): QuarterTurn {
  return previous.examId === next.examId && previous.questionIndex === next.questionIndex ? rotation : 0;
}

/** Unrotated size of each annotation canvas, needed to export its SVG in zone coordinates. */
const sceneSizes = new WeakMap<object, Size & { rotation: QuarterTurn }>();

export function setSceneRotation(canvas: object, size: Size, rotation: QuarterTurn): void {
  sceneSizes.set(canvas, { ...size, rotation });
}

/**
 * Options for fabric `toSVG` so that a rotated canvas is exported in the coordinates of the unrotated zone.
 * Returns undefined for an unrotated canvas, which keeps the default export unchanged.
 * (Without them, fabric derives the viewBox from the viewport transform and divides by its zero diagonal.)
 */
export function svgExportOptions(
  canvas: object,
): { width: string; height: string; viewBox: { x: number; y: number; width: number; height: number } } | undefined {
  const scene = sceneSizes.get(canvas);
  if (scene === undefined || scene.rotation === 0) {
    return undefined;
  }
  return {
    width: `${scene.width}`,
    height: `${scene.height}`,
    viewBox: { x: 0, y: 0, width: scene.width, height: scene.height },
  };
}
