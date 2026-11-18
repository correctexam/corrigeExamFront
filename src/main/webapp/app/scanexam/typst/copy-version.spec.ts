/**
 * @jest-environment node
 */
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import type { IZone } from 'app/entities/zone/zone.model';
import { rebuiltLabel, variantsOf, zoneInVersion } from './copy-version';
import { CopyVersionService } from './copy-version.service';
import { ExamVersion, ExamVersionsService } from './exam-versions.service';
import type { VersionLayout } from './subject-versions';

const zone = (pageNumber: number, xInit: number, yInit: number, width = 50000, height = 10000): IZone => ({
  pageNumber,
  xInit,
  yInit,
  width,
  height,
});
const canonical: VersionLayout = {
  format: 1,
  version: 0,
  label: 'A',
  pages: 2,
  parts: [
    { key: 'q1', part: 1, zone: zone(1, 10000, 20000) },
    { key: 'q2', part: 1, zone: zone(1, 10000, 40000) },
  ],
  boxes: [],
  identity: { lastname: zone(1, 15000, 5000, 60000, 3000) },
};
const versionB: VersionLayout = {
  ...canonical,
  version: 1,
  label: 'B',
  parts: [
    { key: 'q2', part: 1, zone: zone(1, 10000, 20000) },
    { key: 'q1', part: 1, zone: zone(2, 10000, 60000) },
  ],
};

describe('version of a copy in the correction (T25e6)', () => {
  it('reads the letter of a rebuilt page', () => {
    expect(rebuiltLabel(JSON.stringify({ pages: 'data:', rebuilt: 'B' }))).toBe('B');
    expect(rebuiltLabel(JSON.stringify({ pages: 'data:' }))).toBeUndefined();
    expect(rebuiltLabel('{"pages":"x","rebuilt":""}')).toBeUndefined();
    expect(rebuiltLabel('not json')).toBeUndefined();
    expect(rebuiltLabel(undefined)).toBeUndefined();
  });

  it('finds a zone of the exam at its place in the version of the copy', () => {
    // the zone of the exam keeps its id; a rounding of a unit is tolerated
    expect(zoneInVersion({ ...zone(1, 10001, 20000), id: 7 }, canonical, versionB)).toEqual({ ...zone(2, 10000, 60000), id: 7 });
    expect(zoneInVersion(zone(1, 10000, 40000), canonical, versionB)).toEqual(zone(1, 10000, 20000));
    expect(zoneInVersion(zone(1, 15000, 5000, 60000, 3000), canonical, versionB)).toEqual(zone(1, 15000, 5000, 60000, 3000));
    // a zone drawn by hand after the creation of the exam is not in the layouts
    expect(zoneInVersion(zone(1, 10000, 30000), canonical, versionB)).toBeUndefined();
    expect(zoneInVersion(zone(1, 10000, 20000), canonical, { ...versionB, parts: [] })).toBeUndefined();
  });

  it('lists the wordings of a version', () => {
    expect(variantsOf({ variants: { 'v-q3': 0, 'v-q1': 1 } })).toEqual([
      { key: 'v-q1', wording: 2 },
      { key: 'v-q3', wording: 1 },
    ]);
    expect(variantsOf({})).toEqual([]);
    expect(variantsOf(undefined)).toEqual([]);
  });

  describe('CopyVersionService', () => {
    const versions = [
      { index: 0, label: 'A', layout: canonical, plan: { variants: { v: 0 } } },
      { index: 1, label: 'B', layout: versionB, plan: { variants: { v: 1 } } },
    ] as unknown as ExamVersion[];
    let list: jest.Mock;

    beforeEach(() => {
      list = jest.fn(() => Promise.resolve(versions));
      TestBed.configureTestingModule({
        providers: [
          { provide: DOCUMENT, useValue: { cookie: '' } },
          { provide: ExamVersionsService, useValue: { list } },
        ],
      });
    });

    it('gives the wordings and the layouts of a version, reading the versions once per exam', async () => {
      const service = TestBed.inject(CopyVersionService);
      await expect(service.info(7, 'B')).resolves.toEqual({
        label: 'B',
        variants: [{ key: 'v', wording: 2 }],
        canonical,
        layout: versionB,
      });
      await service.info(7, 'B');
      expect(list).toHaveBeenCalledTimes(1);
    });

    it('keeps the letter when the versions cannot be read', async () => {
      list.mockImplementationOnce(() => Promise.reject(new Error('403')));
      const service = TestBed.inject(CopyVersionService);
      await expect(service.info(7, 'C')).resolves.toEqual({ label: 'C', variants: [], canonical: undefined, layout: undefined });
      // read again next time
      await expect(service.info(7, 'B')).resolves.toMatchObject({ layout: versionB });
    });
  });
});
