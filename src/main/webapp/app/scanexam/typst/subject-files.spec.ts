/**
 * @jest-environment node
 */
import {
  fromCompilerPath,
  isSubjectTextFile,
  normalizeSubjectPath,
  sha256Hex,
  sortSubjectPaths,
  subjectContentType,
  suggestSubjectPath,
  toCompilerPath,
} from './subject-files';

describe('subject files (same rules as SubjectPaths on the server)', () => {
  it('accepts relative paths with a known extension', () => {
    expect(normalizeSubjectPath('main.typ')).toBe('main.typ');
    expect(normalizeSubjectPath('./main.typ')).toBe('main.typ');
    expect(normalizeSubjectPath('code/Main.java')).toBe('code/Main.java');
    expect(normalizeSubjectPath('a/b/c/d/e.typ')).toBe('a/b/c/d/e.typ');
  });

  it('refuses what the server refuses', () => {
    for (const p of [
      undefined,
      null,
      '',
      '/etc/passwd.txt',
      '../main.typ',
      'a/../main.typ',
      'a//b.typ',
      'dir/',
      '.hidden.typ',
      'a b.typ',
      'main',
      'script.sh',
      'page.html',
      'a/b/c/d/e/f.typ',
      `${'x'.repeat(201)}.typ`,
    ]) {
      expect(normalizeSubjectPath(p)).toBeUndefined();
    }
  });

  it('tells text files from images', () => {
    expect(isSubjectTextFile('main.typ')).toBe(true);
    expect(isSubjectTextFile('uml/classes.puml')).toBe(true);
    expect(isSubjectTextFile('data.json')).toBe(true);
    expect(isSubjectTextFile('img/logo.png')).toBe(false);
    expect(isSubjectTextFile('img/logo.svg')).toBe(false);
    expect(subjectContentType('img/photo.JPG')).toBe('image/jpeg');
  });

  it('suggests an acceptable path for an uploaded file', () => {
    expect(suggestSubjectPath('Mon schéma.PNG')).toBe('Mon_sch_ma.png');
    expect(suggestSubjectPath('.env.txt', 'img/')).toBe('img/env.txt');
    expect(suggestSubjectPath('archive.zip')).toBeUndefined();
    expect(suggestSubjectPath('README')).toBeUndefined();
  });

  it('maps paths to the compiler and back', () => {
    expect(toCompilerPath('code/A.java')).toBe('/code/A.java');
    expect(fromCompilerPath('/code/A.java')).toBe('code/A.java');
    expect(fromCompilerPath('@preview/cetz:0.3.4/src/lib.typ')).toBeUndefined();
    expect(fromCompilerPath('/@memory/packages/x.typ')).toBeUndefined();
  });

  it('shows the main file first', () => {
    expect(sortSubjectPaths(['b.typ', 'main.typ', 'a/x.png'])).toEqual(['main.typ', 'a/x.png', 'b.typ']);
  });

  it('hashes like the server', async () => {
    expect(await sha256Hex(new TextEncoder().encode('abc'))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});
