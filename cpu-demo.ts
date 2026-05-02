// cpu-demo.ts
import { Worker } from 'node:worker_threads';
import { createHash } from 'node:crypto';

function heavyHash(seed: number): string {
  let hash = String(seed);
  for (let i = 0; i < 2_000_000; i++) {
    hash = createHash('sha256').update(hash).digest('hex');
  }
  return hash;
}

const SEEDS = [1, 2, 3, 4];

// 1. Sequential
function sequential() {
  const start = Date.now();
  SEEDS.forEach(heavyHash);
  console.log(`Sequential: ${Date.now() - start}ms`);
}

// 2. "Concurrent" with Promise.all — spoiler: NOT faster
async function fakeConcurrent() {
  const start = Date.now();
  await Promise.all(SEEDS.map(async (s) => heavyHash(s)));
  console.log(`Promise.all: ${Date.now() - start}ms`);
}

// 3. Real parallelism with worker threads
function parallel() {
  return new Promise<void>((resolve) => {
    const start = Date.now();
    let done = 0;
    SEEDS.forEach((seed) => {
      const worker = new Worker(
        new URL('./hash-worker.ts', import.meta.url),
        { workerData: seed }
      );
      worker.on('message', () => {
        if (++done === SEEDS.length) {
          console.log(`Parallel: ${Date.now() - start}ms`);
          resolve();
        }
      });
    });
  });
}

(async () => {
  sequential();        // e.g. 8000ms
  await fakeConcurrent(); // e.g. 8000ms — same!
  await parallel();    // e.g. 2000ms on a 4-core machine
})();