import { describe, expect, it } from '@jest/globals';

import { parseCachedPage, questionNumerosOf, responseOf } from './student-sheet-view.util';

describe('student sheet view helpers', () => {
  it('lists the question numbers once, sorted', () => {
    expect(questionNumerosOf([{ id: 1, numero: 3 }, { id: 2, numero: 1 }, { id: 3, numero: 3 }, { id: 4 }])).toEqual([1, 3]);
  });

  it('finds the answer to one of the zones of a question', () => {
    const responses = [
      { id: 10, questionId: 1 },
      { id: 11, questionId: 3 },
    ];
    expect(responseOf(responses, [{ id: 2 }, { id: 3 }])?.id).toBe(11);
    expect(responseOf(responses, [{ id: 4 }])).toBeUndefined();
  });

  it('reads a page of the cache', () => {
    const body = JSON.stringify({ pages: 'data:image/webp;base64,AAA', extra: { dataType: 'Map', value: [['a', 1]] } });
    const page = parseCachedPage(body) as unknown as { pages: string; extra: Map<string, number> };
    expect(page.pages).toBe('data:image/webp;base64,AAA');
    expect(page.extra.get('a')).toBe(1);
  });
});
