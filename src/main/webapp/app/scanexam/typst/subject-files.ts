/**
 * Files of a Typst subject (T25c, ADR 0004). Same rules as the server (`SubjectPaths`): relative paths, at most
 * 5 levels, plain names, extensions in an allow list. The editor checks them before sending anything.
 * Pure module.
 */

export const SUBJECT_MAIN_FILE = 'main.typ';
export const SUBJECT_MAX_DEPTH = 5;
export const SUBJECT_MAX_PATH_LENGTH = 200;

const SEGMENT = /^[A-Za-z0-9_][A-Za-z0-9._-]{0,99}$/;

/** Extensions accepted by the server, with the type stored for them. */
export const SUBJECT_FILE_TYPES: Readonly<Record<string, string>> = {
  typ: 'text/plain',
  txt: 'text/plain',
  md: 'text/markdown',
  csv: 'text/csv',
  json: 'application/json',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  xml: 'text/xml',
  java: 'text/plain',
  py: 'text/plain',
  c: 'text/plain',
  h: 'text/plain',
  cpp: 'text/plain',
  js: 'text/plain',
  ts: 'text/plain',
  sql: 'text/plain',
  puml: 'text/plain',
  dot: 'text/plain',
  mmd: 'text/plain',
  d2: 'text/plain',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

/** Accept list of the upload input. */
export const SUBJECT_FILE_ACCEPT = Object.keys(SUBJECT_FILE_TYPES)
  .map(e => `.${e}`)
  .join(',');

function extension(path: string): string | undefined {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : undefined;
}

/** The normalised path (a leading `./` removed), or undefined when the server would refuse it. */
export function normalizeSubjectPath(path: string | null | undefined): string | undefined {
  if (path === null || path === undefined) {
    return undefined;
  }
  const p = path.startsWith('./') ? path.slice(2) : path;
  if (p === '' || p.length > SUBJECT_MAX_PATH_LENGTH || p.startsWith('/') || p.endsWith('/') || p.includes('//')) {
    return undefined;
  }
  const segments = p.split('/');
  if (segments.length > SUBJECT_MAX_DEPTH || segments.some(s => !SEGMENT.test(s) || s === '.' || s === '..')) {
    return undefined;
  }
  const ext = extension(p);
  return ext !== undefined && ext in SUBJECT_FILE_TYPES ? p : undefined;
}

export function subjectContentType(path: string): string {
  return SUBJECT_FILE_TYPES[extension(path) ?? ''] ?? 'application/octet-stream';
}

/** Files edited as text in the editor (sources, code, diagram sources); the others are images. */
export function isSubjectTextFile(path: string): boolean {
  const type = subjectContentType(path);
  return type.startsWith('text/') || type === 'application/json';
}

/** Path seen by the compiler (absolute from the root of the subject). */
export function toCompilerPath(path: string): string {
  return `/${path}`;
}

/** Path of the subject for a compiler path (diagnostics); undefined for a package file. */
export function fromCompilerPath(path: string): string | undefined {
  return path.startsWith('/') && !path.startsWith('/@') ? path.slice(1) : undefined;
}

/** A file name dropped or chosen by the teacher, made acceptable when possible (`Mon schéma.PNG` → `Mon_sch_ma.png`). */
export function suggestSubjectPath(fileName: string, folder = ''): string | undefined {
  const dot = fileName.lastIndexOf('.');
  if (dot <= 0) {
    return undefined;
  }
  const base = fileName
    .slice(0, dot)
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .replace(/^[._-]+/, '')
    .slice(0, 90);
  const name = `${base || 'file'}.${fileName.slice(dot + 1).toLowerCase()}`;
  return normalizeSubjectPath(folder ? `${folder.replace(/\/+$/, '')}/${name}` : name);
}

/** Paths in the order shown by the editor: main file first, then alphabetical. */
export function sortSubjectPaths(paths: Iterable<string>): string[] {
  return [...paths].sort((a, b) => (a === SUBJECT_MAIN_FILE ? -1 : b === SUBJECT_MAIN_FILE ? 1 : a.localeCompare(b)));
}

/** SHA-256 (hex) of a content, the identity of a binary file for the compiler. */
export async function sha256Hex(data: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
