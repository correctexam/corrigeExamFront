/**
 * Messages exchanged with `page-code.worker.ts` (T25d2): page codes read on scanned pages, page images changed;
 * copies of a version other than A rebuilt in the layout of version A (T25e4).
 */

import type { RebuildIssue } from './version-rebuild';
import type { VersionLayout } from './subject-versions';

export type PageCodeWorkerRequest =
  /** Reads the code of a page (image as a data URL, as stored in the cache). */
  | { kind: 'read'; id: number; image: string }
  /** The same page turned by 180°. */
  | { kind: 'rotate'; id: number; image: string; type: string }
  /** A white page of the same size as `like`. */
  | { kind: 'blank'; id: number; like: string; type: string }
  /**
   * The aligned pages of a copy printed in version `layout`, rebuilt in the layout `canonical` on the pages of the
   * template; `mention` is written in the top margin of each rebuilt page.
   */
  | {
      kind: 'rebuild';
      id: number;
      copy: string[];
      templates: string[];
      canonical: VersionLayout;
      layout: VersionLayout;
      mention: string;
      type: string;
    };

export type PageCodeWorkerResponse =
  | { kind: 'read'; id: number; text?: string; upsideDown?: boolean }
  | { kind: 'image'; id: number; image: string }
  | { kind: 'rebuilt'; id: number; images: string[]; issues: RebuildIssue[] }
  | { kind: 'failure'; id: number; message: string };
