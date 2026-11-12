import { describe, expect, it } from '@jest/globals';
import { defaultCommentShortcut } from './comment-shortcuts';

describe('defaultCommentShortcut', () => {
  it.each([
    [0, '1'],
    [8, '9'],
    [9, 'a'],
    [10, 'b'],
    [34, 'z'],
  ])('comment #%i -> %s', (index, key) => {
    expect(defaultCommentShortcut(index)).toEqual(['ctrl + ' + key, 'cmd + ' + key]);
  });

  it('gives no shortcut after the 35th comment', () => {
    expect(defaultCommentShortcut(35)).toBeUndefined();
    expect(defaultCommentShortcut(100)).toBeUndefined();
  });
});
