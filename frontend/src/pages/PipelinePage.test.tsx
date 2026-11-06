import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { PipelinePage } from './PipelinePage';
import * as api from '@/services/api';
import type { Trip } from '@/types';

vi.mock('@/components/pipeline/ArchitectureView', () => ({ ArchitectureView: () => <div data-testid="architecture" /> }));
vi.mock('@/services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/api')>();
  return { ...actual, getPipelineDemo: vi.fn(), getArchitecture: vi.fn(), startPipelineRun: vi.fn(), getPipelineEvents: vi.fn(), checkHealth: vi.fn(async () => true) };
});

const node = (id: string, title: string, category: string, start: string) => ({
  id, title, category, label: title, subtitle: `${title} booking`, location: '', scheduledTime: '', provider: 'Demo', cost: 0,
  cancellationPolicy: '', refundable: false, riskLevel: 0, dependencyCount: 0, status: 'healthy', day: 1, icon: 'plane', scheduledStart: start,
});
const trip = { id: 'trip-pipeline-demo', name: 'Demo Trip', route: 'Mumbai → Delhi → Leh', nodes: [
  node('f', 'Mumbai → Delhi', 'flight', '2025-09-12T06:30:00'),
  node('t', 'Airport Transfer', 'transfer', '2025-09-12T11:50:00'),
  node('e', 'Nubra Valley Excursion', 'activity', '2025-09-14T07:00:00'),
] } as unknown as Trip;

let seq = 0;
const ev = (e: Partial<api.PipelineEvent>): api.PipelineEvent => ({ type: 'stage', runId: 'run_1', seq: seq++, timestamp: '2026-09-27T10:00:00Z', elapsedMs: seq, stage: 'service', status: 'completed', ...e });
const state = (events: api.PipelineEvent[], done: boolean, result: api.PipelineRunState['result'] = null): api.PipelineRunState =>
  ({ runId: 'run_1', workflow: 'flight_delay', mode: 'live', dataSource: 'demo', paceMs: 350, fault: null, done, error: null, startedAt: '', events, result });

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
}

beforeEach(() => {
  seq = 0;
  vi.mocked(api.getPipelineDemo).mockResolvedValue({ trip, traveller: 'Demo Traveller', workflows: [
    { id: 'flight_delay', label: 'Flight delay', mode: 'live', dataSource: 'demo', description: '', available: true, note: null },
    { id: 'live_flight', label: 'Live flight feed', mode: 'live', dataSource: 'live', description: '', available: false, note: 'AVIATIONSTACK_API_KEY is not configured on the server.' },
  ] });
  vi.mocked(api.getArchitecture).mockResolvedValue({ nodes: [], edges: [], routes: [], layers: [] });
  vi.mocked(api.startPipelineRun).mockReset();
  vi.mocked(api.getPipelineEvents).mockReset();
});

const stage = (label: string) => screen.getByRole('button', { name: new RegExp(`^${label}: `) }).getAttribute('aria-label');
const journeyNode = (title: string) => within(screen.getByRole('list', { name: 'Journey' })).getByRole('button', { name: new RegExp(`^${title}: `) }).getAttribute('aria-label');

describe('PipelinePage', () => {
  it('advances only when the backend delivers trace events', async () => {
    const batch1 = deferred<api.PipelineRunState>();
    const batch2 = deferred<api.PipelineRunState>();
    vi.mocked(api.startPipelineRun).mockResolvedValue(state([], false));
    vi.mocked(api.getPipelineEvents).mockReturnValueOnce(batch1.promise).mockReturnValueOnce(batch2.promise);
    render(<PipelinePage />);
    await screen.findByRole('button', { name: /^Mumbai → Delhi: / });
    expect(journeyNode('Mumbai → Delhi')).toBe('Mumbai → Delhi: On track');

    fireEvent.click(screen.getByRole('button', { name: /Run live scenario/ }));
    await waitFor(() => expect(api.startPipelineRun).toHaveBeenCalledWith('flight_delay', { delayMinutes: 120 }, 350));
    expect(stage('Impact engine')).toBe('Impact engine: Idle');

    await act(async () => batch1.resolve(state([
      ev({ stage: 'event', message: 'Mumbai → Delhi delayed by 120 minutes' }),
      ev({ stage: 'api', status: 'running', spanId: 'a', message: 'POST /api/trips/{trip_id}/disruptions received', component: 'api:POST /api/trips/{trip_id}/disruptions' }),
      ev({ stage: 'impact_engine', status: 'running', spanId: 'i', function: 'PropagationEngine.propagate' }),
    ], false)));
    expect(stage('API')).toBe('API: Running');
    expect(stage('Impact engine')).toBe('Impact engine: Running');
    expect(stage('Recovery engine')).toBe('Recovery engine: Idle');

    await act(async () => batch2.resolve(state([
      ev({ stage: 'impact_engine', status: 'completed', spanId: 'i', function: 'PropagationEngine.propagate', file: 'backend/app/engines/propagation_engine.py', line: 277 }),
      ev({ type: 'node', stage: 'dependency_graph', nodeId: 'f', title: 'Mumbai → Delhi', status: 'delayed', relation: 'disrupted', reason: 'Delayed by 120 minutes.', delayMinutes: 120 }),
      ev({ type: 'node', stage: 'dependency_graph', nodeId: 't', title: 'Airport Transfer', status: 'broken', relation: 'affected', reason: 'Required buffer is 60 minutes but only 0 minutes remain.', path: ['Mumbai → Delhi', 'Airport Transfer'] }),
      ev({ type: 'node', stage: 'dependency_graph', nodeId: 'e', title: 'Nubra Valley Excursion', status: 'healthy', relation: 'buffer_absorbed', reason: 'Downstream, but scheduled far enough ahead.' }),
      ev({ stage: 'recovery', function: 'RecoveryEngine.generate_plans' }),
      ev({ stage: 'api', status: 'completed', spanId: 'a', httpStatus: 200, component: 'api:POST /api/trips/{trip_id}/disruptions' }),
      ev({ stage: 'response', httpStatus: 200, message: 'Response HTTP 200 returned' }),
    ], true, { workflow: 'flight_delay', mode: 'live', dataSource: 'demo', trip, response: { recoveryOptions: [
      { id: 'opt-1', name: 'Rebook next available flight', description: 'Rebook Delhi → Leh', costDelta: 4200, timeImpactMinutes: 195, bookingsPreserved: 7, totalBookings: 7, feasible: true },
    ] } })));

    expect(journeyNode('Mumbai → Delhi')).toBe('Mumbai → Delhi: DELAYED');
    expect(journeyNode('Airport Transfer')).toBe('Airport Transfer: AFFECTED');
    expect(journeyNode('Nubra Valley Excursion')).toBe('Nubra Valley Excursion: UNAFFECTED');
    expect(stage('Recovery engine')).toBe('Recovery engine: Completed');
    expect(screen.getAllByText('DEMO DATA', { selector: 'span' })).toHaveLength(2); // header + execution panel
    expect(screen.getByText(/RECOMMENDATION · nothing is booked until applied/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Airport Transfer: / }));
    const details = screen.getByRole('complementary', { name: 'Details' });
    expect(details).toHaveTextContent('Required buffer is 60 minutes but only 0 minutes remain.');
    expect(details).toHaveTextContent('Mumbai → Delhi → Airport Transfer');
    expect(details).toHaveTextContent('backend/app/engines/propagation_engine.py:277');

    vi.mocked(api.startPipelineRun).mockResolvedValueOnce({ ...state([], true), workflow: 'apply_recovery' });
    vi.mocked(api.getPipelineEvents).mockResolvedValue({ ...state([], true, { workflow: 'apply_recovery', mode: 'live', dataSource: 'demo', trip, response: { applyStatus: 200 } }), workflow: 'apply_recovery' });
    fireEvent.click(within(screen.getByRole('region', { name: 'Recovery options' })).getAllByRole('button', { name: 'Apply recovery' })[0]);
    await waitFor(() => expect(api.startPipelineRun).toHaveBeenLastCalledWith('apply_recovery', { recoveryId: 'opt-1' }, 350));
  });

  it('marks simulations and explains unavailable live providers', async () => {
    render(<PipelinePage />);
    await screen.findByRole('button', { name: /^Mumbai → Delhi: / });
    expect(screen.getByText('AVIATIONSTACK_API_KEY is not configured on the server.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Use real Aviationstack delay/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('tab', { name: '◌ SIMULATION' }));
    expect(screen.getByRole('button', { name: /What if: flight \+120 min/ })).toBeInTheDocument();
    expect(screen.getByText(/nothing is saved/)).toBeInTheDocument();
  });
});
