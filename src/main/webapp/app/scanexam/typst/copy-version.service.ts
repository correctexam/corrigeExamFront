import { Injectable, inject } from '@angular/core';
import { ExamVersion, ExamVersionsService } from './exam-versions.service';
import { variantsOf } from './copy-version';
import type { VersionLayout } from './subject-versions';

/** What the correction shows about the version of a copy (T25e6). */
export interface CopyVersionInfo {
  label: string;
  /** Wordings printed in this version (`#variant`), numbered from 1. */
  variants: { key: string; wording: number }[];
  /** Layouts of version A and of this version, to cut the zones on the scanned pages; absent if not stored. */
  canonical?: VersionLayout;
  layout?: VersionLayout;
}

/** Versions of an exam for the correction, read once per exam. */
@Injectable({ providedIn: 'root' })
export class CopyVersionService {
  private readonly versionsService = inject(ExamVersionsService);
  private readonly cache = new Map<number, Promise<ExamVersion[]>>();

  /** Version `label` of the exam; the label alone when the versions cannot be read. */
  async info(examId: number, label: string): Promise<CopyVersionInfo> {
    let versions: ExamVersion[] = [];
    try {
      versions = await this.versions(examId);
    } catch (e) {
      console.warn('versions of the exam not read', e);
      this.cache.delete(examId);
    }
    const version = versions.find(v => v.label === label);
    return {
      label,
      variants: variantsOf(version?.plan),
      canonical: versions.find(v => v.index === 0)?.layout,
      layout: version?.layout,
    };
  }

  private versions(examId: number): Promise<ExamVersion[]> {
    let p = this.cache.get(examId);
    if (!p) {
      p = this.versionsService.list(examId);
      this.cache.set(examId, p);
    }
    return p;
  }
}
