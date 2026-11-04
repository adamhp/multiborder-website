/**
 * Runs jobs one at a time in the order they're queued, whoever queues them, like the app's render queue.
 * A failed job rejects its own promise and doesn't stop the jobs after it.
 */
export function serialQueue() {
  let tail: Promise<unknown> = Promise.resolve();
  return <T>(work: () => Promise<T>): Promise<T> => {
    const run = tail.then(work, work);
    tail = run.catch(() => undefined);
    return run;
  };
}
