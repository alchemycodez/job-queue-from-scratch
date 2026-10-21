# In-Memory Job Queue — Built from Scratch

A lightweight job queue implemented in JavaScript to understand how background job processing works under the hood — including FIFO scheduling, asynchronous workers, retries, and dead-letter queues.

This is a learning project built without external queue libraries or Redis.

## Overview

Job queues allow applications to enqueue tasks and process them asynchronously rather than making every operation happen immediately in the main request flow.

I built this project from scratch to explore the core mechanics of a job queue: storing jobs, distributing them among workers, handling failures, and retrying unsuccessful tasks.

## Features

- **FIFO queue:** Processes jobs in first-in, first-out order using a JavaScript array.
- **Asynchronous task execution:** Simulates tasks that complete asynchronously and can fail.
- **Concurrent workers:** Runs two workers that can process separate jobs during overlapping periods.
- **Retry mechanism:** Retries failed jobs once, allowing up to two total attempts.
- **Dead-letter queue:** Stores jobs that exhaust their attempts or contain an unknown task type.
- **Empty queue handling:** Workers exit cleanly when no jobs remain.
- **Task dispatching:** Routes jobs to the appropriate handler based on their task type.

## Tech Stack

- JavaScript
- Node.js
- Promises and `async/await`
- JavaScript arrays
- `setTimeout` for simulating asynchronous work

No external libraries are required.

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/).

### Run the project

Clone this repository and navigate to its directory. Then run:

```bash
node job.js
```

The program creates sample jobs, starts two workers, and logs task execution results.

Task outcomes are randomized, so a job may succeed immediately, be retried, or eventually move to the dead-letter queue.

## How It Works

### 1. Enqueue jobs

The `enqueue()` function creates a job object and adds it to the queue.

Each job contains:

```js
{
  task: "sendEmail",
  to: "x@y.com",
  attempts: 0
}
```

The `task` field identifies the operation, `to` holds the task's target, and `attempts` tracks previous failures.

### 2. Process jobs with workers

Each `worker()` repeatedly retrieves the next job using `arr1.shift()`.

Two workers run concurrently. When one worker awaits an asynchronous task, the other can continue processing a different job.

This demonstrates concurrency within a single Node.js process; it does not mean the JavaScript tasks execute in parallel on separate CPU cores.

### 3. Handle failures and retries

When a task fails, the worker checks its attempt count.

- If another attempt is allowed, the job is added back to the queue.
- If the job reaches the maximum of two total attempts, it is moved to `failedJobs`.

Retries currently happen immediately, without a backoff delay.

### 4. Handle invalid tasks

If a job contains an unrecognized task type, it is moved directly to `failedJobs` rather than being silently discarded.

### 5. Handle an empty queue

Workers check whether the queue contains jobs before processing. If the queue is empty, they exit without attempting to access a nonexistent job.

## Processing Flow

```text
       enqueue()
           |
           v
    In-memory queue
           |
           v
      Two workers
           |
           v
    Execute task
           |
       +---+---+
       |       |
    Success   Failure
       |       |
       v       v
    Complete  Retry allowed?
                 |
             +---+---+
             |       |
            Yes      No
             |       |
             v       v
        Re-enqueue  Dead-letter
                    queue
```

## Current Limitations

This implementation focuses on understanding the fundamentals rather than production use.

- Jobs and failed jobs are stored in memory and are lost when the Node.js process exits.
- Task execution is simulated rather than connected to real email, image-processing, or application services.
- Retries have no delay or exponential backoff.
- Workers process the jobs available to this script and exit when the queue is drained; they do not continuously listen for future jobs.
- There is no persistent storage, priority scheduling, or multi-process distribution.

## Purpose

The goal of this project is to build a deeper understanding of backend systems by implementing their core mechanisms from scratch before relying on established queue libraries.
