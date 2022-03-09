export interface IZone {
  id?: number;
  xInit?: number | null;
  yInit?: number | null;
  xFinal?: number | null;
  yFinal?: number | null;
}

export class Zone implements IZone {
  constructor(
    public id?: number,
    public xInit?: number | null,
    public yInit?: number | null,
    public xFinal?: number | null,
    public yFinal?: number | null
  ) {}
}

export function getZoneIdentifier(zone: IZone): number | undefined {
  return zone.id;
}
