/** Messages exchanged with `page-code.worker.ts` (T25d2): page codes read on scanned pages, page images changed. */

export type PageCodeWorkerRequest =
  /** Reads the code of a page (image as a data URL, as stored in the cache). */
  | { kind: 'read'; id: number; image: string }
  /** The same page turned by 180°. */
  | { kind: 'rotate'; id: number; image: string; type: string }
  /** A white page of the same size as `like`. */
  | { kind: 'blank'; id: number; like: string; type: string };

export type PageCodeWorkerResponse =
  | { kind: 'read'; id: number; text?: string; upsideDown?: boolean }
  | { kind: 'image'; id: number; image: string }
  | { kind: 'failure'; id: number; message: string };
