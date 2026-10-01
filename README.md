# Job Queue (From Scratch)

A distributed task queue built from scratch in JavaScript — no external 
libraries (no BullMQ, no Celery, no Redis) — to understand how job queues 
actually work under the hood: enqueueing, worker processing, retries, 
dead-letter queues, and concurrency.

## Status: 🚧 In Progress

## Implemented so far
- [x] `enqueue()` — producer pushes structured job objects into a queue
- [x] In-memory array as the queue
- [x] `worker()` — FIFO job processing (`.shift()`)
- [x] Task-type dispatch (different logic per `job.task`)
- [x] Graceful handling of an empty queue (no crash)

## Planned
- [ ] Jobs that actually do async work (simulated, can fail)
- [ ] Retry logic with backoff
- [ ] Dead-letter queue for jobs exceeding max retries
- [ ] Multiple concurrent workers, no double-processing
- [ ] Priority handling
- [ ] Persistence (likely Redis)