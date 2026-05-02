import { workerData, parentPort } from 'node:worker_threads';
import { createHash } from 'node:crypto';

let hash = String(workerData as number);
for (let i = 0; i < 2_000_000; i++) {
  hash = createHash('sha256').update(hash).digest('hex');
}
parentPort!.postMessage(hash);
