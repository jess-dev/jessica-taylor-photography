/**
 * Remove unreferenced source images from the build.
 *
 * `import.meta.glob(..., { eager: true })` in src/lib/gallery.ts imports every
 * curated photo so Astro has its width/height at build time. Vite emits each
 * imported asset into dist/_astro whether or not the original is ever served,
 * which for a photography site means tens of megabytes of full-resolution JPEG
 * shipped alongside the optimised AVIF/WebP that visitors actually receive.
 *
 * This deletes only files nothing references. If a build ever does point at an
 * original, it stays, and the log below says so.
 */
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const ASSETS = join(DIST, '_astro');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);
const TEXT_EXT = new Set(['.html', '.css', '.js', '.xml', '.json', '.txt']);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const files = await walk(DIST);

// Everything that could name an asset: markup, styles, scripts, sitemap.
const haystack = (
  await Promise.all(
    files
      .filter((f) => TEXT_EXT.has(extname(f).toLowerCase()))
      .map((f) => readFile(f, 'utf8')),
  )
).join('\n');

const candidates = files.filter(
  (f) => f.startsWith(ASSETS) && IMAGE_EXT.has(extname(f).toLowerCase()),
);

let removed = 0;
let bytes = 0;

for (const file of candidates) {
  const name = file.slice(ASSETS.length + 1);
  if (haystack.includes(name)) continue;

  bytes += (await stat(file)).size;
  await unlink(file);
  removed += 1;
}

const mb = (bytes / 1024 / 1024).toFixed(1);
console.log(
  removed
    ? `[prune] removed ${removed} unreferenced image${removed === 1 ? '' : 's'} (${mb} MB)`
    : '[prune] nothing to remove',
);
