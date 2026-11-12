import { QuarterTurn, rotateQuarter, rotatedSize, rotationMatrix, setSceneRotation, svgExportOptions } from './zone-rotation';

function apply(m: number[], x: number, y: number): [number, number] {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

describe('zone-rotation', () => {
  it('turns by a quarter in both directions and wraps around', () => {
    expect(rotateQuarter(0, 1)).toBe(90);
    expect(rotateQuarter(270, 1)).toBe(0);
    expect(rotateQuarter(0, -1)).toBe(270);
    expect(rotateQuarter(90, -1)).toBe(0);
  });

  it('swaps width and height for a quarter turn only', () => {
    expect(rotatedSize(200, 100, 0)).toEqual({ width: 200, height: 100 });
    expect(rotatedSize(200, 100, 90)).toEqual({ width: 100, height: 200 });
    expect(rotatedSize(200, 100, 180)).toEqual({ width: 200, height: 100 });
    expect(rotatedSize(200, 100, 270)).toEqual({ width: 100, height: 200 });
  });

  it('maps the zone corners inside the rotated box', () => {
    const w = 200;
    const h = 100;
    ([0, 90, 180, 270] as QuarterTurn[]).forEach(r => {
      const m = rotationMatrix(r, w, h);
      const box = rotatedSize(w, h, r);
      const corners = [apply(m, 0, 0), apply(m, w, 0), apply(m, 0, h), apply(m, w, h)];
      expect(corners.map(c => c[0]).sort((a, b) => a - b)).toEqual([0, 0, box.width, box.width]);
      expect(corners.map(c => c[1]).sort((a, b) => a - b)).toEqual([0, 0, box.height, box.height]);
    });
  });

  it('turns clockwise for 90 degrees: the top-left corner goes to the top-right', () => {
    expect(apply(rotationMatrix(90, 200, 100), 0, 0)).toEqual([100, 0]);
    expect(apply(rotationMatrix(270, 200, 100), 0, 0)).toEqual([0, 200]);
  });

  it('exports a rotated canvas in zone coordinates and leaves an unrotated one untouched', () => {
    const rotated = {};
    const straight = {};
    setSceneRotation(rotated, { width: 200, height: 100 }, 90);
    setSceneRotation(straight, { width: 200, height: 100 }, 0);
    expect(svgExportOptions(rotated)).toEqual({ width: '200', height: '100', viewBox: { x: 0, y: 0, width: 200, height: 100 } });
    expect(svgExportOptions(straight)).toBeUndefined();
    expect(svgExportOptions({})).toBeUndefined();
  });
});
