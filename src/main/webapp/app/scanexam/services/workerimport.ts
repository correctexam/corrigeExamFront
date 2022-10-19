export const worker = new Worker(new URL('../../opencv.worker', import.meta.url));
export const worker1 = new Worker(new URL('../../align.pool.worker', import.meta.url), { type: 'module' });
// new Worker(new URL('../../align.pool.worker', import.meta.url));
