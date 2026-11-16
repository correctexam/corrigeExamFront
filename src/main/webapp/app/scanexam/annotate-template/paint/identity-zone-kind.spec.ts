import { describe, expect, it } from '@jest/globals';

import { identityZoneKind } from './event-handler.service';
import { DrawingTools } from './models';

describe('identityZoneKind', () => {
  it('maps each identity box of the editor to the zone saved on the exam', () => {
    expect(identityZoneKind(DrawingTools.NOMBOX)).toBe('NAME');
    expect(identityZoneKind(DrawingTools.PRENOMBOX)).toBe('FIRSTNAME');
    expect(identityZoneKind(DrawingTools.INEBOX)).toBe('INE');
  });
});
