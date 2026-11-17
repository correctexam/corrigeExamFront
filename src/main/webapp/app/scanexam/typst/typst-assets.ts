/**
 * Download of the Typst assets by the worker (T25b). A large asset (the compiler is 28 Mo) can come back
 * incomplete — interrupted download kept in the HTTP cache, proxy, antivirus — and the compiler would then fail
 * with an obscure Wasm error. Each download is checked against its `Content-Length` and retried once, bypassing
 * the cache, before failing with an explicit message.
 */

export type FetchFn = (input: URL, init?: RequestInit) => Promise<Response>;

const WASM_MAGIC = [0x00, 0x61, 0x73, 0x6d];

export class TypstAssetError extends Error {}

/** Length announced for the decoded body, when the server gives one (not for a compressed response). */
function expectedLength(res: Response): number | undefined {
  const encoding = res.headers.get('content-encoding');
  const length = Number(res.headers.get('content-length'));
  return (encoding === null || encoding === 'identity') && Number.isInteger(length) && length > 0 ? length : undefined;
}

async function download(fetchFn: FetchFn, url: URL, cache: RequestCache): Promise<{ bytes: Uint8Array; expected?: number }> {
  const res = await fetchFn(url, { cache });
  if (!res.ok) {
    throw new TypstAssetError(`${url.pathname}: HTTP ${res.status}`);
  }
  return { bytes: new Uint8Array(await res.arrayBuffer()), expected: expectedLength(res) };
}

function isComplete(bytes: Uint8Array, expected: number | undefined, wasm: boolean): boolean {
  if (expected !== undefined && bytes.length !== expected) {
    return false;
  }
  return !wasm || WASM_MAGIC.every((b, i) => bytes[i] === b);
}

/** Downloads an asset; `wasm`: also checks the WebAssembly header. */
export async function fetchAsset(fetchFn: FetchFn, url: URL, wasm = false): Promise<Uint8Array> {
  const first = await download(fetchFn, url, 'default');
  if (isComplete(first.bytes, first.expected, wasm)) {
    return first.bytes;
  }
  const second = await download(fetchFn, url, 'reload');
  if (isComplete(second.bytes, second.expected, wasm)) {
    return second.bytes;
  }
  throw new TypstAssetError(
    `${url.pathname}: incomplete download (${second.bytes.length} bytes received, ${second.expected ?? 'unknown'} expected). ` +
      'Clear the browser cache for this site (or unregister its service worker) and reload.',
  );
}
