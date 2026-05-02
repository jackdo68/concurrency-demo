# Concurrency Demo

A Node.js demo showing the difference between async concurrency and true parallelism using two workloads: I/O-bound and CPU-bound.

## How to run

```bash
npm run io    # I/O-bound demo: fetching 10 URLs
npm run cpu   # CPU-bound demo: heavy hashing
```

## What you'll see

**I/O demo:**
```
Sequential: ~10000ms
Concurrent: ~1000ms
```
Async concurrency wins because tasks spend time *waiting* — the event loop fires all requests at once instead of one at a time.

**CPU demo:**
```
Sequential:  ~8000ms
Promise.all: ~8000ms
Parallel:    ~2000ms
```
`Promise.all` is no faster than sequential for CPU work — it doesn't add cores. Worker threads win because they run on real OS threads across multiple CPU cores.

## The rule

| Workload | Use |
|---|---|
| Waiting on I/O (network, DB, disk) | `Promise.all` / async |
| Heavy computation | Worker threads |
