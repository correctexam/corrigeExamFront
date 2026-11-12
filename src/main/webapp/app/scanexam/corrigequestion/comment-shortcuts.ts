/** Number of comments that get a default shortcut: 1 to 9, then a to z. */
export const MAX_DEFAULT_COMMENT_SHORTCUTS = 35;

/**
 * Default keyboard shortcut of the comment at position `index` (0-based) in the comment list of a question:
 * `ctrl`/`cmd` + 1…9, then a…z. Comments after the 35th get none.
 */
export function defaultCommentShortcut(index: number): string[] | undefined {
  const position = index + 1;
  if (position > MAX_DEFAULT_COMMENT_SHORTCUTS) {
    return undefined;
  }
  // 'a' is char code 97 = 87 + 10
  const key = position > 9 ? String.fromCharCode(87 + position) : String(position);
  return ['ctrl + ' + key, 'cmd + ' + key];
}
