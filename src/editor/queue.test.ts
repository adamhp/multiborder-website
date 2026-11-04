import { expect, it } from 'vitest';
import { serialQueue } from './queue';

it('serialQueueRunsOneJobAtATimeAndSurvivesFailures', async () => {
  const run = serialQueue();
  let active = 0, peak = 0;
  const job = (fail = false) => async () => {
    active++;
    peak = Math.max(peak, active);
    await new Promise((r) => setTimeout(r, 5));
    active--;
    if (fail) throw new Error('boom');
    return 'done';
  };
  const results = await Promise.allSettled([run(job()), run(job(true)), run(job())]);
  expect(peak).toBe(1);
  expect(results.map((r) => r.status)).toEqual(['fulfilled', 'rejected', 'fulfilled']);
});
