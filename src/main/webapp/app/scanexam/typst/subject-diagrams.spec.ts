/**
 * @jest-environment node
 */
import { DiagramRequest, DiagramStore, diagramKey, parseDiagramRequests } from './subject-diagrams';

describe('subject diagrams', () => {
  it('reads the requests of a compilation, once each, ignoring unknown entries', () => {
    const raw = [
      { format: 1, kind: 'plantuml', source: 'A -> B' },
      { format: 1, kind: 'plantuml', source: 'A -> B' },
      { format: 1, kind: 'd2', source: 'A -> B' },
      { format: 1, kind: 'ditaa', source: 'x' },
      { kind: 'mermaid' },
      null,
      'x',
    ];
    expect(parseDiagramRequests(raw)).toEqual([
      { kind: 'plantuml', source: 'A -> B' },
      { kind: 'd2', source: 'A -> B' },
    ]);
    expect(parseDiagramRequests(undefined)).toEqual([]);
  });

  it('renders each diagram once and gives the SVGs to the compiler', async () => {
    const renderer = jest.fn((r: DiagramRequest) => Promise.resolve(`<svg>${r.source}</svg>`));
    const store = new DiagramStore(renderer);
    const a: DiagramRequest = { kind: 'plantuml', source: 'A' };
    const b: DiagramRequest = { kind: 'mermaid', source: 'B' };

    expect(store.missing([a, b])).toEqual([a, b]);
    const first = store.ensure([a, b]);
    const concurrent = store.ensure([a]);
    expect(await first).toBe(true);
    // the second caller waited for the same rendering
    expect(await concurrent).toBe(true);
    expect(renderer).toHaveBeenCalledTimes(2);
    expect(store.missing([a, b])).toEqual([]);
    expect(await store.ensure([a, b])).toBe(false);
    expect(JSON.parse(store.input())).toEqual({ [diagramKey(a)]: '<svg>A</svg>', [diagramKey(b)]: '<svg>B</svg>' });
  });

  it('keeps a failure until the source changes or the teacher retries', async () => {
    let fail = true;
    const renderer = jest.fn(() => (fail ? Promise.reject(new Error('Syntax Error? (line 2)')) : Promise.resolve('<svg/>')));
    const store = new DiagramStore(renderer);
    const a: DiagramRequest = { kind: 'plantuml', source: 'A ->' };

    expect(await store.ensure([a])).toBe(false);
    expect(store.errors([a])).toEqual([{ request: a, message: 'Syntax Error? (line 2)' }]);
    expect(store.missing([a])).toEqual([]);
    await store.ensure([a]);
    expect(renderer).toHaveBeenCalledTimes(1);
    expect(store.input()).toBe('{}');

    fail = false;
    store.retry();
    expect(await store.ensure([a])).toBe(true);
    expect(store.errors([a])).toEqual([]);
  });
});
