export interface IZone {
  id?: number;
  pageNumber?: number | null;
  xInit?: number | null;
  yInit?: number | null;
  width?: number | null;
  height?: number | null;
}

export class Zone implements IZone {
  constructor(
    public id?: number,
    public pageNumber?: number | null,
    public xInit?: number | null,
    public yInit?: number | null,
    public width?: number | null,
    public height?: number | null
  ) {}
}

export function getZoneIdentifier(zone: IZone): number | undefined {
  return zone.id;
}
