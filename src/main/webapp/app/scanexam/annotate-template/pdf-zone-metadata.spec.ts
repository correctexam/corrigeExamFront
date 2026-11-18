/**
 * @jest-environment node
 */
import { DrawingTools } from './paint/models';
import { metadataRectToZone, pageSizeCm, parsePdfZoneMetadata, questionTypeFor, toMetadataRect, ZONE_SCALE } from './pdf-zone-metadata';

/** A4 portrait, as returned by pdf.js at scale 1. */
const A4 = pageSizeCm(595.276, 841.89);

describe('zones described in the metadata of a template PDF', () => {
  it('reads the keys written by the LaTeX class', () => {
    const rects = parsePdfZoneMetadata({
      'correctexam-lastname': '{"x":2.1,"y":5.6,"w":12.6,"h":0.9,"p":1}',
      'correctexam-answer-3-2-7': '{"x":1.8,"y":20,"w":1,"h":3,"p":2,"t":"qcm"}',
      Producer: 'LaTeX',
      'correctexam-unknown': '{"x":1,"y":1,"w":1,"h":1,"p":1}',
      'correctexam-answer-4-1': 'not json',
      'correctexam-stdid': '{"x":"2","y":1,"w":1,"h":1,"p":1}',
      'correctexam-answer-5': '{"x":1,"y":1,"w":1,"h":1,"p":1}',
    });
    expect(rects).toEqual([
      { x: 2.1, y: 5.6, w: 12.6, h: 0.9, p: 1, type: DrawingTools.NOMBOX },
      { x: 1.8, y: 20, w: 1, h: 3, p: 2, t: 'qcm', type: DrawingTools.QUESTIONBOX, q: 3, subq: 2 },
    ]);
    expect(parsePdfZoneMetadata(undefined)).toEqual([]);
  });

  it('converts centimetres to 1/100000 of the page, whatever the screen', () => {
    // 2.1 cm from the left, bottom edge 5.6 cm from the top, 12.6 × 0.9 cm
    const zone = metadataRectToZone(toMetadataRect('correctexam-lastname', '{"x":2.1,"y":5.6,"w":12.6,"h":0.9,"p":1}')!, A4);
    expect(zone.pageNumber).toBe(1);
    expect(zone.xInit).toBe(Math.round((2.1 / 21) * ZONE_SCALE));
    expect(zone.yInit).toBe(Math.round((4.7 / 29.7) * ZONE_SCALE));
    expect(zone.width).toBe(Math.round((12.6 / 21) * ZONE_SCALE));
    expect(zone.height).toBe(Math.round((0.9 / 29.7) * ZONE_SCALE));
  });

  it('gives the same zones as the former conversion on a standard screen', () => {
    // former formula, device pixel ratio 1: canvas of the page in CSS pixels at the zoom of the viewer
    const ppc = 37.795275591;
    const scale = 1.5;
    const canvas = { width: 595.276 * (96 / 72) * scale, height: 841.89 * (96 / 72) * scale };
    const r = toMetadataRect('correctexam-answer-1-1', '{"x":1.8,"y":14.5,"w":17.4,"h":4,"p":1}')!;
    const former = {
      xInit: Math.trunc(((r.x * ppc * ZONE_SCALE) / canvas.width) * scale),
      yInit: Math.trunc(((r.y * ppc * ZONE_SCALE) / canvas.height - (r.h * ppc * ZONE_SCALE) / canvas.height) * scale),
      width: Math.trunc(((r.w * ppc * ZONE_SCALE) / canvas.width) * scale),
      height: Math.trunc(((r.h * ppc * ZONE_SCALE) / canvas.height) * scale),
    };
    const zone = metadataRectToZone(r, A4);
    for (const k of ['xInit', 'yInit', 'width', 'height'] as const) {
      expect(Math.abs(zone[k]! - former[k])).toBeLessThanOrEqual(1);
    }
  });

  it('keeps a zone inside its page', () => {
    const zone = metadataRectToZone(toMetadataRect('correctexam-stdid', '{"x":-1,"y":31,"w":25,"h":0.5,"p":1}')!, A4);
    expect(zone.xInit).toBe(0);
    expect(zone.yInit).toBe(ZONE_SCALE);
    expect(zone.width).toBe(ZONE_SCALE);
  });

  it('finds the question types by name, not by fixed id', () => {
    const types = [
      { id: 11, algoName: 'QCM' },
      { id: 7, algoName: 'manual' },
      { id: 12, algoName: 'manuscrit' },
    ];
    const qcm = toMetadataRect('correctexam-answer-2-1', '{"x":1,"y":2,"w":1,"h":1,"p":1,"t":"qcm"}')!;
    const free = toMetadataRect('correctexam-answer-1-1', '{"x":1,"y":2,"w":1,"h":1,"p":1}')!;
    expect(questionTypeFor(qcm, types, 2)).toBe(11);
    // the preference of the teacher when it exists in this database
    expect(questionTypeFor(free, types, 12)).toBe(12);
    // a preference from another database (default 2): the manual type
    expect(questionTypeFor(free, types, 2)).toBe(7);
    expect(questionTypeFor(qcm, [{ id: 7, algoName: 'manual' }], 2)).toBeUndefined();
  });
});
