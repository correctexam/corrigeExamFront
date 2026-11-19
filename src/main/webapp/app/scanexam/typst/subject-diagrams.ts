/**
 * Diagrams written as text in a subject (`#diagram("plantuml", ...)`, T25c, ADR 0004). The package exposes each
 * diagram as `<ce-diagram>` metadata; the platform has them rendered once by Kroki (through the API, SVG cached by
 * content) and gives the SVGs back to the compiler in the input `ce-diagrams`. Compilation stays offline: a
 * diagram that is not rendered yet is a dashed frame. Pure module.
 */

/** Kinds rendered by the platform, same list as the package (`DIAGRAM_KINDS`) and the server (`DiagramKinds`). */
export const DIAGRAM_KINDS = ['plantuml', 'c4plantuml', 'mermaid', 'd2', 'nomnoml'] as const;
export type DiagramKind = (typeof DIAGRAM_KINDS)[number];

export interface DiagramRequest {
  kind: DiagramKind;
  source: string;
}

/** Renders a diagram and returns its SVG; rejects with a message for the teacher. */
export type DiagramRenderer = (request: DiagramRequest) => Promise<string>;

/** Name of the compiler input read by the package. */
export const DIAGRAM_INPUT = 'ce-diagrams';

export function diagramKey(request: DiagramRequest): string {
  return `${request.kind}\n${request.source}`;
}

function isKind(value: unknown): value is DiagramKind {
  return typeof value === 'string' && (DIAGRAM_KINDS as readonly string[]).includes(value);
}

/** Diagrams of a compilation (`query(<ce-diagram>)`), each once, in document order. Unknown entries are ignored. */
export function parseDiagramRequests(raw: unknown): DiagramRequest[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const seen = new Set<string>();
  const requests: DiagramRequest[] = [];
  for (const item of raw as unknown[]) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }
    const { kind, source } = item as { kind?: unknown; source?: unknown };
    if (!isKind(kind) || typeof source !== 'string') {
      continue;
    }
    const request = { kind, source };
    const key = diagramKey(request);
    if (!seen.has(key)) {
      seen.add(key);
      requests.push(request);
    }
  }
  return requests;
}

type Entry = { state: 'ready'; svg: string } | { state: 'pending'; promise: Promise<void> } | { state: 'error'; message: string };

export interface DiagramError {
  request: DiagramRequest;
  message: string;
}

/**
 * SVGs of the diagrams of the subject being edited. A diagram is rendered once (concurrent requests share the same
 * call); a failed one is not tried again until its source changes or `retry` is called (the teacher fixes the source,
 * which changes the key).
 */
export class DiagramStore {
  private readonly entries = new Map<string, Entry>();

  constructor(private readonly renderer: DiagramRenderer) {}

  /** Diagrams neither rendered nor failed. */
  missing(requests: DiagramRequest[]): DiagramRequest[] {
    return requests.filter(r => {
      const e = this.entries.get(diagramKey(r));
      return e === undefined || e.state === 'pending';
    });
  }

  errors(requests: DiagramRequest[]): DiagramError[] {
    return requests.flatMap(request => {
      const e = this.entries.get(diagramKey(request));
      return e?.state === 'error' ? [{ request, message: e.message }] : [];
    });
  }

  /** Renders the missing diagrams; true when at least one new SVG is available (the subject must be compiled again). */
  async ensure(requests: DiagramRequest[]): Promise<boolean> {
    const before = this.readyCount(requests);
    await Promise.all(requests.map(r => this.render(r)));
    return this.readyCount(requests) > before;
  }

  /** Forgets the failures, e.g. after Kroki was unavailable. */
  retry(): void {
    for (const [key, e] of this.entries) {
      if (e.state === 'error') {
        this.entries.delete(key);
      }
    }
  }

  /** Value of the `ce-diagrams` input: every diagram rendered so far (a removed one costs nothing to Typst). */
  input(): string {
    const svgs: Record<string, string> = {};
    for (const [key, e] of this.entries) {
      if (e.state === 'ready') {
        svgs[key] = e.svg;
      }
    }
    return JSON.stringify(svgs);
  }

  private readyCount(requests: DiagramRequest[]): number {
    return requests.filter(r => this.entries.get(diagramKey(r))?.state === 'ready').length;
  }

  private render(request: DiagramRequest): Promise<void> {
    const key = diagramKey(request);
    const e = this.entries.get(key);
    if (e?.state === 'pending') {
      return e.promise;
    }
    if (e !== undefined) {
      return Promise.resolve();
    }
    const promise = this.renderer(request).then(
      svg => {
        this.entries.set(key, { state: 'ready', svg });
      },
      (err: unknown) => {
        this.entries.set(key, { state: 'error', message: err instanceof Error ? err.message : String(err) });
      },
    );
    this.entries.set(key, { state: 'pending', promise });
    return promise;
  }
}
