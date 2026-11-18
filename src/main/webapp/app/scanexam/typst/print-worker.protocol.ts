/** Messages exchanged with `print.worker.ts` (T25d): assembly of the print PDF off the UI thread. */

export interface PrintWorkerRequest {
  kind: 'print';
  id: number;
  /** One template per version (T25e); copy c uses template (c - 1) mod templates.length. */
  templates: Uint8Array[];
  /** Letters of the versions, one per template. */
  labels?: string[];
  edition: number;
  copies: number;
}

export type PrintWorkerResponse =
  | { kind: 'progress'; id: number; done: number; total: number }
  | { kind: 'printed'; id: number; pdf: Uint8Array }
  | { kind: 'failure'; id: number; message: string };
