export const worker = new Worker(new URL('../../opencv.worker', import.meta.url));

export const worker1: () => Worker = function () {
  return new Worker(new URL('../../align.pool.worker', import.meta.url), { type: 'module' });
};

export const workersqllite = new Worker(new URL('../../dbsqlite.worker', import.meta.url));

const channel = new MessageChannel();

workersqllite.postMessage({ msg: 'shareWorker', uid: '-1', port: channel.port1 }, [channel.port1]);
worker.postMessage({ msg: 'shareWorker', uid: '-1', port: channel.port2 }, [channel.port2]);
