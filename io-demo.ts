// io-demo.ts
import { request } from 'undici';

const URLS = Array.from({ length: 10 }, (_, i) =>
  `https://httpbin.org/delay/1?id=${i}` // each URL takes ~1s
);

async function fetchOne(url: string) {
  const { body } = await request(url);
  await body.text();
}

// 1. Sequential — wait for each, one at a time
async function sequential() {
  const start = Date.now();
  for (const url of URLS) {
    await fetchOne(url);
  }
  console.log(`Sequential: ${Date.now() - start}ms`);
}

// 2. Async concurrent — fire all at once, wait together
async function concurrent() {
  const start = Date.now();
  await Promise.all(URLS.map(fetchOne));
  console.log(`Concurrent: ${Date.now() - start}ms`);
}

(async () => {
  await sequential(); // ~10,000ms
  await concurrent(); // ~1,000ms
})();