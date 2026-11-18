/**
 * Version of a copy during the correction (T25e6, ADR 0005). The copies of versions B, C… were rebuilt in the layout
 * of version A after the alignment (T25e4/T25e5): their aligned pages carry the letter of their version (`rebuilt`
 * in the JSON of the page). Their scanned pages (not aligned) keep the layout of their version: to cut a zone of
 * the exam on them, the zone is looked up in the layout of the version. Pure module.
 */

import type { IZone } from 'app/entities/zone/zone.model';
import type { VersionLayout } from './subject-versions';

/** Letter of the version an aligned page was rebuilt from; undefined for a page of version A or not rebuilt. */
export function rebuiltLabel(value: string | undefined | null): string | undefined {
  if (!value) {
    return undefined;
  }
  try {
    const rebuilt = (JSON.parse(value) as { rebuilt?: unknown }).rebuilt;
    return typeof rebuilt === 'string' && rebuilt !== '' ? rebuilt : undefined;
  } catch {
    return undefined;
  }
}

/** The zones of the exam are those of the layout of version A, to the unit (`planExam`): a small tolerance. */
const TOLERANCE = 2;

const same = (a: IZone, b: IZone): boolean =>
  (a.pageNumber ?? 1) === (b.pageNumber ?? 1) &&
  Math.abs((a.xInit ?? 0) - (b.xInit ?? 0)) <= TOLERANCE &&
  Math.abs((a.yInit ?? 0) - (b.yInit ?? 0)) <= TOLERANCE &&
  Math.abs((a.width ?? 0) - (b.width ?? 0)) <= TOLERANCE &&
  Math.abs((a.height ?? 0) - (b.height ?? 0)) <= TOLERANCE;

/**
 * The zone of the exam `zone` (layout of version A) on the scanned pages of a copy of version `layout`: the part of
 * the same question at its place in that version, or the same identity zone. Undefined when the zone is not one of
 * the layout of version A (zone drawn by hand after the creation of the exam).
 */
export function zoneInVersion(zone: IZone, canonical: VersionLayout, layout: VersionLayout): IZone | undefined {
  const part = canonical.parts.find(p => same(p.zone, zone));
  if (part) {
    const moved = layout.parts.find(p => p.key === part.key && p.part === part.part);
    return moved ? { ...zone, ...moved.zone, id: zone.id } : undefined;
  }
  for (const [role, z] of Object.entries(canonical.identity)) {
    if (z && same(z, zone)) {
      const moved = layout.identity[role as keyof VersionLayout['identity']];
      return moved ? { ...zone, ...moved, id: zone.id } : undefined;
    }
  }
  return undefined;
}

/** Wordings printed in a version (`ce-plan.variants`): key of the variant and wording, numbered from 1. */
export function variantsOf(cePlan: Record<string, unknown> | undefined): { key: string; wording: number }[] {
  const variants = cePlan?.['variants'];
  if (typeof variants !== 'object' || variants === null || Array.isArray(variants)) {
    return [];
  }
  return Object.entries(variants as Record<string, unknown>)
    .filter((e): e is [string, number] => typeof e[1] === 'number')
    .map(([key, index]) => ({ key, wording: index + 1 }))
    .sort((a, b) => a.key.localeCompare(b.key));
}
