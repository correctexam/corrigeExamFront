/* eslint-disable spaced-comment */
/// <reference lib="webworker" />

/**
 * Reads the page codes (Data Matrix `CE1|print run|copy|page`) on scanned pages off the UI thread (T25d2, ADR 0004),
 * and turns or creates page images for the reordering. Messages: `scanexam/typst/page-code-worker.protocol.ts`.
 * The decoder (zxing-cpp in WebAssembly, ~1 Mo) is served by the application, never downloaded from a CDN.
 */

import { prepareZXingModule, readBarcodes } from 'zxing-wasm/reader';
import { pickCode } from './scanexam/typst/page-codes';
import { PageCodeWorkerRequest, PageCodeWorkerResponse } from './scanexam/typst/page-code-worker.protocol';
import { Raster, rebuildCopy } from './scanexam/typst/version-rebuild';

const base = new URL('content/zxing/', self.location.href);
prepareZXingModule({
  overrides: {
    locateFile: (path: string, prefix: string) => (path.endsWith('.wasm') ? new URL(path, base).href : prefix + path),
  },
});

/** Height of the band read at the bottom and at the top of a page (the code is printed 3.5 to 14.5 mm from the edge). */
const BAND = 0.12;

async function bitmap(image: string): Promise<ImageBitmap> {
  return createImageBitmap(await (await fetch(image)).blob());
}

async function readBand(img: ImageBitmap, top: boolean): Promise<{ text: string }[]> {
  const h = Math.max(1, Math.round(img.height * BAND));
  const canvas = new OffscreenCanvas(img.width, h);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, top ? 0 : img.height - h, img.width, h, 0, 0, img.width, h);
  const results = await readBarcodes(ctx.getImageData(0, 0, img.width, h), {
    formats: ['DataMatrix'],
    tryHarder: true,
    tryRotate: true,
    maxNumberOfSymbols: 2,
  });
  return results.filter(r => r.isValid).map(r => ({ text: r.text }));
}

async function toDataUrl(canvas: OffscreenCanvas, type: string): Promise<string> {
  const blob = await canvas.convertToBlob({ type, quality: 1 });
  return new FileReaderSync().readAsDataURL(blob);
}

async function raster(image: string): Promise<Raster> {
  const img = await bitmap(image);
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  img.close();
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { width: data.width, height: data.height, data: data.data };
}

/** A rebuilt page, with its mention in the top margin (left of the title, away from the alignment marks). */
async function rebuiltImage(page: Raster, mention: string, type: string): Promise<string> {
  const canvas = new OffscreenCanvas(page.width, page.height);
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(new ImageData(new Uint8ClampedArray(page.data), page.width, page.height), 0, 0);
  const mm = page.width / 210;
  ctx.font = `${Math.max(8, Math.round(3 * mm))}px sans-serif`;
  ctx.fillStyle = '#555555';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(mention, 22 * mm, 7 * mm);
  return toDataUrl(canvas, type);
}

async function rebuild(req: Extract<PageCodeWorkerRequest, { kind: 'rebuild' }>): Promise<PageCodeWorkerResponse> {
  const copy: Raster[] = [];
  for (const image of req.copy) {
    copy.push(await raster(image));
  }
  const templates: Raster[] = [];
  for (const image of req.templates) {
    templates.push(await raster(image));
  }
  const { pages, issues } = rebuildCopy(copy, templates, req.canonical, req.layout);
  const images: string[] = [];
  for (const page of pages) {
    images.push(await rebuiltImage(page, req.mention, req.type));
  }
  return { kind: 'rebuilt', id: req.id, images, issues };
}

async function handle(req: PageCodeWorkerRequest): Promise<PageCodeWorkerResponse> {
  if (req.kind === 'rebuild') {
    return rebuild(req);
  }
  if (req.kind === 'read') {
    const img = await bitmap(req.image);
    const bottom = await readBand(img, false);
    const top = bottom.length > 0 ? [] : await readBand(img, true);
    img.close();
    return { kind: 'read', id: req.id, ...pickCode(bottom, top) };
  }
  if (req.kind === 'rotate') {
    const img = await bitmap(req.image);
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d')!;
    ctx.translate(img.width, img.height);
    ctx.rotate(Math.PI);
    ctx.drawImage(img, 0, 0);
    img.close();
    return { kind: 'image', id: req.id, image: await toDataUrl(canvas, req.type) };
  }
  const like = await bitmap(req.like);
  const canvas = new OffscreenCanvas(like.width, like.height);
  like.close();
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return { kind: 'image', id: req.id, image: await toDataUrl(canvas, req.type) };
}

addEventListener('message', ({ data }: MessageEvent<PageCodeWorkerRequest>) => {
  handle(data)
    .then(res => postMessage(res))
    .catch((e: unknown) => {
      const message: PageCodeWorkerResponse = { kind: 'failure', id: data.id, message: e instanceof Error ? e.message : String(e) };
      postMessage(message);
    });
});
