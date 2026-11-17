#!/usr/bin/env node
/**
 * Vendors the Typst packages allowed in subjects (ADR 0004): the platform never downloads a package while
 * compiling. Resolves the `@preview/name:version` imports of the allowed packages recursively and writes one
 * `.tar.gz` per package plus `index.json` into `src/main/webapp/content/typst/packages/preview/`.
 *
 * Usage: node src/main/typst/vendor-packages.mjs <clone of github.com/typst/packages>
 * (`git clone --depth 1 --filter=blob:none --sparse https://github.com/typst/packages`, then
 *  `git sparse-checkout set packages/preview/<name>` for each package reported missing).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

/** Packages a subject may import directly. Their dependencies are added automatically. */
export const ALLOWED = [
  'tiaoma:0.4.0', // page code (Data Matrix), used by @local/correctexam
  'mitex:0.2.7', // LaTeX maths
  'codly:1.3.0', // code blocks
  'fletcher:0.5.8', // diagrams: nodes and arrows
  'cetz:0.4.2', // drawing
  'chronos:0.3.0', // sequence diagrams (also reads PlantUML sequence syntax)
  'diagraph:0.3.8', // Graphviz
  'pintorita:0.1.4', // Pintora diagrams
];

/** Documentation and samples: never read by a compilation, only by people. */
const EXCLUDED = [
  './docs',
  './doc',
  './examples',
  './example',
  './gallery',
  './tests',
  './test',
  './bench',
  './assets/*.pdf',
  './assets/*.png',
  '*.pdf',
  './manual*',
  './screenshots',
];

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../webapp/content/typst/packages/preview');
const src = process.argv[2];
if (!src) {
  console.error('usage: vendor-packages.mjs <typst/packages clone>');
  process.exit(2);
}

const importRe = /@preview\/([a-z0-9-]+):([0-9]+\.[0-9]+\.[0-9]+)/g;
const todo = [...ALLOWED];
const done = new Map();
const missing = [];
while (todo.length > 0) {
  const spec = todo.pop();
  if (done.has(spec)) continue;
  const [name, version] = spec.split(':');
  const dir = join(src, 'packages/preview', name, version);
  if (!existsSync(dir)) {
    missing.push(spec);
    done.set(spec, null);
    continue;
  }
  // dependencies of the files reachable from the entrypoint only (docs and examples import other packages)
  const entry = /entrypoint\s*=\s*"([^"]+)"/.exec(readFileSync(join(dir, 'typst.toml'), 'utf8'))[1];
  const deps = new Set();
  const seen = new Set();
  const queue = [join(dir, entry)];
  while (queue.length > 0) {
    const f = queue.pop();
    if (seen.has(f) || !existsSync(f)) continue;
    seen.add(f);
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(importRe)) deps.add(`${m[1]}:${m[2]}`);
    for (const m of text.matchAll(/(?:import|include)\s+"([^"@][^"]*\.typ)"/g)) {
      queue.push(m[1].startsWith('/') ? join(dir, m[1]) : join(dirname(f), m[1]));
    }
  }
  done.set(spec, { name, version, dir, deps: [...deps].sort() });
  todo.push(...deps);
}
if (missing.length > 0) {
  console.error(`missing in the clone (git sparse-checkout add packages/preview/<name>): ${missing.join(', ')}`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const index = [];
for (const p of [...done.values()].sort((a, b) => `${a.name}:${a.version}`.localeCompare(`${b.name}:${b.version}`))) {
  const file = `${p.name}-${p.version}.tar.gz`;
  // reproducible archive (sorted entries, fixed owner and date, no gzip timestamp), without the documentation
  const tar = execFileSync(
    'tar',
    [
      '--sort=name',
      '--owner=0',
      '--group=0',
      '--numeric-owner',
      '--mtime=2000-01-01',
      ...EXCLUDED.map(e => `--exclude=${e}`),
      '-cf',
      '-',
      '-C',
      p.dir,
      '.',
    ],
    { maxBuffer: 1 << 28 },
  );
  writeFileSync(join(out, file), gzipSync(tar, { level: 9 }));
  index.push({ name: p.name, version: p.version, file, bytes: statSync(join(out, file)).size, dependencies: p.deps });
}
writeFileSync(join(out, 'index.json'), JSON.stringify({ namespace: 'preview', allowed: ALLOWED, packages: index }, null, 2) + '\n');
console.log(index.map(p => `${p.name}:${p.version} ${(p.bytes / 1024).toFixed(0)} Ko`).join('\n'));
