import { describe, expect, it } from 'vitest';
import type { PipelineEvent, PipelineRunState } from '@/services/api';
import { activeComponents, journeyStatus, logLines, nodeStates, runSummary, stageStates } from './pipeline';

let seq = 0;
const ev = (e: Partial<PipelineEvent>): PipelineEvent => ({ type: 'stage', runId: 'r', seq: seq++, timestamp: '2026-09-27T10:00:00Z', elapsedMs: seq, stage: 'service', status: 'completed', ...e });

describe('pipeline trace helpers', () => {
  it('derives stage states only from emitted events', () => {
    const events = [
      ev({ stage: 'api', status: 'running', spanId: 'a', component: 'api:POST /api/trips/{trip_id}/disruptions' }),
      ev({ stage: 'service', status: 'running', spanId: 's', component: 'module:app.services.disruption_service' }),
    ];
    let st = stageStates(events);
    expect(st.api.status).toBe('running');
    expect(st.service.status).toBe('running');
    expect(st.recovery.status).toBe('idle');
    events.push(ev({ stage: 'service', status: 'completed', spanId: 's', durationMs: 12, component: 'module:app.services.disruption_service' }));
    events.push(ev({ stage: 'provider', status: 'failed', spanId: 'p', error: 'ProviderFailureError', component: 'module:app.providers.mock_flight_provider' }));
    st = stageStates(events);
    expect(st.service).toMatchObject({ status: 'completed', runs: 1, totalMs: 12 });
    expect(st.provider.status).toBe('failed');
    const active = activeComponents(events);
    expect(active.running.has('api:POST /api/trips/{trip_id}/disruptions')).toBe(true);
    expect(active.done.has('module:app.services.disruption_service')).toBe(true);
    expect(active.failed.has('module:app.providers.mock_flight_provider')).toBe(true);
  });

  it('maps engine statuses to journey statuses without guessing', () => {
    expect(journeyStatus('delayed', 'disrupted')).toBe('delayed');
    expect(journeyStatus('delayed', 'affected')).toBe('affected');
    expect(journeyStatus('broken', 'affected')).toBe('affected');
    expect(journeyStatus('at-risk', 'affected')).toBe('at-risk');
    expect(journeyStatus('healthy', 'no_dependency_path')).toBe('unaffected');
    expect(journeyStatus('healthy', undefined)).toBe('normal');
    expect(journeyStatus('recovered', undefined)).toBe('recovered');
  });

  it('builds a compact log and summary from node and stage events', () => {
    const events = [
      ev({ stage: 'event', message: 'Flight delayed by 120 minutes' }),
      ev({ stage: 'impact_engine', message: 'Impact engine: propagate' }),
      ev({ stage: 'impact_engine', message: 'Impact engine: propagate' }),
      ev({ type: 'node', stage: 'dependency_graph', nodeId: 'f', title: 'Flight', status: 'delayed', relation: 'disrupted', reason: 'Delayed by 120 minutes.' }),
      ev({ type: 'node', stage: 'dependency_graph', nodeId: 't', title: 'Transfer', status: 'broken', relation: 'affected', reason: 'Buffer gone.' }),
      ev({ type: 'node', stage: 'dependency_graph', nodeId: 'h', title: 'Hotel', status: 'at-risk', relation: 'affected', reason: 'Uncertain.' }),
      ev({ type: 'node', stage: 'dependency_graph', nodeId: 'e', title: 'Event', status: 'healthy', relation: 'no_dependency_path', reason: 'No dependency path from Flight.' }),
      ev({ stage: 'database', message: 'Database write', detail: { operation: 'write', tables: { itinerary_nodes: { update: 4 } } } }),
    ];
    const lines = logLines(events).map((l) => `${l.icon} ${l.text}`);
    expect(lines).toContain('✓ Impact engine: propagate ×2');
    expect(lines).toContain('— Event unaffected — No dependency path from Flight.');
    expect(lines).toContain('⚠ Hotel at risk — Uncertain.');
    expect(lines).toContain('✓ Database write: itinerary_nodes (4 update)');
    expect(Object.keys(nodeStates(events))).toEqual(['f', 't', 'h', 'e']);
    const run = { runId: 'r', workflow: 'flight_delay', mode: 'live', dataSource: 'demo', paceMs: 0, fault: null, done: true, error: null, startedAt: '', events, result: null } as PipelineRunState;
    expect(runSummary(run)).toMatchObject({ status: 'completed', affected: 2, atRisk: 1, unaffected: 1, errors: 0 });
  });
});
