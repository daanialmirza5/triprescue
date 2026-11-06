import { describe, expect, it } from 'vitest';
import type { PipelineEvent, PipelineRunState } from '@/services/api';
import { journeyStatus, logLines, runSummary } from './pipeline';

const ev = (e: Partial<PipelineEvent>): PipelineEvent => ({ type: 'stage', runId: 'r', seq: 0, timestamp: '2026-10-02T10:00:00Z', elapsedMs: 5, stage: 'service', status: 'completed', ...e });
const run = (events: PipelineEvent[], extra: Partial<PipelineRunState> = {}) =>
  ({ runId: 'r', workflow: 'provider_failure', mode: 'live', dataSource: 'demo', paceMs: 0, fault: 'timeout', done: true, error: null, startedAt: '', events, result: null, ...extra }) as PipelineRunState;

describe('pipeline run states', () => {
  it('is idle before anything runs', () => {
    expect(runSummary(null)).toMatchObject({ status: 'idle', affected: 0, errors: 0, durationMs: 0 });
  });

  it('counts failed stages as errors and reports a failed run', () => {
    const events = [ev({ stage: 'provider', status: 'failed', function: 'MockFlightProvider.get_alternatives', error: 'ProviderFailureError', message: 'Flight inventory' })];
    expect(runSummary(run(events))).toMatchObject({ status: 'completed', errors: 1 });
    expect(runSummary(run(events, { error: 'RuntimeError' })).status).toBe('failed');
    expect(logLines(events)[0]).toMatchObject({ icon: '×', tone: 'bad', text: 'Flight inventory failed (ProviderFailureError)' });
  });

  it('treats cancellations as affected', () => {
    expect(journeyStatus('cancelled', 'disrupted')).toBe('cancelled');
    const events = [ev({ type: 'node', nodeId: 'f', title: 'Flight', status: 'cancelled', relation: 'disrupted', reason: 'Cancelled.' })];
    expect(runSummary(run(events))).toMatchObject({ affected: 1, unaffected: 0 });
  });
});
